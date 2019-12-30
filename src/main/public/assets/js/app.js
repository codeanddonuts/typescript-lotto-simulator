(() => {
  class Api {
    async fetchPrice() {
      return (await axios.get("/api?query={price}")).data.data.price
    }

    async requestPurchase() {
      const data = Object.fromEntries(new FormData(document.getElementById("purchase")))
      try {
        return (await axios.post(
            "/api/purchase",
            data, {
              headers: {
                "Content-Type": "application/json"
              }
            }
        )).data
      } catch (e) {
        return e.response.data
      }
    }
  }

  new class App {
    constructor(api) {
      this.api = api
      this.initUi()
      this.bindEventListeners()
    }

    async initUi() {
      this.price = await this.api.fetchPrice()
      document.getElementById("price-formatted").innerText = new Intl.NumberFormat(
          "ko-KR",
          { style: "currency", currency: "KRW" }
      ).format(this.price)
      document.getElementById("investment").value = 0
      this.max = 0
      this.amount = 0
    }
    
    bindEventListeners() {
      document.getElementById("investment").addEventListener("change", this.resetManualInputs.bind(this))
      document.getElementById("add-manual-inputs").addEventListener("click", this.addManualInputs.bind(this))
      document.getElementById("remove-manual-inputs").addEventListener("click", this.removeManualInputs.bind(this))
      document.getElementById("submit-purchase").addEventListener("click", this.submitPurchase)
    }

    resetManualInputs() {
      const investment = document.getElementById("investment")
      if (investment.value < 0 || isNaN(investment.value)) {
        investment.value = 0
      }
      this.max = Math.floor(investment.value / this.price)
      while (this.max < this.amount) {
        this.removeManualInputs()
      }
    }

    addManualInputs() {
      if (this.max <= this.amount) {
        alert("투자금이 부족합니다.")
        return
      }
      const textbox = document.createElement("input")
      textbox.setAttribute("type", "text")
      textbox.setAttribute("name", `manualNumbers[${this.amount}]`)
      const manualNumbersContainer = document.getElementById("manual-numbers-container")
      manualNumbersContainer.appendChild(textbox)
      manualNumbersContainer.appendChild(document.createElement("br"))
      if (++this.amount === 1) {
        document.getElementById("guide").innerText = "쉼표로 6개의 번호를 구분하여 입력해주세요."
      }
    }

    removeManualInputs() {
      if (this.amount > 0) {
        const container = document.getElementById("manual-numbers-container")
        container.removeChild(container.lastChild)
        container.removeChild(container.lastChild)
        if (--this.amount === 0) {
          document.getElementById("guide").innerText = ""
        }
      }
    }

    async submitPurchase() {
      const result = await this.api.requestPurchase()
      document.getElementById("front-page").outerHTML = ""
      document.getElementById("result-page").innerHTML = result
    }
  }(new Api())
})()