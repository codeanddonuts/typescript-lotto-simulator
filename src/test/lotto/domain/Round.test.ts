import { Round } from "../../../main/lotto/domain/Round"

describe("Are valid rounds?", () => {
  it("Yes", () =>
    expect(() => new Round(892)).not.toThrow()
  )

  it("No: Underflow", () =>
    expect(() => new Round(0)).toThrow()
  )

  it("No: Underflow", () =>
    expect(() => new Round(-125)).toThrow()
  )
})