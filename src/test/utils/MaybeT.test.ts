import { PromiseMaybeT } from "../../main/utils/MaybeT"
import { Maybe, Just, Nothing } from "../../main/utils/Maybe"

describe("MaybeT of ...", () => {
  it("11 = MaybeT Promise Just 11", () =>
    expect(
        PromiseMaybeT.lift(11)
    ).toEqual(
        PromiseMaybeT.cons(Promise.resolve(Just(11)))
    )
  )

  it("[11].pop() = MaybeT Promise Just 11", () =>
    expect(
        PromiseMaybeT.lift([11].pop())
    ).toEqual(
        PromiseMaybeT.cons(Promise.resolve(Just(11)))
    )
  )

  it("[].pop() = MaybeT Promise Nothing", () =>
    expect(
        PromiseMaybeT.lift([].pop())
    ).toEqual(
        PromiseMaybeT.cons(Promise.resolve(Nothing()))
    )
  )

  it("Just 11 = MaybeT Promise Just 11", () =>
    expect(
        PromiseMaybeT.liftMaybe(Just(11))
    ).toEqual(
        PromiseMaybeT.cons(Promise.resolve(Just(11)))
    )
  )

  it("Nothing = MaybeT Promise Nothing", () =>
    expect(
        PromiseMaybeT.liftMaybe(Nothing())
    ).toEqual(
        PromiseMaybeT.cons(Promise.resolve(Nothing()))
    )
  )

  it("Promise 11 = MaybeT Promise Just 11", () =>
    expect(
        PromiseMaybeT.liftPromise(Promise.resolve(11))
    ).toEqual(
        PromiseMaybeT.cons(Promise.resolve(Just(11)))
    )
  )

  it("Promise [11].pop() = MaybeT Promise Just 11", () =>
    expect(
        PromiseMaybeT.liftPromise(Promise.resolve([11].pop()))
    ).toEqual(
        PromiseMaybeT.cons(Promise.resolve(Just(11)))
    )
  )

  it("Promise [].pop() = MaybeT Promise Nothing", () =>
    expect(
        PromiseMaybeT.liftPromise(Promise.resolve([].pop()))
    ).toEqual(
        PromiseMaybeT.cons(Promise.resolve(Nothing()))
    )
  )

  it("Promise void = MaybeT Promise Nothing", () =>
    expect(
        PromiseMaybeT.liftPromise(Promise.resolve())
    ).toEqual(
        PromiseMaybeT.cons(Promise.resolve(Nothing()))
    )
  )
})

describe("Running MaybeT of ...", () => {
  it("Promise Just 11 = Promise Just 11", () =>
    expect(
        PromiseMaybeT.cons(Promise.resolve(Just(11))).run()
    ).toEqual(
        Promise.resolve(Just(11))
    )
  )

  it("Promise Nothing = Promise Nothing", () =>
    expect(
        PromiseMaybeT.cons(Promise.resolve(Nothing())).run()
    ).toEqual(
        Promise.resolve(Nothing())
    )
  )
})

describe("map x -> x * 2 to MaybeT of ...", () => {
  it("Just 11 = MaybeT Promise Just 22", () =>
    expect(
        PromiseMaybeT.cons(Promise.resolve(Just(11))).map(x => x * 2)
    ).toEqual(
        PromiseMaybeT.cons(Promise.resolve(Just(22)))
    )
  )

  it("Nothing = MaybeT Promise Nothing", () =>
    expect(
        PromiseMaybeT.cons(Promise.resolve(Nothing<number>())).map(x => x * 2)
    ).toEqual(
        PromiseMaybeT.cons(Promise.resolve(Nothing()))
    )
  )
})

describe("bind x -> Maybe x * 2 to MaybeT of ...", () => {
  it("Just 11 = MaybeT Promise Just 22", () =>
    expect(
        PromiseMaybeT.cons(Promise.resolve(Just(11))).bind(x => PromiseMaybeT.cons(Promise.resolve(Maybe(x * 2))))
    ).toEqual(
        PromiseMaybeT.cons(Promise.resolve(Just(22)))
    )
  )

  it("Nothing = MaybeT Promise Nothing", () =>
    expect(
        PromiseMaybeT.cons(Promise.resolve(Nothing<number>())).bind(x => PromiseMaybeT.cons(Promise.resolve(Maybe(x * 2))))
    ).toEqual(
        PromiseMaybeT.cons(Promise.resolve(Nothing()))
    )
  )
})

describe("filter x -> x > 2 to MaybeT of ...", () => {
  it("Just 11 = MaybeT Promise Just 22", () =>
    expect(
        PromiseMaybeT.cons(Promise.resolve(Just(11))).filter(x => x > 2)
    ).toEqual(
        PromiseMaybeT.cons(Promise.resolve(Just(22)))
    )
  )

  it("Just 1 = MaybeT Promise Nothing", () =>
    expect(
        PromiseMaybeT.cons(Promise.resolve(Just(11))).filter(x => x > 2)
    ).toEqual(
        PromiseMaybeT.cons(Promise.resolve(Nothing()))
    )
  )

  it("Nothing = MaybeT Promise Nothing", () =>
    expect(
        PromiseMaybeT.cons(Promise.resolve(Nothing<number>())).filter(x => x > 2)
    ).toEqual(
        PromiseMaybeT.cons(Promise.resolve(Nothing()))
    )
  )
})

describe(" ... or MaybeT(Promise(Just 7))", () => {
  it("MaybeT(Promise(Just 11)) = MaybeT(Promise(Just 11))", () =>
    expect(
        PromiseMaybeT.cons(Promise.resolve(Just(11)))
                                  .orElse(() => PromiseMaybeT.cons(Promise.resolve(Just(7))))
    ).toEqual(
        PromiseMaybeT.cons(Promise.resolve(Just(11)))
    )
  )

  it("MaybeT(Promise(Nothing)) = MaybeT(Promise(Just 7))", () =>
    expect(
        PromiseMaybeT.cons(Promise.resolve(Nothing()))
                                  .orElse(() => PromiseMaybeT.cons(Promise.resolve(Just(7))))
    ).toEqual(
        PromiseMaybeT.cons(Promise.resolve(Just(7)))
    )
  )
})

describe("get ... or Promise(7)", () => {
  it("MaybeT(Promise(Just 11)) = Promise(11)", () =>
    expect(
        PromiseMaybeT.cons(Promise.resolve(Just(11))).getOrElse(() => Promise.resolve(7))
    ).toEqual(
        Promise.resolve(11)
    )
  )

  it("MaybeT(Promise(Nothing)) = Promise(7)", () =>
    expect(
        PromiseMaybeT.cons(Promise.resolve(Nothing())).getOrElse(() => Promise.resolve(7))
    ).toEqual(
        Promise.resolve(7)
    )
  )
})

describe("get ... or error", () => {
  it("MaybeT(Promise(Just 11)) = Promise(11)", () =>
    expect(
        PromiseMaybeT.cons(Promise.resolve(Just(11))).getOrThrow()
    ).toEqual(
        Promise.resolve(11)
    )
  )

  it("MaybeT(Promise(Nothing)) = error", async () => {
    expect(PromiseMaybeT.cons(Promise.resolve(Nothing())).getOrThrow()).rejects.toThrow()
  })
})
