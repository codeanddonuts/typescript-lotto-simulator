import { Round } from "../../../main/lotto/domain/Round"
import { Game } from "../../../main/lotto/domain/Game"
import moment from "moment"
import { WinningNumbersRepository } from "../../../main/lotto/repository/WinningNumbersRepository"
import { container } from "../../../main/di/inversify.config"
import { TYPES } from "../../../main/di/types"

let winningNumbersRepository: WinningNumbersRepository

beforeEach(() => {
  container.snapshot()
  winningNumbersRepository = container.get<WinningNumbersRepository>(TYPES.WinningNumbersRepository)
})

afterEach(() => {
  container.restore()
})

describe("The winner of round n is ...", () => {
  it("889, [3, 13, 29, 38, 39, 42] + 26", async () => {
    const winningNumbers = await winningNumbersRepository.of(new Round(889))
    expect(winningNumbers.round).toEqual(new Round(889))
    expect(winningNumbers.mains).toEqual(new Game([3, 13, 29, 38, 39, 42]))
    expect(winningNumbers.bonus).toEqual(26)
  })

  it("529, [18, 20, 24, 27, 31, 42] + 39", async () => {
    const winningNumbers = await winningNumbersRepository.of(new Round(529))
    expect(winningNumbers.round).toEqual(new Round(529))
    expect(winningNumbers.mains).toEqual(new Game([18, 20, 24, 27, 31, 42]))
    expect(winningNumbers.bonus).toEqual(39)
  })
})

describe("The winner of the recent round is equal to round n?", () => {
  const RECENT_ROUND = 889 + moment(Date.now()).diff(moment("2019-12-14T12:00:00Z"), "weeks")
  it(`${RECENT_ROUND}`, async () => {
    expect(
        await winningNumbersRepository.recent()
    ).toEqual(
        await winningNumbersRepository.of(new Round(RECENT_ROUND))
    )
  })
})