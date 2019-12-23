import "reflect-metadata"
import { Game } from "../../../main/lotto/domain/Game"
import { LottoMachine } from "../../../main/lotto/service/LottoMachine"
import { Ticket } from "../../../main/lotto/domain/Ticket"
import { container } from "../../../main/di/Inversify.config"
import { TYPES } from "../../../main/di/Types"
import { WinningNumbersRepository } from "../../../main/lotto/repository/WinningNumbersRepository"
import { WinningNumbers } from "../../../main/lotto/domain/WinningNumbers"

let lottoMachineService: LottoMachine
let recentWinningNumbers: WinningNumbers

beforeAll(async () => {
  recentWinningNumbers = await container.get<WinningNumbersRepository>(TYPES.WinningNumbersRepository).recent()
})

beforeEach(() => {
  container.snapshot()
  lottoMachineService = container.get<LottoMachine>(LottoMachine)
})

afterEach(() => {
  container.restore()
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