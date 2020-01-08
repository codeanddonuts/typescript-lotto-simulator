import { injectable, inject } from "inversify"
import { Money } from "../domain/Money"
import { LottoMachine } from "./LottoMachine"
import { Ticket } from "../domain/Ticket"
import { PickGroup } from "../domain/Game"
import { Round } from "../domain/Round"
import { UserInputError } from "apollo-server-koa"

@injectable()
export class LottoShop {
  public static PRICE_PER_GAME: Money = 1_000

  constructor(@inject(LottoMachine) private readonly lottoMachine: LottoMachine) {}

  public purchase(investment: Money, manualPicks: PickGroup[], round?: Round): Promise<Ticket> | never{
    if (investment < LottoShop.PRICE_PER_GAME) {
      throw new UserInputError("지불 금액이 부족합니다.")
    }
    return this.lottoMachine.issue(manualPicks, Math.floor(investment / LottoShop.PRICE_PER_GAME) - manualPicks.length, round)
  }
}
