import { View } from "./view.js"
const filter = rxjs.operators.filter

export const NUMBER_OF_PICKS = 6

new class App {
  constructor() {
    try {
      this.cons()
    } catch (e) {
      alert(e)
    }
  }

  async cons() {
    const res = await this.fetchShopPolicy()
    if (res.data === null) {
      throw new Error(res.errors[0].message)
    }
    const shopPolicy = res.data
    this.maxInvestment = shopPolicy.price * shopPolicy.maxPurchaseAmount
    this.investment = new rxjs.Subject()
    this.result = new rxjs.Subject()
    this.view = new View(shopPolicy.price, shopPolicy.maxPurchaseAmount, shopPolicy.recentRound, this.investment, this.result)
    this.dispatchHandlers()
  }

  async fetchShopPolicy() {
    return (await axios.get("/api?query={price,maxPurchaseAmount,recentRound}")).data
  }
  
  dispatchHandlers() {
    rxjs.fromEvent(document, "change")
        .pipe(filter(event => event.target.id === "investment"))
        .subscribe(event => this.validateInvestmentAmount(event.target.value))
    rxjs.fromEvent(document, "click")
        .pipe(filter(event => event.target.id === "submit-purchase"))
        .subscribe(() => this.submitPurchase())
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
    this.investment.next(validatedInvestment)
  }

  async submitPurchase() {
    const investment = parseInt(document.getElementById("investment").value, 10)
    const manualPicks = Array.from((new FormData(document.getElementById("purchase"))).values())
                             .map(str => str.split(",").map(x => parseInt(x, 10)).slice(0, NUMBER_OF_PICKS))
                             .filter(arr => arr.every(n => isFinite(n)))
                             .filter(arr => arr.length === NUMBER_OF_PICKS)
    const round = parseInt(document.getElementById("round").value, 10)
    try {
      this.result.next((await this.requestPurchase(investment, manualPicks, round)).data)
    } catch (e) {
      alert(JSON.stringify(e))
    }
  }

  async requestPurchase(investment, manualPicks, round) {
    return (await axios.post(
        "/api", {
          query:`
            mutation ($investment: Int!, $manualPicks: [[Int!]!]!, $round: Int) {
              purchase(investment: $investment, manualPicks: $manualPicks, round: $round) {
                totalPurchaseAmount
                totalPrize
              }
            }
          `,
          variables: {
            investment: investment,
            manualPicks: manualPicks,
            round: round
          }
        }
      )
    )
  }
}()
