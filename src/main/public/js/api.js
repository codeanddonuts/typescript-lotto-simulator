export class Api {
  async fetchShopInfo() {
    return (await axios.get("/api?query={price,maxPurchaseAmount,recentRound}")).data
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
}
