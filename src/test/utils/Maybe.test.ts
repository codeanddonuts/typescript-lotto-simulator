import { Maybe, Just, Nothing } from "../../main/utils/Maybe"

describe("Maybe of ...", () => {
  it("11 = Just 11", () =>
    expect(Maybe(11)).toEqual(Just(11))
  )

  it("[11].pop() = Just 11", () =>
    expect(Maybe([11].pop())).toEqual(Just(11))
  )

  it("null = Nothing", () =>
    expect(Maybe(null)).toEqual(Nothing())
  )

  it("undefined = Nothing", () =>
    expect(Maybe(undefined)).toEqual(Nothing())
  )

  it("[].pop() = Nothing", () =>
    expect(Maybe([].pop())).toEqual(Nothing())
  )
})

describe("map x -> x * 2 ...", () => {
  it("Just 11 = Just 22", () =>
    expect(Just(11).map(x => x * 2)).toEqual(Just(22))
  )

  it("Maybe 11 = Just 22", () =>
    expect(Maybe(11).map(x => x * 2)).toEqual(Just(22))
  )

  it("Maybe [11].pop() = Just 22", () =>
    expect(Maybe([11].pop()).map(x => x * 2)).toEqual(Just(22))
  )

  it("Nothing = Nothing", () =>
    expect(Nothing<number>().map(x => x * 2)).toEqual(Nothing())
  )

  it("Maybe [].pop() = Nothing", () =>
    expect(Maybe<number>([].pop()).map(x => x * 2)).toEqual(Nothing())
  )
})

describe("bind x -> Maybe (x * 2) ...", () => {
  it("Just 11 = Just 22", () =>
    expect(Just(11).bind(x => Maybe(x * 2))).toEqual(Just(22))
  )

  it("Maybe 11 = Just 22", () =>
    expect(Maybe(11).bind(x => Maybe(x * 2))).toEqual(Just(22))
  )

  it("Maybe [11].pop() = Just 22", () =>
    expect(Maybe([11].pop()).bind(x => Maybe(x * 2))).toEqual(Just(22))
  )

  it("Nothing = Nothing", () =>
    expect(Nothing<number>().bind(x => Maybe(x * 2))).toEqual(Nothing())
  )

  it("Maybe [].pop() = Nothing", () =>
    expect(Maybe<number>([].pop()).bind(x => Maybe(x * 2))).toEqual(Nothing())
  )
})

describe("filter x -> x > 2 ...", () => {
  it("Just 11 = Just 11", () =>
    expect(Just(11).filter(x => x > 2)).toEqual(Just(11))
  )

  it("Maybe 11 = Just 11", () =>
    expect(Maybe(11).filter(x => x > 2)).toEqual(Just(11))
  )

  it("Maybe [11].pop() = Just 11", () =>
    expect(Maybe([11].pop()).filter(x => x > 2)).toEqual(Just(11))
  )

  it("Just 1 = Nothing", () =>
    expect(Just(1).filter(x => x > 2)).toEqual(Nothing())
  )

  it("Maybe 1 = Nothing", () =>
    expect(Maybe(1).filter(x => x > 2)).toEqual(Nothing())
  )

  it("Maybe [1].pop() = Nothing", () =>
    expect(Maybe([1].pop()).filter(x => x > 2)).toEqual(Nothing())
  )

  it("Nothing = Nothing", () =>
    expect((Nothing<number>()).filter(x => x > 2)).toEqual(Nothing())
  )

  it("Maybe [].pop() = Nothing", () =>
    expect(Maybe<number>([].pop()).filter(x => x > 2)).toEqual(Nothing())
  )
})

describe("... or Just 7", () => {
  it("Just 11 = Just 11", () =>
    expect(Just(11).orElse(() => Just(7))).toEqual(Just(11))
  )

  it("Maybe 11 = Just 11", () =>
    expect(Maybe(11).orElse(() => Just(7))).toEqual(Just(11))
  )

  it("Maybe [11].pop() = Just 11", () =>
    expect(Maybe([11].pop()).orElse(() => Just(7))).toEqual(Just(11))
  )

  it("Nothing = Just 7", () =>
    expect(Nothing().orElse(() => Just(7))).toEqual(Just(7))
  )

  it("Maybe [].pop() = Just 7", () =>
    expect(Maybe<number>([].pop()).orElse(() => Just(7))).toEqual(Just(7))
  )
})

describe("get ... or 7", () => {
  it("Just 11 = 11", () =>
    expect(Just(11).getOrElse(() => 7)).toEqual(11)
  )

  it("Maybe 11 = 11", () =>
    expect(Maybe(11).getOrElse(() => 7)).toEqual(11)
  )

  it("Maybe [11].pop() = 11", () =>
    expect(Maybe([11].pop()).getOrElse(() => 7)).toEqual(11)
  )

  it("Nothing = 7", () =>
    expect(Nothing().getOrElse(() => 7)).toEqual(7)
  )

  it("Maybe [].pop() = 7", () =>
    expect(Maybe<number>([].pop()).getOrElse(() => 7)).toEqual(7)
  )
})

describe("get ... or error", () => {
  it("Just 11 = 11", () =>
    expect(Just(11).getOrThrow()).toEqual(11)
  )

  it("Maybe 11 = 11", () =>
    expect(Maybe(11).getOrThrow()).toEqual(11)
  )

  it("Maybe [11].pop() = 11", () =>
    expect(Maybe([11].pop()).getOrThrow()).toEqual(11)
  )

  it("Nothing = error", () =>
    expect(() => Nothing().getOrThrow()).toThrow()
  )

  it("Maybe [].pop() = error", () =>
    expect(() => Maybe([].pop()).getOrThrow()).toThrow()
  )
})
