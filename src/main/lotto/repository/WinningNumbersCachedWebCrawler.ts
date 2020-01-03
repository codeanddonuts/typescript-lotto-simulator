import { Round } from "../domain/Round"
import { WinningNumbers } from "../domain/WinningNumbers"
import { Game, PickedNumberCons, PickGroupCons, PickedNumber } from "../domain/Game"
import axios from "axios"
import { Maybe } from "../../utils/Maybe"
import { PromiseMaybeTransformer } from "../../utils/MaybeT"
import * as iconv from "iconv-lite"
import { injectable } from "inversify"
import { getConnection, Entity, PrimaryColumn, Column } from "typeorm"
import { WinningNumbersRepository } from "./WinningNumbersRepository"
import { Money } from "../domain/Money"
import { Tiers } from "../domain/Tier"

const FETCH_URL = "https://m.dhlottery.co.kr/gameResult.do?method=byWin"
const FETCH_URL_ROUND_ATTR = "&drwNo="
const NUMBERS_PATTERN = />\d+<\/span>/g
const PRIZES_PATTERN = /<strong>[\d|,]+ 원<\/strong>/g
const RECENT_ROUND_PATTERN = /<option value="\d+"  >/

@injectable()
export class WinningNumbersCachedWebCrawler implements WinningNumbersRepository {
  async of(round: Round): Promise<WinningNumbers> | never {
    try {
      return this.retrieveFromCacheOrParseNew(round)
    } catch (e) {
      if (e.isAxiosError) {
        throw new Error(`${round}회차의 당첨 번호를 가져오는 데에 실패하였습니다.`)
      }
      throw new Error("서버 점검 중입니다.")
    }
  }

  public async ofRecent(): Promise<WinningNumbers> | never {
    try {
      const responseBody = await this.requestFromWeb()
      return Maybe.cons(responseBody.match(RECENT_ROUND_PATTERN)?.shift())
                  .map(str => new Round(parseInt(str.substring(15), 10)))
                  .map(round => this.retrieveFromCacheOrParseNew(round, responseBody))
                  .getOrThrow()
    } catch (e) {
      if (e.isAxiosError) {
        throw new Error("최신 당첨 번호를 가져오는 데에 실패하였습니다.")
      }
      throw new Error("서버 점검 중입니다.")
    }
  }

  private async requestFromWeb(round?: Round): Promise<string> | never {
    const url = FETCH_URL + (round ? (FETCH_URL_ROUND_ATTR + round) : "")
    return iconv.decode(
      (await axios.get(url, { responseType: "arraybuffer" })).data,
      "euc-kr"
    ).toString()
  }

  private async retrieveFromCacheOrParseNew(round: Round, responseBody?: string): Promise<WinningNumbers> | never {
    const cache = getConnection().getRepository(WinningNumbersEntity)
    return PromiseMaybeTransformer.fromNullable(cache.findOne({ where: { round: round.num }, cache: true }))
                                  .map(entity => WinningNumbersEntityAdapter.convertEntityToWinningNumbers(entity))
                                  .getOrElse(async () => {
                                    const numbers = this.parseHtml(responseBody ?? await this.requestFromWeb(round))
                                    const winningNumbers = new WinningNumbers(round, numbers.game, numbers.bonus, numbers.prizes)
                                    cache.save(WinningNumbersEntityAdapter.convertWinningNumbersToEntity(winningNumbers))
                                    return winningNumbers
                                  })
  }

  private parseHtml(responseBody: string): { game: Game, bonus: PickedNumber, prizes: Money[] } | never {
    return Maybe.cons(responseBody.match(NUMBERS_PATTERN)?.map(str => parseInt(str.substring(1), 10)))
                .bind(numbers =>
                  Maybe.cons(numbers.pop())
                       .bind(bonus =>
                    Maybe.cons(responseBody.match(PRIZES_PATTERN)?.map(str => parseInt(str.replace(/\,/g, "").substring(8), 10)))
                         .map(prizes => ({
                            game: new Game(PickGroupCons(numbers.map(n => PickedNumberCons(n)))),
                            bonus: PickedNumberCons(bonus),
                            prizes: prizes as Money[]
                          }))
                    )
                ).getOrThrow()
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
