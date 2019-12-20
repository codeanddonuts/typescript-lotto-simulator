export abstract class Maybe<a> {
  public static cons<a>(val: a | null | undefined): Maybe<a> {
    return (val === null || val === undefined) ? new Nothing() : new Just<a>(val)
  }

  abstract map<b>(f: (x: a) => b | null | undefined): Maybe<b>
  abstract bind<b>(f: (x: a) => Maybe<b>): Maybe<b>
  abstract filter(f: (x: a) => boolean): Maybe<a>
  abstract orElse(defaultValue: a): a
  abstract orElseLazy(lazyDefaultValue: () => a): a
  abstract orElseThrow(e?: Error): a | never
  
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

  public orElse(defaultValue: a): a {
    return this.val;
  }

  public orElseLazy(lazyDefaultValue: () => a): a {
    return this.val
  }

  public orElseThrow(e?: Error): a | never {
    return this.val
  }
}

export class Nothing<a> extends Maybe<a> {
  public map<b>(f: (x: a) => b | null | undefined): Maybe<b> {
    return new Nothing()
  }

  public bind<b>(f: (x: a) => Maybe<b>): Maybe<b> {
    return new Nothing()
  }

  public filter(f: (x: a) => boolean): Maybe<a> {
    return this
  }

  public orElse(defaultValue: a): a {
    return defaultValue
  }

  public orElseLazy(lazyDefaultValue: () => a): a {
    return lazyDefaultValue()
  }

  public orElseThrow(e?: Error): a | never {
    throw e ?? new Error()
  }
}
