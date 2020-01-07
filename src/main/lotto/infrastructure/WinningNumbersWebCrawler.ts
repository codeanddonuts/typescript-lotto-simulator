import { Round } from "../domain/Round"
import { WinningNumbers } from "../domain/WinningNumbers"
import { Game, PickGroup } from "../domain/Game"
import { PickedNumber } from "../domain/Pick"
import axios from "axios"
import { Maybe, Nothing, Just } from "../../utils/Maybe"
import * as iconv from "iconv-lite"
import { WinningNumbersApiClient } from "../service/WinningNumbersApiClient"
import { Money } from "../domain/Money"
import { injectable } from "inversify"
import { WinningNumbersFetchFailureException } from "./WinningNumbersFetchFailureException"

const FETCH_URL = "https://m.dhlottery.co.kr/gameResult.do?method=byWin"
const FETCH_URL_ROUND_ATTR = "&drwNo="
const NUMBERS_PATTERN = />\d+<\/span>/g
const PRIZES_PATTERN = /<strong>[\d|,]+ 원<\/strong>/g
const RECENT_ROUND_PATTERN = /<option value="\d+"  >/

@injectable()
export class WinningNumbersWebCrawler implements WinningNumbersApiClient {
  public async get(round: Round): Promise<WinningNumbers> | never {
      return (await this.requestFromWeb(round)).bind(response => this.parseWinningNumbersAndPrizes(response))
                                               .map(result => new WinningNumbers(round, result.game, result.bonus, result.prizes))
                                               .getOrThrow(WinningNumbersFetchFailureException.of(round))
  }

  public async getRecent(): Promise<WinningNumbers> | never {
    return (await this.requestFromWeb()).bind(response =>
      this.parseWinningNumbersAndPrizes(response).bind(result => 
        this.parseRecentRound(response).map(round =>
          new WinningNumbers(round, result.game, result.bonus, result.prizes)
        )
      )
    ).getOrThrow(WinningNumbersFetchFailureException.ofRecent())
  }

  protected requestFromWeb(round?: Round): Promise<Maybe<string>> {
    const url = FETCH_URL + (round ? (FETCH_URL_ROUND_ATTR + round) : "")
    return axios.get(url, { responseType: "arraybuffer" }).then(res => Just(iconv.decode(res.data, "euc-kr").toString()))
                                                          .catch(() => Nothing())
    }

  protected parseWinningNumbersAndPrizes(response: string): Maybe<{ game: Game, bonus: PickedNumber, prizes: Money[] }> {
    return Maybe(response.match(NUMBERS_PATTERN)?.map(str => parseInt(str.substring(1), 10))).bind(numbers =>
      Maybe(numbers.pop()).bind(bonus =>
        Maybe(response.match(PRIZES_PATTERN)?.map(str => parseInt(str.replace(/\,/g, "").substring(8), 10))).map(prizes => ({
          game: new Game(PickGroup(numbers.map(n => PickedNumber(n)))),
          bonus: PickedNumber(bonus),
          prizes: prizes as Money[]
        }))
      )
    )
  }

  protected parseRecentRound(response: string): Maybe<Round> {
    return Maybe(response.match(RECENT_ROUND_PATTERN)?.shift()).map(str => new Round(parseInt(str.substring(15), 10)))
  }
}
