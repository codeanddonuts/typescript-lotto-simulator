
import { Maybe, Just, Nothing } from "../../main/utils/Maybe"
import { PromiseMaybeTransformer } from "../../main/utils/MaybeT"

describe("MaybeT of ...", () => {
  it("Promise(11) = MaybeT(Promise(Just 11))", () =>
    expect(
        PromiseMaybeTransformer.fromNullable(Promise.resolve(11))
    ).toEqual(
        PromiseMaybeTransformer.cons(Promise.resolve(new Just(11)))
    )
  )

  it("Promise(null) = MaybeT(Promise(Nothing))", () =>
    expect(
      PromiseMaybeTransformer.fromNullable(Promise.resolve(null))
    ).toEqual(
      PromiseMaybeTransformer.cons(Promise.resolve(new Nothing()))
    )
  )

  it("Promise(undefined) = MaybeT(Promise(Nothing))", () =>
    expect(
      PromiseMaybeTransformer.fromNullable(Promise.resolve(undefined))
    ).toEqual(
      PromiseMaybeTransformer.cons(Promise.resolve(new Nothing()))
    )
  )
})

describe("Running MaybeT of ...", () => {
  it("MaybeT(Promise(Just 11)) = Promise(Just 11)", () =>
    expect(
        PromiseMaybeTransformer.cons(Promise.resolve(new Just(11))).runMaybeT()
    ).toEqual(
        Promise.resolve(new Just(11))
    )
  )

  it("MaybeT(Promise(Nothing)) = Promise(Nothing)", () =>
    expect(
        PromiseMaybeTransformer.cons(Promise.resolve(new Nothing())).runMaybeT()
    ).toEqual(
        Promise.resolve(new Nothing())
    )
  )
})

describe("map x -> x * 2 ...", () => {
  it("MaybeT(Promise(Just 11)) = MaybeT(Promise(Just 22))", () =>
    expect(
        PromiseMaybeTransformer.cons(Promise.resolve(new Just(11))).map(x => x * 2)
    ).toEqual(
        PromiseMaybeTransformer.cons(Promise.resolve(new Just(22)))
    )
  )

  it("MaybeT(Promise(Nothing)) = MaybeT(Promise(Nothing))", () =>
    expect(
        PromiseMaybeTransformer.cons(Promise.resolve(new Nothing<number>())).map(x => x * 2)
    ).toEqual(
        PromiseMaybeTransformer.cons(Promise.resolve(new Nothing()))
    )
  )
})

describe("bind x -> MaybeT (x * 2) ...", () => {
  it("MaybeT(Promise(Just 11)) = MaybeT(Promise(Just 22))", () =>
    expect(
        PromiseMaybeTransformer.cons(Promise.resolve(new Just(11)))
                               .bind(x => PromiseMaybeTransformer.cons(Promise.resolve(Maybe.cons(x * 2))))
    ).toEqual(
        PromiseMaybeTransformer.cons(Promise.resolve(new Just(22)))
    )
  )

  it("MaybeT(Promise(Nothing)) = MaybeT(Promise(Nothing))", () =>
    expect(
      PromiseMaybeTransformer.cons(Promise.resolve(new Nothing<number>()))
                             .bind(x => PromiseMaybeTransformer.cons(Promise.resolve(Maybe.cons(x * 2))))
    ).toEqual(
        PromiseMaybeTransformer.cons(Promise.resolve(new Nothing()))
    )
  )
})

describe("filter x -> x > 2 ...", () => {
  it("MaybeT(Promise(Just 11)) = MaybeT(Promise(Just 11))", () =>
    expect(
        PromiseMaybeTransformer.cons(Promise.resolve(new Just(11))).filter(x => x > 2)
    ).toEqual(
        PromiseMaybeTransformer.cons(Promise.resolve(new Just(22)))
    )
  )

  it("MaybeT(Promise(Just 1)) = MaybeT(Promise(Nothing))", () =>
    expect(
        PromiseMaybeTransformer.cons(Promise.resolve(new Just(1))).filter(x => x > 2)
    ).toEqual(
        PromiseMaybeTransformer.cons(Promise.resolve(new Nothing()))
    )
  )

  it("MaybeT(Promise(Nothing)) = MaybeT(Promise(Nothing))", () =>
    expect(
        PromiseMaybeTransformer.cons(Promise.resolve(new Nothing<number>())).filter(x => x > 2)
    ).toEqual(
        PromiseMaybeTransformer.cons(Promise.resolve(new Nothing()))
    )
  )
})

describe("get ... or Promise(7)", () => {
  it("MaybeT(Promise(Just 11)) = Promise(11)", () =>
    expect(
        PromiseMaybeTransformer.cons(Promise.resolve(new Just(11))).getOrElse(() => Promise.resolve(7))
    ).toEqual(
        Promise.resolve(11)
    )
  )

  it("MaybeT(Promise(Nothing)) = Promise(7)", () =>
    expect(
        PromiseMaybeTransformer.cons(Promise.resolve(new Nothing())).getOrElse(() => Promise.resolve(7))
    ).toEqual(
        Promise.resolve(7)
    )
  )
})

describe("get ... or error", () => {
  it("MaybeT(Promise(Just 11)) = Promise(11)", () =>
    expect(
        PromiseMaybeTransformer.cons(Promise.resolve(new Just(11))).getOrThrow()
    ).toEqual(
        Promise.resolve(11)
    )
  )

  it("MaybeT(Promise(Nothing)) = error", async () => {
    expect(PromiseMaybeTransformer.cons(Promise.resolve(new Nothing())).getOrThrow()).resolves.toThrow()
  })
})
