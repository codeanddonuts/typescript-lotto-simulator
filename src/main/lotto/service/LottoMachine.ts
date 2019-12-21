import { Game, SixPicks } from "../domain/Game"
import { Ticket } from "../domain/Ticket"
import { WinningNumbersRepository } from "../repository/WinningNumbersRepository"
import { injectable, inject } from "inversify"
import { TYPES } from "../../di/types"

@injectable()
export class LottoMachine {
  private readonly buffer: Game[] = []

  constructor(@inject(TYPES.WinningNumbersRepository) private readonly winningNumbersRepository: WinningNumbersRepository) {}

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
    const tmp = [...this.buffer]
    this.buffer.length = 0
    return new Ticket((await this.winningNumbersRepository.recent()).round, tmp)
  }
}
