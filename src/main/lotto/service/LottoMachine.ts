import { Game, PickGroup } from "../domain/Game"
import { Ticket } from "../domain/Ticket"
import { WinningNumbersApiClient } from "./WinningNumbersApiClient"
import { injectable, inject } from "inversify"
import ContainerUtils from "../../utils/ContainerUtils"
import { Round } from "../domain/Round"
import { UserInputError } from "apollo-server-koa"

@injectable()
export class LottoMachine {
  public static MAX_PURCHASE_AMOUNT = 100

  constructor(@inject(WinningNumbersApiClient) private readonly winningNumbersApiClient: WinningNumbersApiClient) {}

  public async issue(manualPicks: PickGroup[], autoAmount: number, round?: Round): Promise<Ticket> | never {
    if (manualPicks.length + autoAmount <= 0) {
      throw new UserInputError("먼저 번호를 입력하세요.")
    }
    if (manualPicks.length + autoAmount > LottoMachine.MAX_PURCHASE_AMOUNT) {
      throw new UserInputError(`최대 ${LottoMachine.MAX_PURCHASE_AMOUNT}장만 구매 가능합니다.`)
    }
    return new Ticket(
        round ?? (await this.winningNumbersApiClient.getRecent()).round,
        [...manualPicks.map(x => new Game(x)), ...ContainerUtils.intRange(0, autoAmount).map(() => Game.autoGen())]
    )
  }
}
