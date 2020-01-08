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
              mutation ($round: Int, $investment: Int!, $manualPicks: [[Int!]!]) {
                purchase(round: $round, investment: $investment, manualPicks: $manualPicks) {
                  round
                  games
                  winningNumbers {
                    mains
                    bonus
                  }
                  totalPrize
                }
              }
            `,
            variables: {
              round: round,
              investment: investment,
              manualPicks: manualPicks
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
