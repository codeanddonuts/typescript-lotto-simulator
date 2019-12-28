import { Round } from "../domain/Round"
import { WinningNumbers } from "../domain/WinningNumbers"

export abstract class WinningNumbersRepository {
  abstract of(round: Round): Promise<WinningNumbers> | never
  abstract ofRecent(): Promise<WinningNumbers> | never
}
