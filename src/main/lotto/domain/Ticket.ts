import { TicketResult } from "./TicketResult"
import { Game } from "./Game"
import { Round } from "./Round"

export class Ticket {
  public constructor(private readonly _round: Round, private readonly games: Readonly<Game[]>) {}

  public async match(): Promise<TicketResult> {
    return TicketResult.of(this)
  }

  public map<T>(callbackfn: (value: Game, index: number, array: Readonly<Game[]>) => T, thisArg?: any): T[] {
    return this.games.map(callbackfn, thisArg)
  }

  get round() {
    return this._round
  }
}
