import { Round } from "../domain/Round"

export class WinningNumbersFetchFailureException extends Error {
  public static of(round: Round): WinningNumbersFetchFailureException {
    return new WinningNumbersFetchFailureException(`${round}회차의 당첨 번호를 가져오는 데에 실패하였습니다.`)
  }

  public static ofRecent(): WinningNumbersFetchFailureException {
    return new WinningNumbersFetchFailureException("최신 당첨 번호를 가져오는 데에 실패하였습니다.")
  }

  constructor(message?: string) {
    super(message)
    this.name = new.target.name
    Object.setPrototypeOf(this, new.target.prototype)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
