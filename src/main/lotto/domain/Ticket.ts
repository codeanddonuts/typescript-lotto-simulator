import { Game } from "./Game"
import { Round } from "./Round"
import { WinningNumbers } from "./WinningNumbers"
import { TierTable, Tier } from "./Tier"
import { UserInputError } from "apollo-server-koa"
import ContainerUtils from "../../utils/ContainerUtils"

export class Ticket {
  constructor(private readonly _round: Round, private readonly _games: Readonly<Game[]>) {}

  public matchResult(winningNumbers: WinningNumbers): Result | never {
    if (!this._round.equals(winningNumbers.round)) {
      throw new UserInputError("티켓과 당첨 번호의 회차가 일치하지 않습니다.")
    }
    const result = ContainerUtils.countOccurrence(
        this._games.map(game => TierTable.query(game.numberOfMatchesTo(winningNumbers.mains), game.contains(winningNumbers.bonus)))
    )
    const totalPrize = Array.from(result.entries(), x => winningNumbers.prizeOf(x[0]) * x[1])
                            .reduce((a, b) => a + b, 0)
    return new Result(result, totalPrize)
  }

  get round() {
    return this._round
  }

  get games() {
    return this._games
  }
}

class Result {
  constructor(private readonly result: ReadonlyMap<Tier, number>, private readonly _totalPrize: number) {}

  get totalPrize() {
    return this._totalPrize
  }
}
