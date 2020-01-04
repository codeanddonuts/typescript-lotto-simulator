import fc from "fast-check"
import { Round } from "../../../main/lotto/domain/Round"

describe("Are valid rounds?", () => {
  it("Yes", () =>
    fc.assert(
        fc.property(fc.integer(Round.MIN_ROUND, Number.MAX_SAFE_INTEGER), n => expect(() => new Round(n)).not.toThrow())
    )
  )

  it("No: Underflow", () =>
    fc.assert(
        fc.property(fc.integer(Round.MIN_ROUND - 1), n => expect(() => new Round(n)).toThrow())
    )
  )
})

describe("Same round?", () => {
  const round = new Round(123)

  it("Yes: Same instance", () =>
    expect(round.equals(round)).toBeTruthy()
  )
  
  it("No: Different type", () =>
    expect(round.equals([1, 2])).toBeFalsy()
  )

  it("Yes: Same values", () =>
    expect(round.equals(new Round(123))).toBeTruthy()
  )

  it("No: Different values", () =>
    expect(round.equals(new Round(321))).toBeFalsy()
  )
})
