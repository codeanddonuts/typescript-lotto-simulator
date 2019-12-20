import { Game, SixPicks } from "../domain/Game"
import { Ticket } from "../domain/Ticket"
import { WinningNumbersRepository } from "../repository/WinningNumbersRepository"

export class LottoMachineService {
  private readonly buffer: Game[] = []

  constructor(private readonly winningNumbersRepository: WinningNumbersRepository) {}

  public issueManually(sixPicks: SixPicks): void | never {
    this.buffer.push(new Game(sixPicks))
  }

  public issueAutomatically(): void {
    this.buffer.push(Game.autoGen())
  }
  
  public async printTicket(): Promise<Ticket> | never {
    console.log(this.buffer.length)
    if (this.buffer.length === 0) {
      throw new Error("먼저 번호를 입력하세요.")
    }
    const tmp: Game[] = this.buffer
    this.buffer.length = 0
    return new Ticket((await this.winningNumbersRepository.recent()).round, tmp)
  }
}
