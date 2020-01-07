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
import { Ticket } from "../domain/Ticket"
import { WinningNumbers } from "../domain/WinningNumbers"

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

      type WinningNumbers {
        mains: [Int!]!
        bonus: Int!
      }

      type Report {
        round: Int!
        games: [[Int!]!]!
        winningNumbers: WinningNumbers!
        totalPrize: Int!
      }

      type Mutation {
        purchase(round: Int, investment: Int!, manualPicks: [[Int!]!]): Report
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
        purchase: async (_, { round, investment, manualPicks = [] }) => {
          const validatedRound = round ? new Round(round) : (await this.winningNumbersApiClient.getRecent()).round
          const validatedPicks = (manualPicks as number[][]).map(numbers => PickGroup(numbers.map(n => PickedNumber(n))))
          return this.writeReport(
              await this.lottoShop.purchase(investment as Money, validatedPicks, validatedRound),
              await this.winningNumbersApiClient.get(validatedRound)
          )
        }
      }
    }
  }

  private writeReport(ticket: Ticket, winningNumbers: WinningNumbers) {
    return {
      round: ticket.round.num,
      games: ticket.games,
      winningNumbers: winningNumbers,
      totalPrize: ticket.matchResult(winningNumbers).totalPrize
    }
  }
}
