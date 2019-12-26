import { PrimaryColumn, Column, Entity } from "typeorm"
import { WinningNumbers } from "../domain/WinningNumbers"
import { Game, PickedNumber } from "../domain/Game"
import { Round } from "../domain/Round"

@Entity("winning_numbers")
export class WinningNumbersEntity {
  @PrimaryColumn()
  round!: number
  @Column()
  first!: PickedNumber
  @Column()
  second!: PickedNumber
  @Column()
  third!: PickedNumber
  @Column()
  fourth!: PickedNumber
  @Column()
  fifth!: PickedNumber
  @Column()
  sixth!: PickedNumber
  @Column()
  bonus!: PickedNumber

  private constructor() {}
}

export class WinningNumbersEntityAdapter {
  public static entityToWinningNumbers(entity: WinningNumbersEntity): WinningNumbers {
    return new WinningNumbers(
        new Round(entity.round),
        new Game([entity.first, entity.second, entity.third, entity.fourth, entity.fifth, entity.sixth]),
        entity.bonus
    )
  }

  public static WinningNumbersToEntity(winningNumbers: WinningNumbers): WinningNumbersEntity {
    return {
      round: winningNumbers.round.val,
      first: winningNumbers.mains.getNthPick(1),
      second: winningNumbers.mains.getNthPick(2),
      third: winningNumbers.mains.getNthPick(3),
      fourth: winningNumbers.mains.getNthPick(4),
      fifth: winningNumbers.mains.getNthPick(5),
      sixth: winningNumbers.mains.getNthPick(6),
      bonus: winningNumbers.bonus
    }
  }
}