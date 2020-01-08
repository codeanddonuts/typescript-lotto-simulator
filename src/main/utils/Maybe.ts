export type Maybe<a> = Just<a> | Nothing<a>

export const Maybe = <a>(val: a | null | undefined): Just<a> | Nothing<a> => {
  return (val === null || val === undefined) ? Nothing() : Just(val!)
}

class Just_<a> {
  constructor(private readonly val: a) {}

  public map<b>(f: (x: a) => b): Maybe<b> {
    return Maybe(f(this.val))
  }

  public bind<b>(f: (x: a) => Maybe<b>): Maybe<b> {
    return f(this.val)
  }

  public filter(f: (x: a) => boolean): Maybe<a> {
    return f(this.val) ? this : Nothing()
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

export type Just<a> = Just_<a>

export const Just = <a>(val: NonNullable<a>): Just<a> => new Just_(val)

class Nothing_<a> {
  public map<b>(f: (x: a) => b): Maybe<b> {
    return Nothing()
  }

  public bind<b>(f: (x: a) => Maybe<b>): Maybe<b> {
    return Nothing()
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

export type Nothing<a> = Nothing_<a>

export const Nothing = <a>(): Nothing<a> => new Nothing_()
