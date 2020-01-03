import { Round } from "../domain/Round"
import { WinningNumbers } from "../domain/WinningNumbers"
import { Game, PickedNumber } from "../domain/Game"
import { PromiseMaybeT } from "../../utils/MaybeT"
import { injectable } from "inversify"
import { getConnection, Entity, PrimaryColumn, Column } from "typeorm"
import { Money } from "../domain/Money"
import { Tiers } from "../domain/Tier"
import { WinningNumbersWebCrawler } from "./WinningNumbersWebCrawler"
import { Maybe } from "../../utils/Maybe"

@injectable()
export class WinningNumbersCachedWebCrawler extends WinningNumbersWebCrawler {
  public async of(round: Round): Promise<WinningNumbers> | never {
    try {
      return (await this.retrieveFromCacheOrParseNew(round)).getOrThrow()
    } catch (e) {
      if (e.isAxiosError) {
        throw new Error(`${round}회차의 당첨 번호를 가져오는 데에 실패하였습니다.`)
      }
      throw new Error("서버 점검 중입니다.")
    }
  }

  public async ofRecent(): Promise<WinningNumbers> | never {
    try {
      return PromiseMaybeT.cons(super.requestFromWeb()).bind(response =>
        PromiseMaybeT.liftMaybe(super.parseRecentRound(response)).bind(round =>
          PromiseMaybeT.cons(this.retrieveFromCacheOrParseNew(round, response))
        )
      ).run().then(x => x.getOrThrow())
    } catch (e) {
      if (e.isAxiosError) {
        throw new Error("최신 당첨 번호를 가져오는 데에 실패하였습니다.")
      }
      throw new Error("서버 점검 중입니다.")
    }
  }

  private async retrieveFromCacheOrParseNew(round: Round, response?: string): Promise<Maybe<WinningNumbers>> {
    const cache = getConnection().getRepository(WinningNumbersEntity)
    return PromiseMaybeT.liftPromise(cache.findOne({ where: { round: round.num }, cache: true }))
                        .map(entity => WinningNumbersEntityAdapter.convertEntityToWinningNumbers(entity))
                        .orElse(() =>
           PromiseMaybeT.lift(response)
                        .orElse(() => PromiseMaybeT.cons(super.requestFromWeb(round)))
                        .bind(response =>
                          PromiseMaybeT.liftMaybe(super.parseWinningNumbersAndPrizes(response)
                                       .map(result => {
                                          const winningNumbers = new WinningNumbers(round, result.game, result.bonus, result.prizes)
                                          cache.save(WinningNumbersEntityAdapter.convertWinningNumbersToEntity(winningNumbers))
                                          return winningNumbers
                                       })
                        ))
    ).run()
  }
}

@Entity("winning_numbers")
export class WinningNumbersEntity {
  @PrimaryColumn("int")
  round!: number
  @Column("tinyint")
  first_num!: PickedNumber
  @Column("tinyint")
  second_num!: PickedNumber
  @Column("tinyint")
  third_num!: PickedNumber
  @Column("tinyint")
  fourth_num!: PickedNumber
  @Column("tinyint")
  fifth_num!: PickedNumber
  @Column("tinyint")
  sixth_num!: PickedNumber
  @Column("tinyint")
  bonus_num!: PickedNumber
  @Column("bigint")
  first_prize!: string
  @Column("int")
  second_prize!: Money
  @Column("mediumint")
  third_prize!: Money
  @Column("mediumint")
  fourth_prize!: Money
  @Column("smallint")
  fifth_prize!: Money

  private constructor() {}
}

export class WinningNumbersEntityAdapter {
  public static convertEntityToWinningNumbers(entity: WinningNumbersEntity): WinningNumbers {
    return new WinningNumbers(
        new Round(entity.round),
        new Game([entity.first_num, entity.second_num, entity.third_num, entity.fourth_num, entity.fifth_num, entity.sixth_num]),
        entity.bonus_num,
        [parseInt(entity.first_prize, 10), entity.second_prize, entity.third_prize, entity.fourth_prize, entity.fifth_prize]
    )
  }

  public static convertWinningNumbersToEntity(winningNumbers: WinningNumbers): WinningNumbersEntity {
    return {
      round: winningNumbers.round.num,
      first_num: winningNumbers.mains.getNthPick(1),
      second_num: winningNumbers.mains.getNthPick(2),
      third_num: winningNumbers.mains.getNthPick(3),
      fourth_num: winningNumbers.mains.getNthPick(4),
      fifth_num: winningNumbers.mains.getNthPick(5),
      sixth_num: winningNumbers.mains.getNthPick(6),
      bonus_num: winningNumbers.bonus,
      first_prize: `${winningNumbers.prizeOf(Tiers.JACKPOT)}`,
      second_prize: winningNumbers.prizeOf(Tiers.SECOND),
      third_prize: winningNumbers.prizeOf(Tiers.THIRD),
      fourth_prize: winningNumbers.prizeOf(Tiers.FOURTH),
      fifth_prize: winningNumbers.prizeOf(Tiers.FIFTH)
    }
  }
}
