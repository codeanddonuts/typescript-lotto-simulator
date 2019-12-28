import * as fc from "fast-check"
import { Game, PicksCons, PICK_RANGE, PickedNumberCons, NUMBER_OF_PICKS } from "../../../main/lotto/domain/Game"

describe("Picked numbers are in range of 1 ~ 45", () => {
  it("Yes", () =>
    fc.assert(
        fc.property(
            fc.integer(PICK_RANGE.MIN, PICK_RANGE.MAX),
            n => expect(PickedNumberCons(n)).toEqual(n)
        )
    )
  )

  it("No: Underflow", () =>
    fc.assert(
        fc.property(
            fc.integer(Number.MIN_SAFE_INTEGER, PICK_RANGE.MIN - 1),
            n => expect(() => PickedNumberCons(n)).toThrow()
        )
    )
  )

  it("No: Overflow", () =>
    fc.assert(
        fc.property(
            fc.integer(PICK_RANGE.MAX + 1, Number.MAX_SAFE_INTEGER),
            n => expect(() => PickedNumberCons(n)).toThrow()
        )
    )
  )
})

describe("Are six numbers?", () => {
  it("Yes", () =>
    fc.assert(
        fc.property(
            fc.array(fc.integer(PICK_RANGE.MIN, PICK_RANGE.MAX), NUMBER_OF_PICKS, NUMBER_OF_PICKS),
            arr => expect(PicksCons(arr.map(n => PickedNumberCons(n)))).toEqual(arr)
        )
    )
  )

  it("Yes, but numbers are invalid", () =>
    fc.assert(
        fc.property(
            fc.array(fc.integer(), NUMBER_OF_PICKS, NUMBER_OF_PICKS),
            arr => expect(() => PicksCons(arr.map(n => PickedNumberCons(n)))).toThrow()
        )
    )
  )

  it("No: Underflow", () =>
    fc.assert(
      fc.property(
          fc.array(fc.integer(PICK_RANGE.MIN, PICK_RANGE.MAX), NUMBER_OF_PICKS - 1),
          arr => expect(() => PicksCons(arr.map(n => PickedNumberCons(n)))).toThrow()
      )
    )
  )

  it("No: Underflow", () =>
    fc.assert(
      fc.property(
          fc.array(fc.integer(PICK_RANGE.MIN, PICK_RANGE.MAX), NUMBER_OF_PICKS + 1, 255),
          arr => expect(() => PicksCons(arr.map(n => PickedNumberCons(n)))).toThrow()
      )
    )
  )
})

describe("Are numbers all different?", () => {
  it("Yes", () =>
    fc.assert(
        fc.property(
            fc.set(fc.integer(PICK_RANGE.MIN, PICK_RANGE.MAX), NUMBER_OF_PICKS, NUMBER_OF_PICKS),
            set => expect(() => new Game(PicksCons(set.map(n => PickedNumberCons(n))))).not.toThrow()
        )
    )
  )

  it("No", () =>
    fc.assert(
        fc.property(
            fc.array(fc.integer(), NUMBER_OF_PICKS, NUMBER_OF_PICKS),
            arr => expect(() => new Game(PicksCons(arr.map(n => PickedNumberCons(n))))).toThrow()
        )
    )
  )
})