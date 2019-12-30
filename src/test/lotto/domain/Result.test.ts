import { Result } from "../../../main/lotto/domain/Result"

describe("Result of (n matches, bonus y/n) is ...", () => {
  it("6, n", () =>
    expect(Result.of(6, false).prize).toEqual(2_000_000_000)
  )

  it("5, y", () =>
    expect(Result.of(5, true).prize).toEqual(30_000_000)
  )

  it("5, n", () =>
    expect(Result.of(5, false).prize).toEqual(1_500_000)
  )

  it("4, y", () =>
    expect(Result.of(4, true).prize).toEqual(50_000)
  )

  it("3, n", () =>
    expect(Result.of(3, false).prize).toEqual(5_000)
  )

  it("2, n", () =>
    expect(Result.of(2, false).prize).toEqual(0)
  )

  it("1, y", () =>
    expect(Result.of(1, true).prize).toEqual(0)
  )

  it("0, y", () =>
    expect(Result.of(0, true).prize).toEqual(0)
  )
})
