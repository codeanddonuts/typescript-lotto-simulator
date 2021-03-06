import { Round } from "../../../main/lotto/domain/Round"
import { Game } from "../../../main/lotto/domain/Game"
import { WinningNumbersApiClient } from "../../../main/lotto/service/WinningNumbersApiClient"
import { getConnection } from "typeorm"
import { WinningNumbers } from "../../../main/lotto/domain/WinningNumbers"
import { WinningNumbersEntityAdapter, WinningNumbersCachedWebCrawler } from "../../../main/lotto/infrastructure/WinningNumbersCachedWebCrawler"
import { APPROXIMATE_RECENT_ROUND, connectTestDatabase } from "../../TestUtils"
import { TIER } from "../../../main/lotto/domain/Tier"

let winningNumbersApiClient: WinningNumbersApiClient

beforeAll(async () => {
  await connectTestDatabase()
})

beforeEach(() => {
  winningNumbersApiClient = new WinningNumbersCachedWebCrawler()
})

afterAll(async () => {
  await getConnection().close()
                       .catch(e => console.log(e))
})

describe("The winner of round n is ...", () => {
  it("889, [3, 13, 29, 38, 39, 42] + 26", async () => {
    const winningNumbers = await winningNumbersApiClient.get(new Round(889))
    expect(winningNumbers.round).toEqual(new Round(889))
    expect(winningNumbers.mains).toEqual(new Game([3, 13, 29, 38, 39, 42]))
    expect(winningNumbers.bonus).toEqual(26)
    expect(winningNumbers.prizeOf(TIER.JACKPOT)).toEqual(2108986950)
    expect(winningNumbers.prizeOf(TIER.SECOND)).toEqual(58582971)
    expect(winningNumbers.prizeOf(TIER.THIRD)).toEqual(1503413)
    expect(winningNumbers.prizeOf(TIER.FOURTH)).toEqual(50000)
    expect(winningNumbers.prizeOf(TIER.FIFTH)).toEqual(5000)
    expect(winningNumbers.equals(await winningNumbersApiClient.get(new Round(889)))).toBeTruthy()
  })

  it("529, [18, 20, 24, 27, 31, 42] + 39", async () => {
    const winningNumbers = await winningNumbersApiClient.get(new Round(529))
    expect(winningNumbers.round).toEqual(new Round(529))
    expect(winningNumbers.mains).toEqual(new Game([18, 20, 24, 27, 31, 42]))
    expect(winningNumbers.bonus).toEqual(39)
    expect(winningNumbers.prizeOf(TIER.JACKPOT)).toEqual(1749114797)
    expect(winningNumbers.prizeOf(TIER.SECOND)).toEqual(70671305)
    expect(winningNumbers.prizeOf(TIER.THIRD)).toEqual(1552699)
    expect(winningNumbers.prizeOf(TIER.FOURTH)).toEqual(50000)
    expect(winningNumbers.prizeOf(TIER.FIFTH)).toEqual(5000)
    expect(winningNumbers.equals(await winningNumbersApiClient.get(new Round(529)))).toBeTruthy()
  })

  it("321, [12, 18, 20, 21, 25, 34] + 42", async () => {
    const winningNumbers = await winningNumbersApiClient.get(new Round(321))
    expect(winningNumbers.round).toEqual(new Round(321))
    expect(winningNumbers.mains).toEqual(new Game([12, 18, 20, 21, 25, 34]))
    expect(winningNumbers.bonus).toEqual(42)
    expect(winningNumbers.prizeOf(TIER.JACKPOT)).toEqual(1959136100)
    expect(winningNumbers.prizeOf(TIER.SECOND)).toEqual(55975318)
    expect(winningNumbers.prizeOf(TIER.THIRD)).toEqual(1535374)
    expect(winningNumbers.prizeOf(TIER.FOURTH)).toEqual(56960)
    expect(winningNumbers.prizeOf(TIER.FIFTH)).toEqual(5000)
    expect(winningNumbers.equals(await winningNumbersApiClient.get(new Round(321)))).toBeTruthy()
  })
})

describe("The winner of the recent round is equal to round n?", () => {
  it(`Yes: ${APPROXIMATE_RECENT_ROUND}`, async () => {
    expect(
        await winningNumbersApiClient.getRecent()
    ).toEqual(
        await winningNumbersApiClient.get(APPROXIMATE_RECENT_ROUND)
    )
  })
})

describe("Entity -> Winning Numbers", () => {
  it("35, [1, 3, 7, 21, 25, 34] + 8", () => {
    expect(
        WinningNumbersEntityAdapter.convertEntityToWinningNumbers({
          round: 35,
          first_num: 1,
          second_num: 3,
          third_num: 7,
          fourth_num: 21,
          fifth_num: 25,
          sixth_num: 34,
          bonus_num: 8,
          first_prize: "1000000000",
          second_prize: 50_000_000,
          third_prize: 1_500_000,
          fourth_prize: 50_000,
          fifth_prize: 5_000
        })
    ).toEqual(
        new WinningNumbers(
            new Round(35), new Game([1, 3, 7, 21, 25, 34]), 8, [1_000_000_000, 50_000_000, 1_500_000, 50_000, 5_000]
        )
    )
  })
})

describe("Winning Numbers -> Entity", () => {
  it("35, [1, 3, 7, 21, 25, 34] + 8", () => {
    expect(
        WinningNumbersEntityAdapter.convertWinningNumbersToEntity(
            new WinningNumbers(
                new Round(35), new Game([1, 3, 7, 21, 25, 34]), 8, [1_000_000_000, 50_000_000, 1_500_000, 50_000, 5_000]
            )
        )
    ).toEqual({
      round: 35,
      first_num: 1,
      second_num: 3,
      third_num: 7,
      fourth_num: 21,
      fifth_num: 25,
      sixth_num: 34,
      bonus_num: 8,
      first_prize: "1000000000",
      second_prize: 50_000_000,
      third_prize: 1_500_000,
      fourth_prize: 50_000,
      fifth_prize: 5_000
    })
  })
})
