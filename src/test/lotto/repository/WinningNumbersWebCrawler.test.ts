import "reflect-metadata"
import { Round } from "../../../main/lotto/domain/Round"
import { Game } from "../../../main/lotto/domain/Game"
import { APPROXIMATE_RECENT_ROUND } from "../RecentRoundMock"
import { Tiers } from "../../../main/lotto/domain/Tier"
import { WinningNumbersWebCrawler } from "../../../main/lotto/repository/WinningNumbersWebCrawler"

const winningNumbersRepository = new WinningNumbersWebCrawler()

describe("The winner of round n is ...", () => {
  it("889, [3, 13, 29, 38, 39, 42] + 26", async () => {
    const winningNumbers = await winningNumbersRepository.of(new Round(889))
    expect(winningNumbers.round).toEqual(new Round(889))
    expect(winningNumbers.mains).toEqual(new Game([3, 13, 29, 38, 39, 42]))
    expect(winningNumbers.bonus).toEqual(26)
    expect(winningNumbers.prizeOf(Tiers.JACKPOT)).toEqual(2108986950)
    expect(winningNumbers.prizeOf(Tiers.SECOND)).toEqual(58582971)
    expect(winningNumbers.prizeOf(Tiers.THIRD)).toEqual(1503413)
    expect(winningNumbers.prizeOf(Tiers.FOURTH)).toEqual(50000)
    expect(winningNumbers.prizeOf(Tiers.FIFTH)).toEqual(5000)
  })

  it("529, [18, 20, 24, 27, 31, 42] + 39", async () => {
    const winningNumbers = await winningNumbersRepository.of(new Round(529))
    expect(winningNumbers.round).toEqual(new Round(529))
    expect(winningNumbers.mains).toEqual(new Game([18, 20, 24, 27, 31, 42]))
    expect(winningNumbers.bonus).toEqual(39)
    expect(winningNumbers.prizeOf(Tiers.JACKPOT)).toEqual(1749114797)
    expect(winningNumbers.prizeOf(Tiers.SECOND)).toEqual(70671305)
    expect(winningNumbers.prizeOf(Tiers.THIRD)).toEqual(1552699)
    expect(winningNumbers.prizeOf(Tiers.FOURTH)).toEqual(50000)
    expect(winningNumbers.prizeOf(Tiers.FIFTH)).toEqual(5000)
  })

  it("321, [12, 18, 20, 21, 25, 34] + 42", async () => {
    const winningNumbers = await winningNumbersRepository.of(new Round(321))
    expect(winningNumbers.round).toEqual(new Round(321))
    expect(winningNumbers.mains).toEqual(new Game([12, 18, 20, 21, 25, 34]))
    expect(winningNumbers.bonus).toEqual(42)
    expect(winningNumbers.prizeOf(Tiers.JACKPOT)).toEqual(1959136100)
    expect(winningNumbers.prizeOf(Tiers.SECOND)).toEqual(55975318)
    expect(winningNumbers.prizeOf(Tiers.THIRD)).toEqual(1535374)
    expect(winningNumbers.prizeOf(Tiers.FOURTH)).toEqual(56960)
    expect(winningNumbers.prizeOf(Tiers.FIFTH)).toEqual(5000)
  })
})

describe("The winner of the recent round is equal to round n?", () => {
  it(`Yes: ${APPROXIMATE_RECENT_ROUND}`, async () => {
    expect(
        await winningNumbersRepository.ofRecent()
    ).toEqual(
        await winningNumbersRepository.of(APPROXIMATE_RECENT_ROUND)
    )
  })
})
