import fc from "fast-check"
import { container } from "../../../main/config/Inversify.config"
import { Game } from "../../../main/lotto/domain/Game"
import { Ticket } from "../../../main/lotto/domain/Ticket"
import { WinningNumbersApiClient } from "../../../main/lotto/service/WinningNumbersApiClient"
import { WinningNumbers } from "../../../main/lotto/domain/WinningNumbers"
import { getConnection } from "typeorm"
import { LottoShop } from "../../../main/lotto/service/LottoShop"
import { connectTestDB } from "../../TestUtils"

let lottoShop: LottoShop
let recentWinningNumbers: WinningNumbers

beforeAll(async () => {
  await connectTestDB()
  lottoShop = container.get<LottoShop>(LottoShop)
  recentWinningNumbers = await container.get<WinningNumbersApiClient>(WinningNumbersApiClient).getRecent()
})

afterAll(async () => {
  await getConnection().close()
                       .catch(e => console.log(e))
})

describe("Purchasing lotto...", () => {
  it("Failed: Not enough budget", () =>
    fc.assert(
        fc.property(
            fc.integer(LottoShop.PRICE_PER_GAME - 1),
            i => expect(() => lottoShop.purchase(i, [])).toThrow()
        )
    )
  )

  it("Success: Manual", async () =>
    expect(
        await lottoShop.purchase(1000, [[1, 2, 3, 4, 5, 6]])
    ).toEqual(
        new Ticket(recentWinningNumbers.round, [new Game([1, 2, 3, 4, 5, 6])])
    )
  )

  it("Success: Auto", () =>
    fc.assert(
      fc.asyncProperty(
          fc.scheduler(),
          fc.integer(LottoShop.PRICE_PER_GAME, Number.MAX_SAFE_INTEGER),
          async (scheduler, i) => {
            scheduler.scheduleFunction(() => expect(lottoShop.purchase(i, [])).resolves.toBeInstanceOf(Ticket))
          }
      )
    )
  )
})
