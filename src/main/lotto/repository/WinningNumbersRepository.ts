import { Round } from "../domain/Round"
import { WinningNumbers } from "../domain/WinningNumbers"
import { Game, PickedNumberCons, SixPicksCons } from "../domain/Game"
import axios from "axios"
import { Maybe } from "../../utils/Maybe"
import { PromiseMaybeTransformer } from "../../utils/MaybeT"
import * as iconv from "iconv-lite"
import { ValueObjectKeyMap } from "../../utils/ValueObject"
import { injectable } from "inversify"
import { getConnection } from "typeorm"
import { WinningNumbersEntity, WinningNumbersEntityAdapter } from "./WinningNumbersEntity"

export abstract class WinningNumbersRepository {
  abstract of(round: Round): Promise<WinningNumbers> | never
  abstract _of(round: Round): Promise<WinningNumbers> | never
  abstract recent(): Promise<WinningNumbers> | never
}

@injectable()
export class WinningNumbersCachedWebCrawler implements WinningNumbersRepository {
  private static readonly FETCH_URL = "https://m.dhlottery.co.kr/gameResult.do?method=byWin"
  private static readonly ROUND_ATTR = "&drwNo="

  private readonly CACHE: Map<Round, WinningNumbers> = new ValueObjectKeyMap()

  public async of(round: Round): Promise<WinningNumbers> | never {
    try {
      return this.CACHE.get(round) ?? (async () => {
        const result = await this.fetchFromWeb(round)
        this.CACHE.set(round, result)
        return result
      })()
    } catch (e) {
      throw new Error(`${round}회차의 당첨 번호를 가져오는 데에 실패하였습니다.`)
    }
  }

  public async recent(): Promise<WinningNumbers> | never {
    try {
      return await this.fetchRecentFromWeb()
    } catch (e) {
      throw new Error("최신 당첨 번호를 가져오는 데에 실패하였습니다.")
    }
  }

  private async fetchFromWeb(round: Round): Promise<WinningNumbers> | never {
    return this.parseResponse(round, await this.requestAnnouncement(round))
  }

  private async fetchRecentFromWeb(): Promise<WinningNumbers> | never {
    const response = await this.requestAnnouncement()
    return Maybe.cons(response.match(/<option value="\d+"  >/)?.shift())
                .map(str => new Round(parseInt(str.substring(15, str.indexOf("  >")))))
                .map(round => this.CACHE.get(round) ?? this.parseResponse(round, response))
                .getOrThrow()
  }

  private async requestAnnouncement(round?: Round): Promise<string> | never {
    const url = WinningNumbersCachedWebCrawler.FETCH_URL + (round ? WinningNumbersCachedWebCrawler.ROUND_ATTR + round : "")
    return iconv.decode(
      (await axios.get(url, { responseType: "arraybuffer" })).data,
      "euc-kr"
    ).toString()
  }

  private parseResponse(round: Round, response: string): WinningNumbers | never {
    return this.extractNumbers(response).map(numbers => this.validateNumbers(round, numbers[0], numbers[1]))
                                        .getOrThrow()
  }

  private extractNumbers(str: string): Maybe<[number[], number]> {
    return Maybe.cons(str.match(/>\d+<\/span>/g)?.map(x => parseInt(x.substring(1, x.indexOf("</span>")))))
                .bind(numbers =>
                  Maybe.cons(numbers.pop()).map(bonus => [numbers, bonus])
                )
  }

  private validateNumbers(round: Round, mains: number[], bonus: number): WinningNumbers | never {
    return new WinningNumbers(round, new Game(SixPicksCons(mains.map(n => PickedNumberCons(n)))), PickedNumberCons(bonus))
  }

  public async _of(round: Round): Promise<WinningNumbers> | never {
    try {
      const cache = getConnection().getRepository(WinningNumbersEntity)
      return PromiseMaybeTransformer.fromNullable(cache.findOne({ where: { round: round.val } }))
                                    .map(entity => WinningNumbersEntityAdapter.entityToWinningNumbers(entity))
                                    .getOrElse(() =>
                                      this.fetchFromWeb(round).then(winningNumbers => {
                                        cache.save(WinningNumbersEntityAdapter.WinningNumbersToEntity(winningNumbers))
                                        return winningNumbers
                                      })
                                    )
    } catch (e) {
      console.log(e)
      throw new Error(`${round}회차의 당첨 번호를 가져오는 데에 실패하였습니다.`)
    }
  }
}
