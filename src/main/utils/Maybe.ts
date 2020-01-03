export abstract class Maybe<a> {
  public static cons<a>(val: a | null | undefined): Maybe<a> {
    return (val === null || val === undefined) ? new Nothing() : new Just(val)
  }

  public static join<a>(val: Maybe<Maybe<a>>): Maybe<a> {
    return val.bind(x => x)
  }

  protected constructor() {}

  abstract map<b>(f: (x: a) => b | null | undefined): Maybe<b>
  abstract bind<b>(f: (x: a) => Maybe<b>): Maybe<b>
  abstract filter(f: (x: a) => boolean): Maybe<a>
  abstract orElse(m: () => Maybe<a>): Maybe<a>
  abstract getOrElse(defaultValue: () => a): a
  abstract getOrThrow(e?: Error): a | never
}

export class Just<a> extends Maybe<a> {
  constructor(private readonly val: a) {
    super()
  }

  public map<b>(f: (x: a) => b | null | undefined): Maybe<b> {
    return Maybe.cons(f(this.val))
  }

  public bind<b>(f: (x: a) => Maybe<b>): Maybe<b> {
    return f(this.val)
  }

  public filter(f: (x: a) => boolean): Maybe<a> {
    return f(this.val) ? this : new Nothing()
  }

  public orElse(m: () => Maybe<a>): Maybe<a> {
    return this
  }

  public getOrElse(defaultValue: () => a): a {
    return this.val
  }

  public getOrThrow(e?: Error): a | never {
    return this.val
  }
}

export class Nothing<a> extends Maybe<a> {
  constructor() {
    super()
  }

  public map<b>(f: (x: a) => b | null | undefined): Maybe<b> {
    return new Nothing()
  }

  public bind<b>(f: (x: a) => Maybe<b>): Maybe<b> {
    return new Nothing()
  }

  public filter(f: (x: a) => boolean): Maybe<a> {
    return this
  }

  public orElse(m: () => Maybe<a>): Maybe<a> {
    return m()
  }

  public getOrElse(defaultValue: () => a): a {
    return defaultValue()
  }

  public getOrThrow(e?: Error): a | never {
    throw e ?? new Error()
  }
}
