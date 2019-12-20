import { Ticket } from "./Ticket"
import { WinningNumbers } from "./WinningNumbers"
import { ValueObjectKeyMap } from "../../utils/ValueObject"
import { GameResult } from "./GameResult"
import { Money } from "./Money"

export class TicketResult implements Iterable<[GameResult, number]> {
  private readonly result: ReadonlyMap<GameResult, number>
  private readonly _totalPrize: Money

  public constructor(ticket: Ticket, winningNumbers: WinningNumbers) {
    const tmp: Map<GameResult, number> = new ValueObjectKeyMap()
    ticket.map(game =>
      GameResult.of(game.numberOfMatchesTo(winningNumbers.mains), game.contains(winningNumbers.bonus))
    ).forEach(x => tmp.set(x, (tmp.get(x) ?? 0) + 1))
    this.result = tmp
    this._totalPrize = [...this.result.entries()].map(x => x[0].prize.product(x[1]))
                                                 .reduce((a, b) => a.sum(b), new Money(0))
  }

  get totalPrize() {
    return this._totalPrize
  }

  get [Symbol.iterator]() {
    return this.result[Symbol.iterator]
  }
}
