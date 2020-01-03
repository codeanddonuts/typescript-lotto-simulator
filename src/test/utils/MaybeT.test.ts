import { Maybe, Just, Nothing } from "../../main/utils/Maybe"
import { PromiseMaybeT } from "../../main/utils/MaybeT"

describe("MaybeT of ...", () => {
  it("11 = MaybeT(Promise(Just 11))", () =>
    expect(
        PromiseMaybeT.lift(11)
    ).toEqual(
        PromiseMaybeT.cons(Promise.resolve(new Just(11)))
    )
  )

  it("null = MaybeT(Promise(Nothing))", () =>
    expect(
      PromiseMaybeT.lift(null)
    ).toEqual(
      PromiseMaybeT.cons(Promise.resolve(new Nothing()))
    )
  )

  it("undefined = MaybeT(Promise(Nothing))", () =>
    expect(
      PromiseMaybeT.lift(undefined)
    ).toEqual(
      PromiseMaybeT.cons(Promise.resolve(new Nothing()))
    )
  )

  it("Just 11 = MaybeT(Promise(Just 11))", () =>
    expect(
        PromiseMaybeT.liftMaybe(new Just(11))
    ).toEqual(
        PromiseMaybeT.cons(Promise.resolve(new Just(11)))
    )
  )

  it("Nothing = MaybeT(Promise(Nothing))", () =>
    expect(
      PromiseMaybeT.liftMaybe(new Nothing())
    ).toEqual(
      PromiseMaybeT.cons(Promise.resolve(new Nothing()))
    )
  )

  it("Promise(11) = MaybeT(Promise(Just 11))", () =>
    expect(
        PromiseMaybeT.liftPromise(Promise.resolve(11))
    ).toEqual(
        PromiseMaybeT.cons(Promise.resolve(new Just(11)))
    )
  )

  it("Promise(null) = MaybeT(Promise(Nothing))", () =>
    expect(
      PromiseMaybeT.liftPromise(Promise.resolve(null))
    ).toEqual(
      PromiseMaybeT.cons(Promise.resolve(new Nothing()))
    )
  )

  it("Promise(undefined) = MaybeT(Promise(Nothing))", () =>
    expect(
      PromiseMaybeT.liftPromise(Promise.resolve(undefined))
    ).toEqual(
      PromiseMaybeT.cons(Promise.resolve(new Nothing()))
    )
  )
})

describe("Running MaybeT of ...", () => {
  it("MaybeT(Promise(Just 11)) = Promise(Just 11)", () =>
    expect(
        PromiseMaybeT.cons(Promise.resolve(new Just(11))).run()
    ).toEqual(
        Promise.resolve(new Just(11))
    )
  )

  it("MaybeT(Promise(Nothing)) = Promise(Nothing)", () =>
    expect(
        PromiseMaybeT.cons(Promise.resolve(new Nothing())).run()
    ).toEqual(
        Promise.resolve(new Nothing())
    )
  )
})

describe("map x -> x * 2 ...", () => {
  it("MaybeT(Promise(Just 11)) = MaybeT(Promise(Just 22))", () =>
    expect(
        PromiseMaybeT.cons(Promise.resolve(new Just(11))).map(x => x * 2)
    ).toEqual(
        PromiseMaybeT.cons(Promise.resolve(new Just(22)))
    )
  )

  it("MaybeT(Promise(Nothing)) = MaybeT(Promise(Nothing))", () =>
    expect(
        PromiseMaybeT.cons(Promise.resolve(new Nothing<number>())).map(x => x * 2)
    ).toEqual(
        PromiseMaybeT.cons(Promise.resolve(new Nothing()))
    )
  )
})

describe("bind x -> MaybeT (x * 2) ...", () => {
  it("MaybeT(Promise(Just 11)) = MaybeT(Promise(Just 22))", () =>
    expect(
        PromiseMaybeT.cons(Promise.resolve(new Just(11)))
                               .bind(x => PromiseMaybeT.cons(Promise.resolve(Maybe.cons(x * 2))))
    ).toEqual(
        PromiseMaybeT.cons(Promise.resolve(new Just(22)))
    )
  )

  it("MaybeT(Promise(Nothing)) = MaybeT(Promise(Nothing))", () =>
    expect(
      PromiseMaybeT.cons(Promise.resolve(new Nothing<number>()))
                             .bind(x => PromiseMaybeT.cons(Promise.resolve(Maybe.cons(x * 2))))
    ).toEqual(
        PromiseMaybeT.cons(Promise.resolve(new Nothing()))
    )
  )
})

describe("filter x -> x > 2 ...", () => {
  it("MaybeT(Promise(Just 11)) = MaybeT(Promise(Just 11))", () =>
    expect(
        PromiseMaybeT.cons(Promise.resolve(new Just(11))).filter(x => x > 2)
    ).toEqual(
        PromiseMaybeT.cons(Promise.resolve(new Just(22)))
    )
  )

  it("MaybeT(Promise(Just 1)) = MaybeT(Promise(Nothing))", () =>
    expect(
        PromiseMaybeT.cons(Promise.resolve(new Just(1))).filter(x => x > 2)
    ).toEqual(
        PromiseMaybeT.cons(Promise.resolve(new Nothing()))
    )
  )

  it("MaybeT(Promise(Nothing)) = MaybeT(Promise(Nothing))", () =>
    expect(
        PromiseMaybeT.cons(Promise.resolve(new Nothing<number>())).filter(x => x > 2)
    ).toEqual(
        PromiseMaybeT.cons(Promise.resolve(new Nothing()))
    )
  )
})

describe(" ... or MaybeT(Promise(Just 7))", () => {
  it("MaybeT(Promise(Just 11)) = MaybeT(Promise(Just 11))", () =>
    expect(
        PromiseMaybeT.cons(Promise.resolve(new Just(11)))
                               .orElse(() => PromiseMaybeT.cons(Promise.resolve(new Just(7))))
    ).toEqual(
        PromiseMaybeT.cons(Promise.resolve(new Just(11)))
    )
  )

  it("MaybeT(Promise(Nothing)) = MaybeT(Promise(Just 7))", () =>
    expect(
        PromiseMaybeT.cons(Promise.resolve(new Nothing()))
                               .orElse(() => PromiseMaybeT.cons(Promise.resolve(new Just(7))))
    ).toEqual(
        PromiseMaybeT.cons(Promise.resolve(new Just(7)))
    )
  )
})

describe("get ... or Promise(7)", () => {
  it("MaybeT(Promise(Just 11)) = Promise(11)", () =>
    expect(
        PromiseMaybeT.cons(Promise.resolve(new Just(11))).getOrElse(() => Promise.resolve(7))
    ).toEqual(
        Promise.resolve(11)
    )
  )

  it("MaybeT(Promise(Nothing)) = Promise(7)", () =>
    expect(
        PromiseMaybeT.cons(Promise.resolve(new Nothing())).getOrElse(() => Promise.resolve(7))
    ).toEqual(
        Promise.resolve(7)
    )
  )
})

describe("get ... or error", () => {
  it("MaybeT(Promise(Just 11)) = Promise(11)", () =>
    expect(
        PromiseMaybeT.cons(Promise.resolve(new Just(11))).getOrThrow()
    ).toEqual(
        Promise.resolve(11)
    )
  )

  it("MaybeT(Promise(Nothing)) = error", async () => {
    expect(PromiseMaybeT.cons(Promise.resolve(new Nothing())).getOrThrow()).rejects.toThrow()
  })
})
