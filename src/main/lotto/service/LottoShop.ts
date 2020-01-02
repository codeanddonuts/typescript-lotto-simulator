import { injectable, inject } from "inversify"
import { Money } from "../domain/Money"
import { LottoMachine } from "./LottoMachine"
import { Ticket } from "../domain/Ticket"
import { PickGroup } from "../domain/Game"

@injectable()
export class LottoShop {
  constructor(@inject(LottoMachine) private readonly lottoMachine: LottoMachine) {}

  public purchase(investment: Money, manualPicks: PickGroup[]): Promise<Ticket> | never{
    if (investment < LottoMachine.PRICE_PER_GAME) {
      throw new Error("지불 금액이 부족합니다.")
    }
    const totalPurchaseAmount = Math.min(Math.floor(investment / LottoMachine.PRICE_PER_GAME), LottoMachine.MAX_PURCHASE_AMOUNT)
    const manualAmount = Math.min(manualPicks.length, totalPurchaseAmount)
    const autoAmount = totalPurchaseAmount - manualAmount
    return this.lottoMachine.issue(manualPicks.slice(0, manualAmount), autoAmount)
  }
}
