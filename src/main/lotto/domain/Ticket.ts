import { Game } from "./Game"
import { Round } from "./Round"
import { WinningNumbers } from "./WinningNumbers"
import { Result } from "./Result"
import { ValueObjectKeyMap } from "../../utils/ValueObject"

export class Ticket {
  constructor(private readonly _round: Round, private readonly games: Readonly<Game[]>) {}

  public matchResult(winningNumbers: WinningNumbers): Report | never {
    if (!this._round.equals(winningNumbers.round)) {
      throw new Error("티켓과 당첨 번호의 회차가 일치하지 않습니다.")
    }
    const tmp: Map<Result, number> = new ValueObjectKeyMap()
    this.games.map(game =>
      Result.of(game.numberOfMatchesTo(winningNumbers.mains), game.contains(winningNumbers.bonus))
    ).forEach(x => tmp.set(x, (tmp.get(x) ?? 0) + 1))
    const totalPrize = [...tmp.entries()].map(x => x[0].prize * x[1]).reduce((a, b) => a + b, 0)
    return new Report(this.games.length, totalPrize)
  }
}

class Report {
  constructor(
      private readonly totalPurchaseAmount: number,
      private readonly totalPrize: number
  ) {}
}
