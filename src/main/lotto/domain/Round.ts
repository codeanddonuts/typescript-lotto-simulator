import ValueObject from "../../utils/ValueObject"

export class Round implements ValueObject {
  constructor(private readonly number: number) {
    if (number < 1) {
      throw new Error("잘못된 회차입니다.")
    }
  }

  toString() {
    return this.number
  }
  
  equals(rhs: any) {
    if (this === rhs) {
      return true
    }
    else if (!(rhs instanceof Round)) {
      return false
    }
    return this.number === rhs.number
  }

  hashCode() {
    return this.number
  }
}
