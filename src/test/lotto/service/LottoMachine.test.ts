import { container } from "../../../main/di/Inversify.config"
import { Game } from "../../../main/lotto/domain/Game"
import { LottoMachine } from "../../../main/lotto/service/LottoMachine"
import { Ticket } from "../../../main/lotto/domain/Ticket"
import { createConnection, getConnectionOptions, getConnection } from "typeorm"
import { APPROXIMATE_RECENT_ROUND } from "../RecentRoundMock"

let lottoMachine: LottoMachine

beforeAll(async () => {
  await createConnection(Object.assign(await getConnectionOptions(), { database : "test" }))
  lottoMachine = container.get<LottoMachine>(LottoMachine)
})

afterAll(async () => {
  await getConnection().close().catch(e => console.log(e))
})

describe("Issueing ticket ...", () => {
  it("Failed: Input game(s) first", () => {
    expect(lottoMachine.issue([], 0)).rejects.toThrow()
  })

  it("Success", async () => {
    expect(
        await lottoMachine.issue([[1, 2, 3, 4, 5, 6], [11, 13, 15, 17, 19, 21]], 0)
    ).toEqual(
        new Ticket(
            APPROXIMATE_RECENT_ROUND,
            [new Game([1, 2, 3, 4, 5, 6]), new Game([11, 13, 15, 17, 19, 21])]
        )
    )
  })
})
