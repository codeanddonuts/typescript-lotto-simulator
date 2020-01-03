import { NumberOfMatches } from "./Game"

export type Tier = 0 | 1 | 2 | 3 | 4 | 5

export const enum Tiers {
  NONE = 0,
  JACKPOT,
  SECOND,
  THIRD,
  FOURTH,
  FIFTH
}

export const LOWEST_TIER = Tiers.FIFTH

export class TierMetadata {
  private static readonly RESULTS: Readonly<TierMetadata[]> = [
    new TierMetadata(Tiers.JACKPOT, 6),
    new TierMetadata(Tiers.SECOND, 5, true),
    new TierMetadata(Tiers.THIRD, 5, false),
    new TierMetadata(Tiers.FOURTH, 4),
    new TierMetadata(Tiers.FIFTH, 3)
  ].reverse()

  public static query(numberOfMatches: NumberOfMatches, containsBonus: boolean): Tier {
    const temp = this.RESULTS.filter(x => x.numberOfMatches === numberOfMatches)
    return (() => {
      if (temp.length > 1) {
        return temp.filter(x => x.containsBonus === containsBonus).pop()?.tier
      }
      return temp.pop()?.tier
    })() ?? Tiers.NONE
  }

  private constructor(
      private readonly tier: Tier,
      private readonly numberOfMatches?: NumberOfMatches,
      private readonly containsBonus?: boolean
  ) {}
}
