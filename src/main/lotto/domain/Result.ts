import ValueObject from "../../utils/ValueObject"
import { hash } from "../../utils/HashUtils"
import { NumberOfMatches } from "./Game"
import { Money } from "./Money"

export const enum Placement {
  FIRST = "1등",
  SECOND = "2등",
  THIRD = "3등",
  FOURTH = "4등",
  FIFTH = "5등",
  NONE = "꽝"
}

export class Result implements ValueObject {
  private static readonly RESULTS: Readonly<Result[]> = [
    new Result(Placement.FIRST, 2_000_000_000, 6),
    new Result(Placement.SECOND, 30_000_000, 5, true),
    new Result(Placement.THIRD, 1_500_000, 5, false),
    new Result(Placement.FOURTH, 50_000, 4),
    new Result(Placement.FIFTH, 5_000, 3)
  ].reverse()
  private static readonly NONE = new Result(Placement.NONE, 0)

  public static of(numberOfMatches: NumberOfMatches, containsBonus: boolean): Result {
    return (() => {
      const temp = this.RESULTS.filter(x => x._numberOfMatches === numberOfMatches)
      if (temp.length > 1) {
        return temp.filter(x => x._containsBonus === containsBonus).pop()
      } else if (temp.length === 1) {
        return temp.pop()
      }
    })() ?? this.NONE
  }

  private readonly _hashCode: number

  private constructor(
    private readonly _placement: Placement,
    private readonly _prize: Money,
    private readonly _numberOfMatches?: NumberOfMatches,
    private readonly _containsBonus?: boolean
  ) {
    this._hashCode = hash(_placement)
  }
  
  get placement() {
    return this._placement
  }

  get prize() {
    return this._prize
  }

  get numberOfMatches() {
    return this._numberOfMatches
  }

  get containsBonus() {
    return this._containsBonus
  }

  equals(rhs: any) {
    return this === rhs
  }

  hashCode() {
    return this._hashCode
  }
}
