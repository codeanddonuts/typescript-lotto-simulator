import ValueObject from "../../utils/ValueObject"

export class Money implements ValueObject {
  constructor(private readonly amount: number) {}

  public sum(rhs: Money): Money {
    return new Money(this.amount + rhs.amount)
  }

  public product(number: number) {
    return new Money(this.amount * number)
  }

  equals(rhs: any) {
    if (this === rhs) {
      return true
    } else if (!(rhs instanceof Money)) {
      return false
    }
    return this.amount === rhs.amount
  }

  hashCode() {
    return this.amount
  }
}
