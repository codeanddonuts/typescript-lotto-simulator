import fc from "fast-check"
import { container } from "../../../main/config/Inversify.config"
import { Game } from "../../../main/lotto/domain/Game"
import { LottoMachine } from "../../../main/lotto/service/LottoMachine"
import { Ticket } from "../../../main/lotto/domain/Ticket"
import { getConnection } from "typeorm"
import { APPROXIMATE_RECENT_ROUND, connectTestDB } from "../../TestUtils"
import { Round } from "../../../main/lotto/domain/Round"

let lottoMachine: LottoMachine

beforeAll(async () => {
  await connectTestDB()
  lottoMachine = container.get<LottoMachine>(LottoMachine)
})

afterAll(async () => {
  await getConnection().close()
                       .catch(e => console.log(e))
})

describe("Issueing ticket ...", () => {
  it("Failed: Input game(s) first", () => {
    expect(lottoMachine.issue([], 0)).rejects.toThrow()
  })

  it("Success", async () => {
    expect(
        await lottoMachine.issue([[1, 2, 3, 4, 5, 6], [11, 13, 15, 17, 19, 21]], 0)
    ).toEqual(
        new Ticket(APPROXIMATE_RECENT_ROUND, [new Game([1, 2, 3, 4, 5, 6]), new Game([11, 13, 15, 17, 19, 21])])
    )
  })

  it("Success", async () => {
    expect(
        await lottoMachine.issue([[1, 2, 3, 4, 5, 6], [11, 13, 15, 17, 19, 21]], 0, new Round(123))
    ).toEqual(
        new Ticket(new Round(123), [new Game([1, 2, 3, 4, 5, 6]), new Game([11, 13, 15, 17, 19, 21])])
    )
  })

  it("Failed: Too many games in a single ticket", () => {
    fc.assert(
        fc.asyncProperty(
            fc.scheduler(),
            fc.integer(LottoMachine.MAX_PURCHASE_AMOUNT + 1),
            async (scheduler, n) => {
              scheduler.scheduleFunction(() => expect(lottoMachine.issue([], n)).resolves.toBeInstanceOf(Ticket))
            }
        )
    )
  })

  it("Success", () => {
    fc.assert(
        fc.asyncProperty(
            fc.scheduler(),
            fc.integer(1, LottoMachine.MAX_PURCHASE_AMOUNT),
            async (scheduler, n) => {
              scheduler.scheduleFunction(() => expect(lottoMachine.issue([], n)).resolves.toBeInstanceOf(Ticket))
            }
        )
    )
  })
})
