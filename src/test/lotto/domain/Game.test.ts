import fc from "fast-check"
import { Game, PickGroup } from "../../../main/lotto/domain/Game"
import { PICK_RANGE, PickedNumber } from "../../../main/lotto/domain/PickedNumber"

describe("Picked numbers are in range of 1 ~ 45", () => {
  it("Yes", () =>
    fc.assert(
        fc.property(
            fc.integer(PICK_RANGE.MIN, PICK_RANGE.MAX),
            n => expect(PickedNumber(n)).toEqual(n)
        )
    )
  )

  it("No: Underflow", () =>
    fc.assert(
        fc.property(
            fc.integer(Number.MIN_SAFE_INTEGER, PICK_RANGE.MIN - 1),
            n => expect(() => PickedNumber(n)).toThrow()
        )
    )
  )

  it("No: Overflow", () =>
    fc.assert(
        fc.property(
            fc.integer(PICK_RANGE.MAX + 1, Number.MAX_SAFE_INTEGER),
            n => expect(() => PickedNumber(n)).toThrow()
        )
    )
  )
})

describe("Are six numbers?", () => {
  it("Yes", () =>
    fc.assert(
        fc.property(
            fc.array(fc.integer(PICK_RANGE.MIN, PICK_RANGE.MAX), Game.NUMBER_OF_PICKS, Game.NUMBER_OF_PICKS),
            arr => expect(PickGroup(arr.map(n => PickedNumber(n)))).toEqual(arr)
        )
    )
  )

  it("Yes, but numbers are invalid", () =>
    fc.assert(
        fc.property(
            fc.array(fc.integer(), Game.NUMBER_OF_PICKS, Game.NUMBER_OF_PICKS),
            arr => expect(() => PickGroup(arr.map(n => PickedNumber(n)))).toThrow()
        )
    )
  )

  it("No: Underflow", () =>
    fc.assert(
      fc.property(
          fc.array(fc.integer(PICK_RANGE.MIN, PICK_RANGE.MAX), Game.NUMBER_OF_PICKS - 1),
          arr => expect(() => PickGroup(arr.map(n => PickedNumber(n)))).toThrow()
      )
    )
  )

  it("No: Overflow", () =>
    fc.assert(
      fc.property(
          fc.array(fc.integer(PICK_RANGE.MIN, PICK_RANGE.MAX), Game.NUMBER_OF_PICKS + 1, 255),
          arr => expect(() => PickGroup(arr.map(n => PickedNumber(n)))).toThrow()
      )
    )
  )
})

describe("Are numbers all different?", () => {
  it("Yes", () =>
    fc.assert(
        fc.property(
            fc.set(fc.integer(PICK_RANGE.MIN, PICK_RANGE.MAX), Game.NUMBER_OF_PICKS, Game.NUMBER_OF_PICKS),
            set => expect(() => new Game(PickGroup(set.map(n => PickedNumber(n))))).not.toThrow()
        )
    )
  )

  it("No", () =>
    fc.assert(
        fc.property(
            fc.array(fc.integer(), Game.NUMBER_OF_PICKS, Game.NUMBER_OF_PICKS),
            arr => expect(() => new Game(PickGroup(arr.map(n => PickedNumber(n))))).toThrow()
        )
    )
  )
})

describe("Is auto generation valid?", () => {
  it("Yes", () => {
    const picks = (Game.autoGen() as any).picks as ReadonlySet<number>
    expect(() => Array.from(picks.values()).every(n => PickedNumber(n))).not.toThrow()
    expect(picks.size).toEqual(Game.NUMBER_OF_PICKS)
  })
})
