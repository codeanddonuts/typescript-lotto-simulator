import { Ticket } from "../../../main/lotto/domain/Ticket"
import { Round } from "../../../main/lotto/domain/Round"
import { Game } from "../../../main/lotto/domain/Game"

let ticket: Ticket

beforeEach(() => {
  ticket = new Ticket(new Round(123), [Game.autoGen(), Game.autoGen(), Game.autoGen()])
})

describe("Ticket mapped to ...", () => {
  it("5", () =>
    expect(ticket.map(game => 5) ).toEqual([5, 5, 5])
  )
  
  it('"elevator"', () =>
    expect(ticket.map(game => "elevator") ).toEqual(["elevator", "elevator", "elevator"])
  )
})
