import ValueObject from "../../utils/ValueObject"
import { Round } from "./Round"
import { Game, PickedNumber } from "./Game"
import { LOWEST_TIER, Tier } from "./Tier"
import { Money } from "./Money"

export class WinningNumbers implements ValueObject {
  constructor(
      private readonly _round: Round,
      private readonly _mains: Game,
      private readonly _bonus: PickedNumber,
      private readonly prizes: Money[]
  ) {
    if (prizes.length !== LOWEST_TIER || prizes.some(prize => prize <= 0)) {
      throw new Error("상금이 잘못 입력되었습니다.")
    }
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

  public prizeOf(tier: Tier): Money {
    return this.prizes[tier - 1] ?? 0
  }

  equals(rhs: any) {
    if (this === rhs) {
      return true
    } else if (!(rhs instanceof WinningNumbers)) {
      return false
    }
    return this._round.equals(rhs._round)
  }

  hashCode() {
    return this._round.hashCode()
  }
}
