import { WinningNumbers } from "../domain/WinningNumbers"
import { ValueObjectKeyMap } from "../../utils/ValueObject"
import { Round } from "../domain/Round"

export class WinningNumbersHistory {
  private static storage: Map<Round, WinningNumbers> = new ValueObjectKeyMap()

  public static async findOne(round: Round): Promise<WinningNumbers | undefined> {
    try {
      return await this.storage.get(round)
    } catch (e) {
      return undefined
    }
  }
  public static async save(winningNumbers: WinningNumbers): Promise<WinningNumbersHistory> | never {
    await this.storage.set(winningNumbers.round, winningNumbers)
    return this
  }
}
