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
    return new Report(this.games, winningNumbers)
  }
}

class Report implements Iterable<[Result, number]> {
  private readonly _totalPurchaseAmount: number
  private readonly result: [Result, number][]
  private readonly _totalPrize: number

  constructor(games: Readonly<Game[]>, winningNumbers: WinningNumbers) {
    this._totalPurchaseAmount = games.length
    const tmp: Map<Result, number> = new ValueObjectKeyMap()
    games.map(game =>
      Result.of(game.numberOfMatchesTo(winningNumbers.mains), game.contains(winningNumbers.bonus))
    ).forEach(x => tmp.set(x, (tmp.get(x) ?? 0) + 1))
    this.result = [...tmp.entries()].sort((a, b) => a[0].prize - b[0].prize)
    this._totalPrize = this.result.map(x => x[0].prize * x[1]).reduce((a, b) => a + b, 0)
  }

  get totalPurchaseAmount() {
    return this._totalPurchaseAmount
  }

  get totalPrize() {
    return this._totalPrize
  }

  get [Symbol.iterator]() {
    return this.result[Symbol.iterator]
  }
}
