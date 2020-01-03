import { Round } from "../domain/Round"
import { WinningNumbers } from "../domain/WinningNumbers"
import { Game, PickedNumberCons, PickGroupCons, PickedNumber } from "../domain/Game"
import axios from "axios"
import { Maybe, Nothing } from "../../utils/Maybe"
import * as iconv from "iconv-lite"
import { WinningNumbersRepository } from "./WinningNumbersRepository"
import { Money } from "../domain/Money"
import { injectable } from "inversify"

const FETCH_URL = "https://m.dhlottery.co.kr/gameResult.do?method=byWin"
const FETCH_URL_ROUND_ATTR = "&drwNo="
const NUMBERS_PATTERN = />\d+<\/span>/g
const PRIZES_PATTERN = /<strong>[\d|,]+ 원<\/strong>/g
const RECENT_ROUND_PATTERN = /<option value="\d+"  >/

@injectable()
export class WinningNumbersWebCrawler implements WinningNumbersRepository {
  public async of(round: Round): Promise<WinningNumbers> | never {
    try {
      return (await this.requestFromWeb(round)).bind(response => this.parseWinningNumbersAndPrizes(response))
                                               .map(result => new WinningNumbers(round, result.game, result.bonus, result.prizes))
                                               .getOrThrow()
    } catch (e) {
      if (e.isAxiosError) {
        throw new Error(`${round}회차의 당첨 번호를 가져오는 데에 실패하였습니다.`)
      }
      throw new Error("서버 점검 중입니다.")
    }
  }

  public async ofRecent(): Promise<WinningNumbers> | never {
    try {
      return (await this.requestFromWeb()).bind(response =>
        this.parseWinningNumbersAndPrizes(response).bind(result => 
          this.parseRecentRound(response).map(round =>
            new WinningNumbers(round, result.game, result.bonus, result.prizes)
          )
        )
      ).getOrThrow()
    } catch (e) {
      if (e.isAxiosError) {
        throw new Error("최신 당첨 번호를 가져오는 데에 실패하였습니다.")
      }
      throw new Error("서버 점검 중입니다.")
    }
  }

  protected async requestFromWeb(round?: Round): Promise<Maybe<string>> {
    try {
      const url = FETCH_URL + (round ? (FETCH_URL_ROUND_ATTR + round) : "")
      return Maybe.cons(
          iconv.decode(
              (await axios.get(url, { responseType: "arraybuffer" })).data,
              "euc-kr"
          ).toString()
      )
    } catch (e) {
      return new Nothing()
    }
  }

  protected parseWinningNumbersAndPrizes(response: string): Maybe<{ game: Game, bonus: PickedNumber, prizes: Money[] }> {
    return Maybe.cons(response.match(NUMBERS_PATTERN)?.map(str => parseInt(str.substring(1), 10)))
                .bind(numbers =>
            Maybe.cons(numbers.pop())
                  .bind(bonus =>
              Maybe.cons(response.match(PRIZES_PATTERN)?.map(str => parseInt(str.replace(/\,/g, "").substring(8), 10)))
                    .map(prizes => ({
                      game: new Game(PickGroupCons(numbers.map(n => PickedNumberCons(n)))),
                      bonus: PickedNumberCons(bonus),
                      prizes: prizes as Money[]
                    }))
    ))
  }

  protected parseRecentRound(response: string): Maybe<Round> {
    return Maybe.cons(response.match(RECENT_ROUND_PATTERN)?.shift())
                .map(str => new Round(parseInt(str.substring(15), 10)))
  }
}
