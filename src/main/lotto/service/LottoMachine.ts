import { Game, SixPicks } from "../domain/Game"
import { Ticket } from "../domain/Ticket"
import { WinnerAnnouncement } from "./WinnerAnnouncement"

export class LottoMachine {
  private readonly buffer: Game[] = []

  public issueManually(sixPicks: SixPicks): void | never {
    this.buffer.push(new Game(sixPicks))
  }

  public issueAutomatically(): void {
    this.buffer.push(Game.autoGen())
  }
  
  public async printTicket(): Promise<Ticket> | never {
    if (this.buffer.length === 0) {
      throw new Error("먼저 번호를 입력하세요.")
    }
    const tmp = this.buffer
    this.buffer.length = 0
    return new Ticket((await WinnerAnnouncement.recent()).round, tmp)
  }
}
