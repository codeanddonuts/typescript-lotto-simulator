import { Game, SixPicks } from "../domain/Game"
import { Ticket } from "../domain/Ticket"
import { WinningNumbersRepository } from "../repository/WinningNumbersRepository.1"
import { injectable, inject } from "inversify"
import { Money } from "../domain/Money"

@injectable()
export class LottoMachine {
  public static PRICE_PER_GAME = new Money(1000)
  
  private readonly buffer: Game[] = []

  constructor(@inject(WinningNumbersRepository) private readonly winningNumbersRepository: WinningNumbersRepository) {}

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
