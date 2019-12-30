import fc from "fast-check"
import { container } from "../../../main/di/Inversify.config"
import { Game } from "../../../main/lotto/domain/Game"
import { Ticket } from "../../../main/lotto/domain/Ticket"
import { WinningNumbersRepository } from "../../../main/lotto/repository/WinningNumbersRepository"
import { WinningNumbers } from "../../../main/lotto/domain/WinningNumbers"
import { createConnection, getConnection, getConnectionOptions } from "typeorm"
import { LottoShop } from "../../../main/lotto/service/LottoShop"
import { LottoMachine } from "../../../main/lotto/service/LottoMachine"

let lottoShop: LottoShop
let recentWinningNumbers: WinningNumbers

beforeAll(async () => {
  await createConnection(Object.assign(await getConnectionOptions(), { database : "test" }))
  lottoShop = container.get<LottoShop>(LottoShop)
  recentWinningNumbers = await container.get<WinningNumbersRepository>(WinningNumbersRepository).ofRecent()
})

afterAll(async () => {
  await getConnection().close().catch(e => console.log(e))
})

describe("Purchasing lotto...", () => {
  it("Failed: Not enough budget", () =>
    fc.assert(
        fc.property(
            fc.integer(LottoMachine.PRICE_PER_GAME - 1),
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
          fc.integer(LottoMachine.PRICE_PER_GAME, Number.MAX_SAFE_INTEGER),
          async (scheduler, i) => {
            scheduler.scheduleFunction(() => expect(lottoShop.purchase(i, [])).resolves.toBeInstanceOf(Ticket))
          }
      )
    )
  )
})
