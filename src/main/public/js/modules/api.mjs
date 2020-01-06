export class Api {
  async fetchShopInfo() {
    try {
      const res = (await axios.get("/api?query={price,maxPurchaseAmount,recentRound}")).data
      return res.data ? { shopInfo: res.data } : { error: new Error(res.errors.map(e => e.message).join(", ")) }
    } catch (e) {
      return { error: e }
    }
  }

  async requestPurchase(investment, manualPicks, round) {
    try {
      const res = (await axios.post(
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
      ).data
      return res.data.purchase ? { result: res.data.purchase } : { error: res.errors.map(e => e.message).join(", ") }
    } catch (e) {
      return { error: e }
    }
  }
}
