import { GameResult } from "../../../main/lotto/domain/GameResult"
import { Money } from "../../../main/lotto/domain/Money"

describe("Result of (n matches, bonus y/n) is ...", () => {
  it("6, n", () =>
    expect(GameResult.of(6, false).prize).toEqual(new Money(2_000_000_000))
  )

  it("5, y", () =>
    expect(GameResult.of(5, true).prize).toEqual(new Money(30_000_000))
  )

  it("5, n", () =>
    expect(GameResult.of(5, false).prize).toEqual(new Money(1_500_000))
  )

  it("4, y", () =>
    expect(GameResult.of(4, true).prize).toEqual(new Money(50_000))
  )

  it("3, n", () =>
    expect(GameResult.of(3, false).prize).toEqual(new Money(5_000))
  )

  it("2, n", () =>
    expect(GameResult.of(2, false).prize).toEqual(new Money(0))
  )

  it("1, y", () =>
    expect(GameResult.of(1, true).prize).toEqual(new Money(0))
  )

  it("0, y", () =>
    expect(GameResult.of(0, true).prize).toEqual(new Money(0))
  )
})