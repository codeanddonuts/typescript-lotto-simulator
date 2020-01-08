import { NUMBER_OF_PICKS, PICK_RANGE } from "./model.mjs"
import { ViewTemplates } from "./view-templates.mjs"

export const view = ({ shopInfo, state$, error }) => {
  if (error) {
    alert(error)
    throw error
  }

  const templates = new ViewTemplates()
  const frontPage = templates.bakeFrontPage(shopInfo)
  const top = document.getElementById("top")
  const main = document.getElementsByTagName("main")[0]
  const investmentInput = frontPage.querySelector("#investment")
  const manualPicksContainer = frontPage.querySelector("#manual-picks-container")
  const manualPicksInputGuide = frontPage.querySelector("#guide")

  const resetInvestmentAmount = ({ investment, manualInputRemoveAmount }) => {
    investmentInput.value = investment
    removeManualPick(manualInputRemoveAmount)
  }

  const addManualPick = ({ isFirstManualPick, error }) => {
    if (error) {
      return alert(error)
    }
    manualPicksContainer.insertAdjacentHTML("beforeend", templates.bakeManualInputBox())
    if (isFirstManualPick) {
      manualPicksInputGuide.innerText = `쉼표로 ${NUMBER_OF_PICKS}개의 번호를 구분하여 입력해주세요.`
    }
  }

  const removeManualPick = ({ clearAll, toRemove }) => {
    if (clearAll) {
      manualPicksContainer.innerHTML = ""
      manualPicksInputGuide.innerText = ""
    } else {
      while (toRemove-- > 0) {
        manualPicksContainer.removeChild(manualPicksContainer.lastChild)
        manualPicksContainer.removeChild(manualPicksContainer.lastChild)
      }
    }
  }

  const clearInvalidManualPick = ({ isInvalid, target }) => {
    if (isInvalid) {
      alert(`잘못된 입력입니다. ${PICK_RANGE.MIN} ~ ${PICK_RANGE.MAX} 범위의 서로 다른 ${NUMBER_OF_PICKS}개 숫자를 쉼표로 구분하여 다시 입력해주시기 바랍니다.`)
      target.focus()
      target.value = ""
    }
  }

  const renderResultPage = ({ result, error }) => {
    if (error) {
      return alert(error)
    }
    const view = templates.bakeResultPage(result)
    document.getElementById("front-page").outerHTML = ""
    main.insertAdjacentHTML("beforeend", view)
    top.scrollIntoView()
  }

  const resetView = () => {
    document.getElementById("result-page").outerHTML = ""
    investmentInput.value = 0
    manualPicksContainer.innerHTML = ""
    main.appendChild(frontPage)
    top.scrollIntoView()
  }
  
  state$.investment$.subscribe(x => resetInvestmentAmount(x))
  state$.resetInvalidManualPick$.subscribe(x => clearInvalidManualPick(x))
  state$.addManualPick$.subscribe(x => addManualPick(x))
  state$.removeManualPick$.subscribe(x => removeManualPick(x))
  state$.result$.subscribe(x => renderResultPage(x))
  state$.replay$.subscribe(() => resetView())
  main.appendChild(frontPage)
}
