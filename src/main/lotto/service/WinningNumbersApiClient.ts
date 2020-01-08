import { Round } from "../domain/Round"
import { WinningNumbers } from "../domain/WinningNumbers"

export abstract class WinningNumbersApiClient {
  abstract get(round: Round): Promise<WinningNumbers> | never
  abstract getRecent(): Promise<WinningNumbers> | never
}
