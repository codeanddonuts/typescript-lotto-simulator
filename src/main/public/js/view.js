import { NUMBER_OF_PICKS } from "./model.js"
import { Templates } from "./templates.js"

export class View {
  constructor(shopInfo, streams) {
    this.templates = new Templates()
    this.shopInfo = shopInfo
    this.initView()
    this.dispatchHandlers(streams)
  }

  initView() {
    document.getElementsByTagName("main")[0].insertAdjacentHTML(
        "afterbegin",
        this.templates.bakeFrontPage(this.shopInfo)
    )
    document.getElementById("round").insertAdjacentHTML("beforeend", this.templates.bakeRoundOptions(this.shopInfo.recentRound))
    this.maxManualInputs = 0
    this.numberOfManualInputs = 0
  }

  dispatchHandlers(streams) {
    streams.investment$.subscribe(x => this.resetInvestmentAmount(x))
    streams.manualPicks$.subscribe(x => this.resetInvalidateManualPicks(x))
    streams.result$.subscribe(x => this.renderResult(x))
    rxjs.fromEvent(document, "click")
        .subscribe(event => {
          switch (event.target.id) {
            case "add-manual-picks":
              return this.addManualPicks()
            case "remove-manual-picks":
              return this.removeManualPicks()
            case "replay":
              return this.resetView()
          }
        })
  }

  resetInvestmentAmount(validatedInvestment) {
    document.getElementById("investment").value = validatedInvestment
    this.maxManualInputs = Math.floor(validatedInvestment / this.shopInfo.price)
    while (this.maxManualInputs < this.numberOfManualInputs) {
      this.removeManualPicks()
    }
  }

  addManualPicks() {
    if (this.maxManualInputs <= this.numberOfManualInputs) {
      return alert("투자금이 부족합니다.")
    }
    document.getElementById("manual-picks-container").insertAdjacentHTML("beforeend", this.templates.bakeManualInputBox())
    if (++this.numberOfManualInputs === 1) {
      document.getElementById("guide").innerText = `쉼표로 ${NUMBER_OF_PICKS}개의 번호를 구분하여 입력해주세요.`
    }
  }

  removeManualPicks() {
    if (this.numberOfManualInputs > 0) {
      const container = document.getElementById("manual-picks-container")
      container.removeChild(container.lastChild)
      container.removeChild(container.lastChild)
      if (--this.numberOfManualInputs === 0) {
        document.getElementById("guide").innerText = ""
      }
    }
  }

  resetInvalidateManualPicks({ target, isInvalid }) {
    if (isInvalid) {
      alert("잘못된 입력입니다. 1 ~ 45 범위의 서로 다른 6개 숫자를 쉼표로 구분하여 다시 입력해주시기 바랍니다.")
      target.focus()
      target.value = ""
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
