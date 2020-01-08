import { NumberOfMatches } from "./Game"

export type Tier = 0 | 1 | 2 | 3 | 4 | 5

export const enum TIER {
  NONE = 0,
  JACKPOT,
  SECOND,
  THIRD,
  FOURTH,
  FIFTH
}

export const LOWEST_TIER = TIER.FIFTH

export class TierTable {
  private static readonly RESULTS: Readonly<TierTable[]> = [
    new TierTable(TIER.JACKPOT, 6),
    new TierTable(TIER.SECOND, 5, true),
    new TierTable(TIER.THIRD, 5, false),
    new TierTable(TIER.FOURTH, 4),
    new TierTable(TIER.FIFTH, 3)
  ].reverse()

  public static query(numberOfMatches: NumberOfMatches, containsBonus: boolean): Tier {
    const temp = this.RESULTS.filter(x => x.numberOfMatches === numberOfMatches)
    return (() => {
      if (temp.length > 1) {
        return temp.filter(x => x.containsBonus === containsBonus).pop()?.tier
      }
      return temp.pop()?.tier
    })() ?? TIER.NONE
  }

  private constructor(
      private readonly tier: Tier,
      private readonly numberOfMatches?: NumberOfMatches,
      private readonly containsBonus?: boolean
  ) {}
}
