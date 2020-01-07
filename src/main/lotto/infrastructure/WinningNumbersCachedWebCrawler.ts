import { Round } from "../domain/Round"
import { WinningNumbers } from "../domain/WinningNumbers"
import { Game } from "../domain/Game"
import { PickedNumber } from "../domain/Pick"
import { PromiseMaybeT } from "../../utils/MaybeT"
import { injectable } from "inversify"
import { getConnection, Entity, PrimaryColumn, Column } from "typeorm"
import { Money } from "../domain/Money"
import { TIER } from "../domain/Tier"
import { WinningNumbersWebCrawler } from "./WinningNumbersWebCrawler"
import { Maybe } from "../../utils/Maybe"
import { WinningNumbersFetchFailureException } from "./WinningNumbersFetchFailureException"

@injectable()
export class WinningNumbersCachedWebCrawler extends WinningNumbersWebCrawler {
  public async get(round: Round): Promise<WinningNumbers> | never {
    return (await this.retrieveFromCacheOrParseNew(round)).getOrThrow(WinningNumbersFetchFailureException.of(round))
  }

  public getRecent(): Promise<WinningNumbers> | never {
    return PromiseMaybeT.cons(super.requestFromWeb()).bind(response =>
      PromiseMaybeT.liftMaybe(super.parseRecentRound(response)).bind(round =>
        PromiseMaybeT.cons(this.retrieveFromCacheOrParseNew(round, response))
      )
    ).run().then(res => res.getOrThrow(WinningNumbersFetchFailureException.ofRecent()))
  }

  private retrieveFromCacheOrParseNew(round: Round, response?: string): Promise<Maybe<WinningNumbers>> {
    const cache = getConnection().getRepository(WinningNumbersEntity)
    return PromiseMaybeT.liftPromise(cache.findOne({ where: { round: round.num }, cache: true }))
                        .map(entity => WinningNumbersEntityAdapter.convertEntityToWinningNumbers(entity))
                        .orElse(() =>
           PromiseMaybeT.lift(response)
                        .orElse(() => PromiseMaybeT.cons(super.requestFromWeb(round)))
                        .bind(response => PromiseMaybeT.liftMaybe(super.parseWinningNumbersAndPrizes(response)))
                        .map(result => {
                          const winningNumbers = new WinningNumbers(round, result.game, result.bonus, result.prizes)
                          cache.save(WinningNumbersEntityAdapter.convertWinningNumbersToEntity(winningNumbers))
                          return winningNumbers
                        })
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
      first_prize: `${winningNumbers.prizeOf(TIER.JACKPOT)}`,
      second_prize: winningNumbers.prizeOf(TIER.SECOND),
      third_prize: winningNumbers.prizeOf(TIER.THIRD),
      fourth_prize: winningNumbers.prizeOf(TIER.FOURTH),
      fifth_prize: winningNumbers.prizeOf(TIER.FIFTH)
    }
  }
}
