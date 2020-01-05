import { Game } from "./Game"
import { Round } from "./Round"
import { WinningNumbers } from "./WinningNumbers"
import { TierTable } from "./Tier"
import { UserInputError } from "apollo-server-koa"
import ContainerUtils from "../../utils/ContainerUtils"

export class Ticket {
  constructor(private readonly _round: Round, private readonly games: Readonly<Game[]>) {}

  public matchResult(winningNumbers: WinningNumbers): Report | never {
    if (!this._round.equals(winningNumbers.round)) {
      throw new UserInputError("티켓과 당첨 번호의 회차가 일치하지 않습니다.")
    }
    const temp = ContainerUtils.countOccurrence(
        this.games.map(game => TierTable.query(game.numberOfMatchesTo(winningNumbers.mains), game.contains(winningNumbers.bonus)))
    )
    const totalPrize = [...temp.entries()].map(x => winningNumbers.prizeOf(x[0]) * x[1]).reduce((a, b) => a + b, 0)
    return new Report(this.games.length, totalPrize)
  }
}

class Report {
  constructor(
      private readonly totalPurchaseAmount: number,
      private readonly totalPrize: number
  ) {}
}
