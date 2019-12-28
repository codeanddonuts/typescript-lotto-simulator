import "reflect-metadata"
import { Game } from "../../../main/lotto/domain/Game"
import { LottoMachine } from "../../../main/lotto/service/LottoMachine"
import { Ticket } from "../../../main/lotto/domain/Ticket"
import { container } from "../../../main/di/Inversify.config"
import { WinningNumbersRepository } from "../../../main/lotto/repository/WinningNumbersRepository"
import { WinningNumbers } from "../../../main/lotto/domain/WinningNumbers"
import { createConnection, getConnection, getConnectionOptions } from "typeorm"

let lottoMachineService: LottoMachine
let recentWinningNumbers: WinningNumbers

beforeAll(async () => {
  const connection = await createConnection(Object.assign(await getConnectionOptions(), { database : "test" }))
  await connection.createQueryRunner().dropTable("winning_numbers", true)
  recentWinningNumbers = await container.get<WinningNumbersRepository>(WinningNumbersRepository).ofRecent()
})

beforeEach(() => {
  container.snapshot()
  lottoMachineService = container.get<LottoMachine>(LottoMachine)
})

afterEach(() => {
  container.restore()
})

afterAll(async () => {
  const connection = getConnection()
  await connection.createQueryRunner().dropTable("winning_numbers", true)
  await connection.close().catch(e => console.log(e))
})

describe("Printing ticket ...", () => {
  it("Failed: Purchase game(s) first", () => {
    expect(lottoMachineService.printTicket()).rejects.toThrow()
  })

  it("OK", async () => {
    lottoMachineService.issueManually([1, 2, 3, 4, 5, 6])
    lottoMachineService.issueManually([11, 13, 15, 17, 19, 21])
    expect(await lottoMachineService.printTicket()).toEqual(
        new Ticket(recentWinningNumbers.round, [new Game([1, 2, 3, 4, 5, 6]), new Game([11, 13, 15, 17, 19, 21])])
    )
  })
})
