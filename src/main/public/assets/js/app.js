import { View } from "./view.js"

export const NUMBER_OF_PICKS = 6

new class App {
  constructor() {
    this.fetchShopPolicy().then(res => {
      this.investmentValidator = new rxjs.Subject()
      this.result = new rxjs.Subject()
      this.maxInvestment = res.price * res.maxPurchaseAmount
      this.view = new View(res.price, res.maxPurchaseAmount, this.investmentValidator, this.result)
      this.dispatchHandlers()
    }).catch(e => alert(e))
  }

  async fetchShopPolicy() {
    return (await axios.get("/api?query={price,maxPurchaseAmount}")).data.data
  }
  
  dispatchHandlers() {
    rxjs.fromEvent(document, "change")
        .subscribe(event => {
          if (event.target.id === "investment") {
            this.validateInvestmentAmount(event.target.value)
          }
        })
    rxjs.fromEvent(document, "click")
        .subscribe(event => {
          if (event.target.id === "submit-purchase") {
            this.submitPurchase()
          }
        })
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
    this.investmentValidator.next(validatedInvestment)
  }

  async submitPurchase() {
    const investment = parseInt(document.getElementById("investment").value, 10)
    const manualPicks = Array.from((new FormData(document.getElementById("purchase"))).values())
                             .map(str => str.split(",").map(x => parseInt(x, 10)).slice(0, NUMBER_OF_PICKS))
                             .filter(arr => !arr.includes(NaN) && arr.length === NUMBER_OF_PICKS)
    try {
      this.result.next((await this.requestPurchase(investment, manualPicks)).data)
    } catch (e) {
      alert(JSON.stringify(e))
    }
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
}()
