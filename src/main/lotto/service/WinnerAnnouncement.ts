import { Round } from "../domain/Round"
import { WinningNumbers } from "../domain/WinningNumbers"
import { WinningNumbersHistory } from "../repository/WinningNumbersHistory"
import { Game, PickedNumberCons, SixPicksCons } from "../domain/Game"
import axios from "axios"
import { Maybe } from "../../utils/Maybe"
import * as iconv from "iconv-lite"

export class WinnerAnnouncement {
  private static readonly FETCH_URL = "https://m.dhlottery.co.kr/gameResult.do?method=byWin"
  private static readonly ROUND_ATTR = "&drwNo="

  public static async recent(): Promise<WinningNumbers> {
    return await this.fetchRecentFromWeb()
  }

  public static async of(round: Round): Promise<WinningNumbers> | never {
    try {
      return await WinningNumbersHistory.findOne(round) ?? (async () => {
        const result = await this.fetchFromWeb(round)
        WinningNumbersHistory.save(result)
        return result
      })()
    } catch (e) {
      throw new Error("당첨 번호를 가져오는 데에 실패하였습니다.")
    }
  }

  private static async fetchFromWeb(round: Round): Promise<WinningNumbers> | never {
    return this.extractNumbers(await this.requestAnnouncement(round)).map(numbers =>
      this.validateNumbers(round, numbers[0], numbers[1])
    ).orElseThrow()
  }

  private static async fetchRecentFromWeb(): Promise<WinningNumbers> | never {
    const response = await this.requestAnnouncement()
    return this.extractNumbers(response).bind(numbers =>
      Maybe.cons(response.match(/<option value="\d+"  >/)?.shift())
           .map(x => parseInt(x.substring(15, x.indexOf("  >"))))
           .map(round => this.validateNumbers(new Round(round), numbers[0], numbers[1]))
    ).orElseThrow()
  }

  private static async requestAnnouncement(round?: Round): Promise<string> | never {
    return iconv.decode(
      (await axios.get(this.FETCH_URL + (round ? this.ROUND_ATTR + round : ""), { responseType: "arraybuffer" })).data,
      "euc-kr"
    ).toString()
  }

  private static extractNumbers(str: string): Maybe<[number[], number]> {
    return Maybe.cons(str.match(/>\d+<\/span>/g)?.map(x => parseInt(x.substring(1, x.indexOf("</span>")))))
                .bind(numbers =>
                  Maybe.cons(numbers.pop()).map(bonus =>
                    [numbers, bonus]
                  )
                )
  }

  private static validateNumbers(round: Round, mains: number[], bonus: number): WinningNumbers {
    return new WinningNumbers(round, new Game(SixPicksCons(mains.map(n => PickedNumberCons(n)))), PickedNumberCons(bonus))
  }
}