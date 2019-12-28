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

describe("Same money?", () => {
  const money = new Money(10000)

  it("Yes: Same instance", () =>
    expect(money.equals(money)).toBeTruthy()
  )
  
  it("No: Different type", () =>
    expect(money.equals(10000)).toBeFalsy()
  )

  it("Yes: Same values", () =>
    expect(money.equals(new Money(10000))).toBeTruthy()
  )

  it("No: Different values", () =>
    expect(money.equals(new Money(12345))).toBeFalsy()
  )
})
