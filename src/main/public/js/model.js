import { intent } from "./intent.js"
import { Api } from "./api.js"
import { View } from "./view.js"

export const NUMBER_OF_PICKS = 6

const PICK_RANGE = {
  MIN: 1,
  MAX: 45
}

const model = () => {
  new class {
    constructor(actions) {
      try {
        this.cons(actions)
      } catch (e) {
        alert(e)
      }
    }

    async cons(actions) {
      this.api = new Api()
      const res = await this.api.fetchShopInfo()
      if (res.data === null) {
        throw new Error(res.errors[0].message)
      }
      const shopInfo = res.data
      this.maxInvestment = shopInfo.price * shopInfo.maxPurchaseAmount
      this.streams = {
        investment$: new rxjs.Subject(),
        manualPicks$: new rxjs.Subject(),
        result$: new rxjs.Subject()
      }
      this.view = new View(shopInfo, this.streams)
      this.dispatchHandlers(actions)
    }
    
    dispatchHandlers(actions) {
      actions.changeInvestment$.subscribe(x => this.validateInvestmentAmount(x))
      actions.changeManualPick$.subscribe(x => this.validateManualInput(x))
      actions.submitPurchase$.subscribe(() => this.submitPurchase())
    }

    validateInvestmentAmount(value) {
      const validatedInvestment = (() => {
        if (isNaN(value) || value < 0) {
          return 0
        } else if (value > this.maxInvestment) {
          return this.maxInvestment
        }
        return parseInt(value, 10)
      })()
      this.streams.investment$.next(validatedInvestment)
    }

    parseManualInput(str) {
      return str.split(",").map(x => parseInt(x, 10))
    }

    areValidPicks(picks) {
      return (picks.length === NUMBER_OF_PICKS) && picks.every(n => PICK_RANGE.MIN <= n && n <= PICK_RANGE.MAX)
    }

    validateManualInput(input) {
      const picks = this.parseManualInput(input.value)
      this.streams.manualPicks$.next({
        target: input,
        isInvalid: (picks.length !== 0) && !this.areValidPicks(picks)
      })
    }

    async submitPurchase() {
      const investment = parseInt(document.getElementById("investment").value, 10)
      const manualPicks = Array.from((new FormData(document.getElementById("ticket"))).values())
                               .map(str => this.parseManualInput(str))
                               .filter(arr => this.areValidPicks(arr))
      const round = parseInt(document.getElementById("round").value, 10)
      try {
        this.streams.result$.next((await this.api.requestPurchase(investment, manualPicks, round)).data)
      } catch (e) {
        alert(JSON.stringify(e))
      }
    }
  }(intent())
}

model()
