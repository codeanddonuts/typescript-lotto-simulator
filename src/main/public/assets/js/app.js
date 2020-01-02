(() => {
  const NUMBER_OF_PICKS = 6

  class Api {
    async fetchShopPolicy() {
      return (await axios.get("/api?query={price,maxPurchaseAmount}")).data.data
    }

    async requestPurchase(investment, manualPicks) {
      return (await axios.post(
          "/api", {
            query:`
              mutation ($investment: Int!, $manualPicks: [[Int!]!]!) {
                purchase(investment: $investment, manualPicks: $manualPicks) {
                  totalPurchaseAmount
                  totalPrize
                }
              }
            `,
            variables: {
              investment: investment,
              manualPicks: manualPicks
            }
          }
        )
      )
    }
  }

  new class App {
    constructor(api) {
      api.fetchShopPolicy().then(res => {
        this.api = api
        this.price = res.price
        this.maxPurchaseAmount = res.maxPurchaseAmount
        this.initUi()
        this.bindEventListeners()
      }).catch(e => window.location.reload())
    }

    async initUi() {
      const formattedPrice = new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(this.price)
      document.getElementsByTagName("main")[0].insertAdjacentHTML("afterbegin", `
        <div id="front-page" class="inner">
          <header class="special">
            <h2>장당 ${formattedPrice}, 최대 ${this.maxPurchaseAmount}장</h2>
            <p>(수동으로 입력하지 않은 만큼은 자동 발권됩니다.)</p>
          </header>
          <section>
            <div class="content">
              투자금 : <input id="investment" type="text" name="investment" value="0" />
              <form id="purchase">
                <br />
                <div class="right">
                  수동 번호 입력 :
                  <input id="add-manual-inputs" type="button" value="+" />
                  <input id="remove-manual-inputs" type="button" value="-" />
                </div>
                <br />
                <br />
                <p id="manual-picks-container"></p>
                <p class="right">
                  <i id="guide"></i>
                </p>
                <br />
                <br />
                <div class="right" style="display: grid; grid-template-columns: repeat(3, 1fr); grid-gap: 10px; grid-auto-rows: minmax(100px, auto);">
                  <div style="grid-column: 3;">
                    <input id="submit-purchase" type="button" value="구매하기" />
                  </div>
                </div>
              </form>
            </div>
          </section>
        </div>
      `)
      this.max = 0
      this.amount = 0
    }
    
    bindEventListeners() {
      document.getElementById("investment").addEventListener("change", () => this.resetManualInputs())
      document.getElementById("add-manual-inputs").addEventListener("click", () => this.addManualInputs())
      document.getElementById("remove-manual-inputs").addEventListener("click", () => this.removeManualInputs())
      document.getElementById("submit-purchase").addEventListener("click", () => this.submitPurchase())
    }

    resetManualInputs() {
      const investment = document.getElementById("investment")
      if (isNaN(investment.value) || investment.value < 0) {
        investment.value = 0
      } else if (investment.value > this.maxPurchaseAmount * this.price) {
        investment.value = this.maxPurchaseAmount * this.price
      }
      console.log(this.maxPurchaseAmount)
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
      textbox.setAttribute("name", `manual-picks[${this.amount}]`)
      const manualNumbersContainer = document.getElementById("manual-picks-container")
      manualNumbersContainer.appendChild(textbox)
      manualNumbersContainer.appendChild(document.createElement("br"))
      if (++this.amount === 1) {
        document.getElementById("guide").innerText = `쉼표로 ${NUMBER_OF_PICKS}개의 번호를 구분하여 입력해주세요.`
      }
    }

    removeManualInputs() {
      if (this.amount > 0) {
        const container = document.getElementById("manual-picks-container")
        container.removeChild(container.lastChild)
        container.removeChild(container.lastChild)
        if (--this.amount === 0) {
          document.getElementById("guide").innerText = ""
        }
      }
    }

    async submitPurchase() {
      const investment = parseInt(document.getElementById("investment").value, 10)
      const manualPicks = Array.from((new FormData(document.getElementById("purchase"))).values())
                               .map(str => str.split(",").map(x => parseInt(x, 10)).slice(0, NUMBER_OF_PICKS))
                               .filter(arr => !arr.includes(NaN) && arr.length === NUMBER_OF_PICKS)
      try {
        this.renderResult((await this.api.requestPurchase(investment, manualPicks)).data)
      } catch (e) {
        alert(JSON.stringify(e))
      }
    }

    renderResult(result) {
      const view = result.data.purchase ? this.applyResultTemplate(result.data.purchase) : result.errors[0].message
      document.getElementById("front-page").outerHTML = ""
      document.getElementsByTagName("main")[0].insertAdjacentHTML(
          "beforeend",
          '<div id="result-page" class="inner center">' + view + '<br /><br /><br /><button id="replay">다시 플레이</button>'
      )
      document.getElementById("replay").addEventListener("click", () => this.replay())
    }

    applyResultTemplate({ totalPurchaseAmount, totalPrize }) {
      return `
        <section>
          <div class="content">
            <b>제 {round}회</b> : {winningNumbers}
          </div>
          <br />
          <div class="content">
            {purchasedLottos}
          </div>
          <br />
          <div class="content">
            ${totalPurchaseAmount}줄 구매, ${totalPrize}원 당첨
          </div>
        </section>
      `
    }

    replay() {
      document.getElementById("result-page").outerHTML = ""
      this.initUi()
      this.bindEventListeners()
    }
  }(new Api())
})()
