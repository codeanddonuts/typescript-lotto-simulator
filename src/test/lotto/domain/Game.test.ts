import { Game, SixPicksCons } from "../../../main/lotto/domain/Game"

describe("Are six numbers?", () => {
  it("Yes", () =>
    expect(SixPicksCons([1, 2, 3, 4, 5, 6])).toEqual([1, 2, 3, 4, 5, 6])
  )

  it("No: Underflow", () =>
    expect(() => SixPicksCons([1, 2, 3, 4, 5])).toThrow()
  )

  it("No: Overflow", () =>
    expect(() => SixPicksCons([1, 2, 3, 4, 5, 6, 7])).toThrow()
  )
})

describe("Numbers of matches are?", () => {
  it("0", () =>
    expect(new Game([1, 2, 3, 4, 5, 6]).numberOfMatchesTo(new Game([7, 8, 9, 10, 11, 12]))).toBe(0)
  )

  it("6", () =>
    expect(new Game([1, 2, 3, 4, 5, 6]).numberOfMatchesTo(new Game([1, 2, 3, 4, 5, 6]))).toBe(6)
  )
})

describe("Contains?", () => {
  it("3: Yes", () =>
    expect(new Game([1, 2, 3, 4, 5, 6]).contains(3)).toBeTruthy()
  )
  
  it("7: Yes", () =>
    expect(new Game([1, 2, 3, 4, 5, 6]).contains(7)).toBeFalsy()
  )
})