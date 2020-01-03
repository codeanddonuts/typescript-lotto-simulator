import { TierMetadata, Tiers } from "../../../main/lotto/domain/Tier"

describe("Result query (n matches, bonus y/n) is ...", () => {
  it("6, n", () =>
    expect(TierMetadata.query(6, false)).toEqual(Tiers.JACKPOT)
  )

  it("5, y", () =>
    expect(TierMetadata.query(5, true)).toEqual(Tiers.SECOND)
  )

  it("5, n", () =>
    expect(TierMetadata.query(5, false)).toEqual(Tiers.THIRD)
  )

  it("4, y", () =>
    expect(TierMetadata.query(4, true)).toEqual(Tiers.FOURTH)
  )

  it("3, n", () =>
    expect(TierMetadata.query(3, false)).toEqual(Tiers.FIFTH)
  )

  it("2, n", () =>
    expect(TierMetadata.query(2, false)).toEqual(Tiers.NONE)
  )

  it("1, y", () =>
    expect(TierMetadata.query(1, true)).toEqual(Tiers.NONE)
  )

  it("0, y", () =>
    expect(TierMetadata.query(0, true)).toEqual(Tiers.NONE)
  )
})