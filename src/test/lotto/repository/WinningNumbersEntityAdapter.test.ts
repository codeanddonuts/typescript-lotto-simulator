import { Round } from "../../../main/lotto/domain/Round"
import { Game } from "../../../main/lotto/domain/Game"
import { WinningNumbersEntityAdapter } from "../../../main/lotto/repository/WinningNumbersEntity"
import { WinningNumbers } from "../../../main/lotto/domain/WinningNumbers"

describe("Entity -> Winning Numbers", () => {
  it("35, [1, 3, 7, 21, 25, 34] + 8", () => {
    expect(
        WinningNumbersEntityAdapter.entityToWinningNumbers({
          round: 35,
          first: 1,
          second: 3,
          third: 7,
          fourth: 21,
          fifth: 25,
          sixth: 34,
          bonus: 8
        })
    ).toEqual(
        new WinningNumbers(new Round(35), new Game([1, 3, 7, 21, 25, 34]), 8)
    )
  })
})

describe("Winning Numbers -> Entity", () => {
  it("35, [1, 3, 7, 21, 25, 34] + 8", () => {
    expect(
        WinningNumbersEntityAdapter.WinningNumbersToEntity(new WinningNumbers(new Round(35), new Game([1, 3, 7, 21, 25, 34]), 8))
    ).toEqual({
      round: 35,
      first: 1,
      second: 3,
      third: 7,
      fourth: 21,
      fifth: 25,
      sixth: 34,
      bonus: 8
    })
  })
})
