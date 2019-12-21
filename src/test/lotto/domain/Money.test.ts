import { Money } from "../../../main/lotto/domain/Money"

describe("Sum of money?", () => {
  it("15,000", () =>
    expect(new Money(10000).sum(new Money(5000))).toEqual(new Money(15000))
  )
})

describe("Product of money?", () => {
  it("60,000", () =>
    expect(new Money(10000).product(6)).toEqual(new Money(60000))
  )
})