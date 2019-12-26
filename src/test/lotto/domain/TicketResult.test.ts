import { Ticket } from "../../../main/lotto/domain/Ticket"
import { Round } from "../../../main/lotto/domain/Round"
import { Game } from "../../../main/lotto/domain/Game"
import { TicketResult } from "../../../main/lotto/domain/TicketResult"
import { WinningNumbers } from "../../../main/lotto/domain/WinningNumbers"
import { Money } from "../../../main/lotto/domain/Money"

describe("Total prize is ...", () => {
  const winningNumbers = new WinningNumbers(new Round(889), new Game([3, 13, 29, 38, 39, 42]), 26)

  it("0", () => {
    const ticket = new Ticket(new Round(889), [new Game([1, 2, 3, 4, 5, 6]), new Game([1, 2, 3, 4, 5, 6])])
    expect((new TicketResult(ticket, winningNumbers)).totalPrize).toEqual(new Money(0))
  })
  
  it("30,005,000", () => {
    const ticket = new Ticket(new Round(889), [new Game([3, 13, 29, 38, 39, 26]), new Game([3, 13, 29, 30, 31, 32])])
    expect((new TicketResult(ticket, winningNumbers)).totalPrize).toEqual(new Money(30005000))
  })
})
