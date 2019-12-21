
import { Game } from "../../../main/lotto/domain/Game"
import { LottoMachineService } from "../../../main/lotto/service/LottoMachineService"
import { Ticket } from "../../../main/lotto/domain/Ticket"
import { WinningNumbersWebRepository } from "../../../main/lotto/repository/WinningNumbersRepository"

const winningNumbersRepository = new WinningNumbersWebRepository()
let lottoMachine: LottoMachineService

beforeEach(() => {
  lottoMachine = new LottoMachineService(winningNumbersRepository)
})

describe("Printing ticket ...", () => {
  it("Failed: Purchase game(s) first", () => {
    expect(lottoMachine.printTicket()).rejects.toThrow()
  })

  it("OK", async () => {
    lottoMachine.issueManually([1, 2, 3, 4, 5, 6])
    lottoMachine.issueManually([11, 13, 15, 17, 19, 21])
    expect(await lottoMachine.printTicket()).toEqual(
        new Ticket(
            (await winningNumbersRepository.recent()).round,
            [new Game([1, 2, 3, 4, 5, 6]), new Game([11, 13, 15, 17, 19, 21])]
        )
    )
  })
})