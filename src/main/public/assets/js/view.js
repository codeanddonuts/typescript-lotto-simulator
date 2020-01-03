import { NUMBER_OF_PICKS } from "./app.js"
import { Templates } from "./templates.js"

export class View {
  constructor(price, maxPurchaseAmount, recentRound, investment, result) {
    this.templates = new Templates()
    this.price = price
    this.maxPurchaseAmount = maxPurchaseAmount
    this.recentRound = recentRound
    this.initView()
    this.dispatchHandlers(investment, result)
  }

  initView() {
    document.getElementsByTagName("main")[0].insertAdjacentHTML(
        "afterbegin",
        this.templates.bakeFrontPage(this.price, this.maxPurchaseAmount, this.recentRound)
    )
    document.getElementById("round").insertAdjacentHTML("beforeend", this.templates.bakeRoundOptions(this.recentRound))
    this.maxManualInputs = 0
    this.numberOfManualInputs = 0
  }

  dispatchHandlers(investment, result) {
    investment.subscribe(x => this.resetInvestmentAmount(x))
    result.subscribe(x => this.renderResult(x))
    rxjs.fromEvent(document, "click")
        .subscribe(event => {
          switch (event.target.id) {
            case "add-manual-inputs":
              return this.addManualInputs()
            case "remove-manual-inputs":
              return this.removeManualInputs()
            case "replay":
              return this.resetView()
          }
        })
  }

  resetInvestmentAmount(validatedInvestment) {
    document.getElementById("investment").value = validatedInvestment
    this.maxManualInputs = Math.floor(validatedInvestment / this.price)
    while (this.maxManualInputs < this.numberOfManualInputs) {
      this.removeManualInputs()
    }
  }

  addManualInputs() {
    if (this.maxManualInputs <= this.numberOfManualInputs) {
      alert("투자금이 부족합니다.")
      return
    }
    const textbox = document.createElement("input")
    textbox.setAttribute("type", "text")
    textbox.setAttribute("name", `manual-picks[${this.numberOfManualInputs}]`)
    const manualPicksContainer = document.getElementById("manual-picks-container")
    manualPicksContainer.appendChild(textbox)
    manualPicksContainer.appendChild(document.createElement("br"))
    if (++this.numberOfManualInputs === 1) {
      document.getElementById("guide").innerText = `쉼표로 ${NUMBER_OF_PICKS}개의 번호를 구분하여 입력해주세요.`
    }
  }

  removeManualInputs() {
    if (this.numberOfManualInputs > 0) {
      const container = document.getElementById("manual-picks-container")
      container.removeChild(container.lastChild)
      container.removeChild(container.lastChild)
      if (--this.numberOfManualInputs === 0) {
        document.getElementById("guide").innerText = ""
      }
    }
  }

  renderResult(result) {
    const view = this.templates.bakeResultPage(result)
    document.getElementById("front-page").outerHTML = ""
    document.getElementsByTagName("main")[0].insertAdjacentHTML("beforeend", view)
  }

  resetView() {
    document.getElementById("result-page").outerHTML = ""
    this.initView()
  }
}
