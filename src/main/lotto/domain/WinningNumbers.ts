import ValueObject from "../../utils/ValueObject"
import { Round } from "./Round"
import { Game, PickedNumber } from "./Game"
import { Ticket } from "./Ticket"
import { TicketResult } from "./TicketResult"

export class WinningNumbers implements ValueObject {
  public constructor(private readonly _round: Round, private readonly _mains: Game, private readonly _bonus: PickedNumber) {}

  public match(ticket: Ticket): Promise<TicketResult> {
    return TicketResult.of(ticket)
  }

  get round() {
    return this._round
  }

  get mains() {
    return this._mains
  }

  get bonus() {
    return this._bonus
  }

  equals(rhs: any) {
    if (this === rhs) {
      return true
    } else if (!(rhs instanceof WinningNumbers)) {
      return false
    }
    return this.round.equals(rhs.round)
  }

  hashCode() {
    return this.round.hashCode()
  }
}
