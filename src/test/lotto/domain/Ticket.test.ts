import { Ticket } from "../../../main/lotto/domain/Ticket"
import { Round } from "../../../main/lotto/domain/Round"
import { Game } from "../../../main/lotto/domain/Game"
import { WinningNumbers } from "../../../main/lotto/domain/WinningNumbers"

describe("Result?", () => {
  it("No: Winning numbers from different round", () => {
    const ticket = new Ticket(new Round(889), [new Game([3, 13, 29, 38, 39, 42])])
    const winningNumbers = new WinningNumbers(new Round(888), new Game([3, 13, 29, 38, 39, 42]), 26)
    expect(() => ticket.matchResult(winningNumbers)).toThrow()
  })
})

describe("Total prize is ...", () => {
  const winningNumbers = new WinningNumbers(new Round(889), new Game([3, 13, 29, 38, 39, 42]), 26)

  it("0", () => {
    const ticket = new Ticket(new Round(889), [new Game([1, 2, 3, 4, 5, 6]), new Game([1, 2, 3, 4, 5, 6])])
    expect(ticket.matchResult(winningNumbers).totalPrize).toEqual(0)
  })
  
  it("30,005,000", () => {
    const ticket = new Ticket(new Round(889), [new Game([3, 13, 29, 38, 39, 26]), new Game([3, 13, 29, 30, 31, 32])])
    expect(ticket.matchResult(winningNumbers).totalPrize).toEqual(30_005_000)
  })
})
