
import { Maybe, Just, Nothing } from "../../main/utils/Maybe"

describe("Maybe of ...", () => {
  it("11 = Just 11", () =>
    expect(Maybe.cons(11)).toEqual(new Just(11))
  )

  it("null = Nothing", () =>
    expect(Maybe.cons(null)).toEqual(new Nothing())
  )

  it("undefined = Nothing", () =>
    expect(Maybe.cons(undefined)).toEqual(new Nothing())
  )
})

describe("map x -> x * 2 ...", () => {
  it("Just 11 = Just 22", () =>
    expect((new Just(11)).map(x => x * 2)).toEqual(new Just(22))
  )

  it("Nothing = Nothing", () =>
    expect((new Nothing<number>()).map(x => x * 2)).toEqual(new Nothing())
  )
})

describe("bind x -> Maybe (x * 2) ...", () => {
  it("Just 11 = Just 22", () =>
    expect((new Just(11)).bind(x => Maybe.cons(x * 2))).toEqual(new Just(22))
  )

  it("Nothing = Nothing", () =>
    expect((new Nothing<number>()).bind(x => Maybe.cons(x * 2))).toEqual(new Nothing())
  )
})

describe("filter x -> x > 2 ...", () => {
  it("Just 11 = Just 11", () =>
    expect((new Just(11)).filter(x => x > 2)).toEqual(new Just(11))
  )

  it("Just 1 = Nothing", () =>
    expect((new Just(1)).filter(x => x > 2)).toEqual(new Nothing())
  )

  it("Nothing = Nothing", () =>
    expect((new Nothing<number>()).map(x => x * 2)).toEqual(new Nothing())
  )
})

describe("a or b", () => {
  it("Just 11, Just 41 = Just 11", () =>
    expect((new Just(11)).or(new Just(41))).toEqual(new Just(11))
  )

  it("Nothing, Just 41 = Just 41", () =>
  expect((new Nothing()).or(new Just(41))).toEqual(new Just(41))
  )
})

describe("get ... or 7", () => {
  it("Just 11 = 11", () =>
    expect((new Just(11)).getOrDefault(7)).toEqual(11)
  )

  it("Just 11 = 11", () =>
    expect((new Just(11)).getOrDefaultLazy(() => 7)).toEqual(11)
  )

  it("Nothing = 7", () =>
    expect((new Nothing()).getOrDefault(7)).toEqual(7)
  )

  it("Nothing = 7", () =>
    expect((new Nothing()).getOrDefaultLazy(() => 7)).toEqual(7)
  )
})

describe("get ... or error", () => {
  it("Just 11 = 11", () =>
    expect((new Just(11)).getOrThrow()).toEqual(11)
  )

  it("Nothing = error", () =>
    expect(() => (new Nothing()).getOrThrow()).toThrow()
  )
})