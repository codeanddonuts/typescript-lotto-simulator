import { TierTable, TIER } from "../../../main/lotto/domain/Tier"

describe("Result query (n matches, bonus y/n) is ...", () => {
  it("6, y", () =>
    expect(TierTable.query(6, true)).toEqual(TIER.JACKPOT)
  )

  it("6, n", () =>
    expect(TierTable.query(6, false)).toEqual(TIER.JACKPOT)
  )

  it("5, y", () =>
    expect(TierTable.query(5, true)).toEqual(TIER.SECOND)
  )

  it("5, n", () =>
    expect(TierTable.query(5, false)).toEqual(TIER.THIRD)
  )

  it("4, y", () =>
    expect(TierTable.query(4, true)).toEqual(TIER.FOURTH)
  )

  it("4, n", () =>
    expect(TierTable.query(4, false)).toEqual(TIER.FOURTH)
  )

  it("3, y", () =>
    expect(TierTable.query(3, true)).toEqual(TIER.FIFTH)
  )

  it("3, n", () =>
    expect(TierTable.query(3, false)).toEqual(TIER.FIFTH)
  )

  it("2, y", () =>
    expect(TierTable.query(2, true)).toEqual(TIER.NONE)
  )

  it("2, n", () =>
    expect(TierTable.query(2, false)).toEqual(TIER.NONE)
  )

  it("1, y", () =>
    expect(TierTable.query(1, true)).toEqual(TIER.NONE)
  )

  it("1, n", () =>
    expect(TierTable.query(1, false)).toEqual(TIER.NONE)
  )

  it("0, y", () =>
    expect(TierTable.query(0, true)).toEqual(TIER.NONE)
  )

  it("0, n", () =>
    expect(TierTable.query(0, false)).toEqual(TIER.NONE)
  )
})
