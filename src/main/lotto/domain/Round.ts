import ValueObject from "../../utils/ValueObject"

export class Round implements ValueObject {
  private static MIN_ROUND = 1

  constructor(private readonly number: number) {
    if (number < Round.MIN_ROUND) {
      throw new Error("잘못된 회차입니다.")
    }
  }

  get val() {
    return this.number
  }

  toString() {
    return this.number
  }
  
  equals(rhs: any) {
    if (this === rhs) {
      return true
    } else if (!(rhs instanceof Round)) {
      return false
    }
    return this.number === rhs.number
  }

  hashCode() {
    return this.number
  }
}
