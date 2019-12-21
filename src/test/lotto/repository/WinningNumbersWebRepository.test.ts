import { Round } from "../../../main/lotto/domain/Round"
import { Game } from "../../../main/lotto/domain/Game"
import moment from "moment"
import { WinningNumbersWebRepository, WinningNumbersRepository } from "../../../main/lotto/repository/WinningNumbersRepository"

describe("The winner of round n is ...", () => {
  it("889, [3, 13, 29, 38, 39, 42] + 26", async () => {
    const winningNumbers = await (new WinningNumbersWebRepository()).of(new Round(889))
    expect(winningNumbers.round).toEqual(new Round(889))
    expect(winningNumbers.mains).toEqual(new Game([3, 13, 29, 38, 39, 42]))
    expect(winningNumbers.bonus).toEqual(26)
  })

  it("529, [18, 20, 24, 27, 31, 42] + 39", async () => {
    const winningNumbers = await (new WinningNumbersWebRepository()).of(new Round(529))
    expect(winningNumbers.round).toEqual(new Round(529))
    expect(winningNumbers.mains).toEqual(new Game([18, 20, 24, 27, 31, 42]))
    expect(winningNumbers.bonus).toEqual(39)
  })
})

describe("The winner of the recent round is equal to round n?", () => {
  const RECENT_ROUND = 889 + moment("2019-12-14T12:00:00Z").diff(moment.now(), "weeks")
  it(`${RECENT_ROUND}`, async () => {
    expect(
        await (new WinningNumbersWebRepository()).of(new Round(RECENT_ROUND))
    ).toEqual(
        await (new WinningNumbersWebRepository()).recent()
    )
  })
})