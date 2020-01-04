import { Round } from "../../../main/lotto/domain/Round"
import { Game } from "../../../main/lotto/domain/Game"
import { WinningNumbers } from "../../../main/lotto/domain/WinningNumbers"
import { TIER } from "../../../main/lotto/domain/Tier"

describe("Are valid winning numbers?", () => {
  it ("Yes", () => {
    expect(
        new WinningNumbers(
            new Round(123), Game.autoGen(), 7, [1_000_000_000, 50_000_000, 1_500_000, 50_000, 5_000]
        )
    ).toBeInstanceOf(WinningNumbers)
  })

  it ("No: Not enough prizes", () => {
    expect(() => new WinningNumbers(new Round(123), Game.autoGen(), 7, [])).toThrow()
  })

  it ("No: Too many prizes", () => {
    expect(() => new WinningNumbers(new Round(123), Game.autoGen(), 7, [10, 9, 8, 7, 6, 5])).toThrow()
  })
})

const winningNumbers = new WinningNumbers(
  new Round(123), new Game([1, 2, 3, 4, 5, 6]), 7, [1_000_000_000, 50_000_000, 1_500_000, 50_000, 5_000]
)

describe("Prize of ...", () => {
  it("Jackpot = 1,000,000,000", () => expect(winningNumbers.prizeOf(TIER.JACKPOT)).toEqual(1_000_000_000))

  it("2nd place = 50,000,000", () => expect(winningNumbers.prizeOf(TIER.SECOND)).toEqual(50_000_000))

  it("3rd place = 1,500,000", () => expect(winningNumbers.prizeOf(TIER.THIRD)).toEqual(1_500_000))

  it("4th place = 50,000", () => expect(winningNumbers.prizeOf(TIER.FOURTH)).toEqual(50_000))

  it("5th place = 5,000", () => expect(winningNumbers.prizeOf(TIER.FIFTH)).toEqual(5_000))
  
  it("NONE", () => expect(winningNumbers.prizeOf(TIER.NONE)).toEqual(0))
})

describe("Same winning numbers?", () => {
  it("Yes: Same instance", () =>
    expect(winningNumbers.equals(winningNumbers)).toBeTruthy()
  )
  
  it("No: Different type", () =>
    expect(winningNumbers.equals(new Round(123))).toBeFalsy()
  )

  it("Yes: Same values", () =>
    expect(
        winningNumbers.equals(
            new WinningNumbers(
                new Round(123), new Game([1, 2, 3, 4, 5, 6]), 7, [1_000_000_000, 50_000_000, 1_500_000, 50_000, 5_000]
            )
        )
    ).toBeTruthy()
  )

  it("No: Different values", () =>
    expect(
        winningNumbers.equals(
            new WinningNumbers(new Round(1234), new Game([1, 2, 3, 4, 5, 6]), 8, [1, 2, 3, 4, 5])
        )
    ).toBeFalsy()
  )
})
