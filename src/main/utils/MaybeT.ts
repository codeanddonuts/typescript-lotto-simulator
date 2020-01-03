import { Maybe, Nothing } from "./Maybe"

export class PromiseMaybeT<a> {
  public static cons<a>(val: Promise<Maybe<a>>): PromiseMaybeT<a> {
    return new PromiseMaybeT(val)
  }

  public static lift<a>(val: a | null | undefined): PromiseMaybeT<a> {
    return new PromiseMaybeT(Promise.resolve(Maybe.cons(val)))
  }

  public static liftMaybe<a>(val: Maybe<a>): PromiseMaybeT<a> {
    return new PromiseMaybeT(Promise.resolve(val))
  }

  public static liftPromise<a>(val: Promise<a | null | undefined>): PromiseMaybeT<a> {
    return new PromiseMaybeT(val.then(x => Maybe.cons(x)))
  }

  private constructor(private readonly val: Promise<Maybe<a>>) {}

  public run(): Promise<Maybe<a>> {
    return this.val
  }

  public map<b>(f: (x: a) => b | null | undefined): PromiseMaybeT<b> {
    return new PromiseMaybeT(this.val.then(maybe => maybe.map(f)))
  }

  public bind<b>(f: (x: a) => PromiseMaybeT<b>): PromiseMaybeT<b> {
    return new PromiseMaybeT(
        this.val.then(maybe =>
          maybe.map(x => f(x).val)
               .getOrElse(() => Promise.resolve(new Nothing()))
        )
    )
  }

  public filter(f: (x: a) => boolean): PromiseMaybeT<a> {
    return new PromiseMaybeT(this.val.then(maybe => maybe.filter(f)))
  }

  public orElse(m: () => PromiseMaybeT<a>): PromiseMaybeT<a> {
    return new PromiseMaybeT(this.val.then(a => m().val.then(b => a.orElse(() => b))))
  }

  public async getOrElse(defaultValue: () => Promise<a>): Promise<a> {
    return ((await this.val) as any).val ?? defaultValue()
  }

  public async getOrThrow(e?: Error): Promise<a> | never {
      return (await this.val).getOrThrow(e)
  }
}
