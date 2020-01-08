import ValueObject from "../../utils/ValueObject"
import { UserInputError } from "apollo-server-koa"

export class Round implements ValueObject {
  public static MIN_ROUND = 1

  constructor(private readonly _num: number) {
    if (_num < Round.MIN_ROUND) {
      throw new UserInputError("잘못된 회차입니다.")
    }
  }

  get num() {
    return this._num
  }

  toString() {
    return this._num
  }
  
  equals(rhs: any) {
    if (this === rhs) {
      return true
    } else if (!(rhs instanceof Round)) {
      return false
    }
    return this._num === rhs._num
  }

  hashCode() {
    return this._num
  }
}
