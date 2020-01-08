import ContainerUtils from "../../utils/ContainerUtils"
import { UserInputError } from "apollo-server-koa"
import { PickedNumber, PICK_RANGE } from "./PickedNumber"

const NUMBER_OF_PICKS = 6

type IndicesOfPicks = 1 | 2 | 3 | 4 | 5 | 6

export type NumberOfMatches = 0 | IndicesOfPicks

type ArrayOfSixElements<T> = [T, T, T, T, T, T]

export type PickGroup = ArrayOfSixElements<PickedNumber>

export const PickGroup = (pickedNumbers: PickedNumber[]): PickGroup | never => {
  if (pickedNumbers.length === NUMBER_OF_PICKS) {
    return pickedNumbers as PickGroup
  }
  throw new UserInputError("6개의 숫자만을 입력해주시기 바랍니다.")
}

export class Game implements Iterable<PickedNumber> {
  public static readonly NUMBER_OF_PICKS = NUMBER_OF_PICKS

  private static readonly BALLS: PickedNumber[] = ContainerUtils.intRangeClosed(PICK_RANGE.MIN, PICK_RANGE.MAX)
                                                                .map(n => PickedNumber(n))
  
  private readonly picks: ReadonlySet<PickedNumber>

  public static autoGen(): Game {
    return new Game(PickGroup(ContainerUtils.shuffle(this.BALLS).slice(0, NUMBER_OF_PICKS)))
  }

  constructor(pickGroup: PickGroup) {
    if (ContainerUtils.hasOnlyDistinctElements(pickGroup)) {
      this.picks = new Set([...pickGroup].sort((a, b) => a - b))
    } else {
      throw new UserInputError("각기 다른 번호를 입력해주세요.")
    }
  }

  public numberOfMatchesTo(rhs: Game): NumberOfMatches {
    return ContainerUtils.intersection(this.picks, rhs.picks).size as NumberOfMatches
  }
  
  public contains(n: PickedNumber): boolean {
    return this.picks.has(n)
  }

  public getNthPick(i: IndicesOfPicks): PickedNumber {
    return [...this.picks.values()][i - 1]
  }

  public [Symbol.iterator](): Iterator<PickedNumber> {
    return this.picks.values()
  }
}
