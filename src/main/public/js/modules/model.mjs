import { Api } from "./api.mjs"
const map = rxjs.operators.map
const flatMap = rxjs.operators.mergeMap
const from = rxjs.from
const tap = rxjs.operators.tap

export const NUMBER_OF_PICKS = 6

export const PICK_RANGE = {
  MIN: 1,
  MAX: 45
}

export const model = async actions => {
  const api = new Api()
  const { shopInfo, error } = await api.fetchShopInfo()
  if (error) {
    return {
      error: error
    }
  }
  
  const purchaseLimit = shopInfo.price * shopInfo.maxPurchaseAmount
  let numberOfManualPicks = 0
  let maxManualPicks = 0

  const validateInvestmentAmount = value => {
    const investment = (() => {
      if (isNaN(value) || value < 0) {
        return 0
      } else if (value > purchaseLimit) {
        return purchaseLimit
      }
      return parseInt(value, 10)
    })()
    maxManualPicks = Math.floor(investment / shopInfo.price)
    const difference = numberOfManualPicks - maxManualPicks
    numberOfManualPicks = Math.min(maxManualPicks, numberOfManualPicks)
    return {
      investment: investment,
      manualInputRemoveAmount: {
        clearAll: numberOfManualPicks === 0,
        toRemove: Math.max(difference, 0)
      }
    }
  }

  const checkMaxManualPicks = () => {
    if (numberOfManualPicks === maxManualPicks) {
      return {
        error: (investment === purchaseLimit) ? "더 이상 구매하실 수 없습니다." : "투자금이 부족합니다."
      }
    }
    return {
      isFirstManualPick: (++numberOfManualPicks == 1)
    }
  }

  const checkIfNoManualPicksExist = () => {
    if (numberOfManualPicks > 0) {
      return {
        toRemove: 1,
        clearAll: --numberOfManualPicks == 0
      }
    }
    return {
      toRemove: 0
    }
  }

  const validateManualPick = pick => {
    const picks = parseManualInput(pick.value)
    return {
      isInvalid: (picks.length !== 0) && !areValidPicks(picks),
      target: pick
    }
  }
  
  const purchase = async inputs => {
    const investment = parseInt(inputs.investment, 10)
    if (investment < shopInfo.price) {
      return {
        error: "지불 금액이 부족합니다."
      }
    }
    const manualPicks = Array.from(inputs.manualPicks.values())
                             .filter(x => x.trim().length !== 0)
                             .map(str => parseManualInput(str))
    if (manualPicks.every(arr => areValidPicks(arr))) {
      return await api.requestPurchase(investment, manualPicks, parseInt(inputs.round, 10))
    }
    return {
      error: "수동 입력 번호가 잘못되었습니다."
    }
  }

  const parseManualInput = str => str.split(",").map(x => parseInt(x, 10))
  
  const areValidPicks = picks => {
    return (picks.length === NUMBER_OF_PICKS)
        && (picks.length === (new Set(picks).size))
        && picks.every(n => PICK_RANGE.MIN <= n && n <= PICK_RANGE.MAX)
  }

  const reset = () => {
    numberOfManualPicks = 0
    maxManualPicks = 0
  }

  return {
    shopInfo: shopInfo,
    state$: {
      investment$: actions.changeInvestment$.pipe(map(x => validateInvestmentAmount(x))),
      addManualPick$: actions.clickAddButton$.pipe(map(x => checkMaxManualPicks(x))),
      removeManualPick$: actions.clickRemoveButton$.pipe(map(x => checkIfNoManualPicksExist(x))),
      resetInvalidManualPick$: actions.changeManualPick$.pipe(map(x => validateManualPick(x))),
      result$: actions.submitPurchase$.pipe(flatMap(x => from(purchase(x)))),
      replay$: actions.submitReplay$.pipe(tap(() => reset()))
    }
  }
}
