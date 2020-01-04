import { injectable, inject } from "inversify"
import Controller from "./Controller"
import { ITypedef, gql, IResolvers } from "apollo-server-koa"
import { LottoShop } from "../lotto/service/LottoShop"
import { LottoMachine } from "../lotto/service/LottoMachine"
import { WinningNumbersRepository } from "../lotto/repository/WinningNumbersRepository"
import { Money } from "../lotto/domain/Money"
import { PickedNumberCons, PickGroupCons } from "../lotto/domain/Game"
import { Round } from "../lotto/domain/Round"

@injectable()
export class ShopController implements Controller {
  constructor(
    @inject(LottoShop) private readonly lottoShop: LottoShop,
    @inject(WinningNumbersRepository) private readonly winningNumbersRepository: WinningNumbersRepository
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
        recentRound: async () => (await this.winningNumbersRepository.ofRecent()).round.num
      },
      Mutation: {
        purchase: async (_, { investment, manualPicks, round }) => {
          const validatedPicks = (manualPicks as number[][]).map(numbers => PickGroupCons(numbers.map(n => PickedNumberCons(n))))
          const winningNumbers = round ? this.winningNumbersRepository.of(new Round(round)) : this.winningNumbersRepository.ofRecent()
          const ticket = await this.lottoShop.purchase(investment as Money, validatedPicks, round ? new Round(round) : undefined)
          return ticket.matchResult(await winningNumbers)
        }
      }
    }
  }
}
