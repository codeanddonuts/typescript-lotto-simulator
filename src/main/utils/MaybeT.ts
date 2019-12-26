import { Maybe, Nothing } from "./Maybe"

export class PromiseMaybeTransformer<a> {
  public static cons<a>(val: Promise<Maybe<a>>): PromiseMaybeTransformer<a> {
    return new PromiseMaybeTransformer(val)
  }

  public static fromNullable<a>(val: Promise<a | null | undefined>): PromiseMaybeTransformer<a> {
    return new PromiseMaybeTransformer(val.then(x => Maybe.cons(x)))
  }

  private constructor(private readonly val: Promise<Maybe<a>>) {}

  public runMaybeT(): Promise<Maybe<a>> {
    return this.val
  }

  public map<b>(f: (x: a) => b | null | undefined): PromiseMaybeTransformer<b> {
    return new PromiseMaybeTransformer(this.val.then(maybe => maybe.map(f)))
  }

  public bind<b>(f: (x: a) => PromiseMaybeTransformer<b>): PromiseMaybeTransformer<b> {
    return new PromiseMaybeTransformer(
        this.val.then(maybe =>
          maybe.map(x => f(x).runMaybeT())
               .getOrElse(() => Promise.resolve(new Nothing()))
        )
    )
  }

  public filter(f: (x: a) => boolean): PromiseMaybeTransformer<a> {
    this.val.then(maybe => maybe.filter(f))
    return this
  }

  public async getOrElse(defaultValue: () => Promise<a>): Promise<a> {
    return ((await this.val) as any).val ?? defaultValue()
  }

  public async getOrThrow(e?: Error): Promise<a> | never {
      return (await this.val).getOrThrow()
  }
}
