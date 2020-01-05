import { injectable, inject } from "inversify"
import { Controller } from "../../config/Controller"
import { ITypedef, gql, IResolvers } from "apollo-server-koa"
import { LottoShop } from "../service/LottoShop"
import { LottoMachine } from "../service/LottoMachine"
import { WinningNumbersApiClient } from "../service/WinningNumbersApiClient"
import { Money } from "../domain/Money"
import { PickGroup } from "../domain/Game"
import { PickedNumber } from "../domain/Pick"
import { Round } from "../domain/Round"

@injectable()
export class ShopController implements Controller {
  constructor(
    @inject(LottoShop) private readonly lottoShop: LottoShop,
    @inject(WinningNumbersApiClient) private readonly winningNumbersApiClient: WinningNumbersApiClient
  ) {}

  public typeDefs(): ITypedef {
    return gql`
      type Query {
        price: Int!
        maxPurchaseAmount: Int!
        recentRound: Int!
      }

      type Report {
        totalPurchaseAmount: Int!
        totalPrize: Int!
      }

      type Mutation {
        purchase(investment: Int!, manualPicks: [[Int!]!]!, round: Int): Report
      }
    `
  }

  public resolvers(): IResolvers<any, any> {
    return {
      Query: {
        price: () => LottoShop.PRICE_PER_GAME,
        maxPurchaseAmount: () => LottoMachine.MAX_PURCHASE_AMOUNT,
        recentRound: async () => (await this.winningNumbersApiClient.getRecent()).round.num
      },
      Mutation: {
        purchase: async (_, { investment, manualPicks, round }) => {
          const validatedPicks = (manualPicks as number[][]).map(numbers => PickGroup(numbers.map(n => PickedNumber(n))))
          const winningNumbers = round ? this.winningNumbersApiClient.get(new Round(round)) : this.winningNumbersApiClient.getRecent()
          const ticket = await this.lottoShop.purchase(investment as Money, validatedPicks, round ? new Round(round) : undefined)
          return ticket.matchResult(await winningNumbers)
        }
      }
    }
  }
}
