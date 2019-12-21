import { Round } from "../../../main/lotto/domain/Round"
import { Game } from "../../../main/lotto/domain/Game"
import { WinningNumbers } from "../../../main/lotto/domain/WinningNumbers"

describe("Same winning numbers?", () => {
  const winningNumbers = new WinningNumbers(new Round(123), new Game([1, 2, 3, 4, 5, 6]), 7)
  
  it("Yes: Same instance", () =>
    expect(winningNumbers.equals(winningNumbers)).toBeTruthy()
  )
  
  it("No: Different type", () =>
    expect(winningNumbers.equals(new Round(123))).toBeFalsy()
  )

  it("Yes: Same values", () =>
    expect(winningNumbers.equals(new WinningNumbers(new Round(123), new Game([1, 2, 3, 4, 5, 6]), 7))).toBeTruthy()
  )

  it("No: Different values", () =>
    expect(winningNumbers.equals(new WinningNumbers(new Round(1234), new Game([1, 2, 3, 4, 5, 6]), 8))).toBeFalsy()
  )
})