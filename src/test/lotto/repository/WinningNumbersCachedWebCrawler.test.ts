import { container } from "../../../main/di/Inversify.config"
import { Round } from "../../../main/lotto/domain/Round"
import { Game } from "../../../main/lotto/domain/Game"
import { WinningNumbersRepository } from "../../../main/lotto/repository/WinningNumbersRepository"
import { createConnection, getConnection, getConnectionOptions } from "typeorm"
import { WinningNumbers } from "../../../main/lotto/domain/WinningNumbers"
import { WinningNumbersEntityAdapter } from "../../../main/lotto/repository/WinningNumbersCachedWebCrawler"
import { APPROXIMATE_RECENT_ROUND } from "../RecentRound"

let winningNumbersRepository: WinningNumbersRepository

beforeAll(async () => {
  await createConnection(Object.assign(await getConnectionOptions(), { database : "test" }))
})

beforeEach(async () => {
  container.snapshot()
  winningNumbersRepository = container.get<WinningNumbersRepository>(WinningNumbersRepository)
})

afterEach(async () => {
  container.restore()
})

afterAll(async () => {
  await getConnection().close().catch(e => console.log(e))
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

  it("321, [12, 18, 20, 21, 25, 34] + 42", async () => {
    const winningNumbers = await winningNumbersRepository.of(new Round(321))
    expect(winningNumbers.round).toEqual(new Round(321))
    expect(winningNumbers.mains).toEqual(new Game([12, 18, 20, 21, 25, 34]))
    expect(winningNumbers.bonus).toEqual(42)
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

describe("Entity -> Winning Numbers", () => {
  it("35, [1, 3, 7, 21, 25, 34] + 8", () => {
    expect(
        WinningNumbersEntityAdapter.convertEntityToWinningNumbers({
          round: 35,
          first: 1,
          second: 3,
          third: 7,
          fourth: 21,
          fifth: 25,
          sixth: 34,
          bonus: 8
        })
    ).toEqual(
        new WinningNumbers(new Round(35), new Game([1, 3, 7, 21, 25, 34]), 8)
    )
  })
})

describe("Winning Numbers -> Entity", () => {
  it("35, [1, 3, 7, 21, 25, 34] + 8", () => {
    expect(
        WinningNumbersEntityAdapter.convertWinningNumbersToEntity(
            new WinningNumbers(new Round(35), new Game([1, 3, 7, 21, 25, 34]), 8)
        )
    ).toEqual({
      round: 35,
      first: 1,
      second: 3,
      third: 7,
      fourth: 21,
      fifth: 25,
      sixth: 34,
      bonus: 8
    })
  })
})
