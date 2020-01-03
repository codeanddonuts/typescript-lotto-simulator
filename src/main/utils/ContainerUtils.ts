export default class ContainerUtils {
  public static intRange(begin: number, end: number): number[] {
    if (begin <= end) {
      return Array.from(Array(end - begin).keys()).map(n => n + begin)
    }
    return this.intRangeClosed(begin - 1, end)
  }

  public static intRangeClosed(begin: number, end: number): number[] {
    if (begin <= end) {
      return this.intRange(begin, end + 1)
    }
    return Array.from(Array(begin - end + 1).keys()).map(n => n + end).reverse()
  }

  public static shuffle<T>(arr: T[]): T[] {
    let i = arr.length
    while (i !== 0) {
      const j = Math.floor(Math.random() * i)
      const temp = arr[--i]
      arr[i] = arr[j]
      arr[j] = temp
    }
    return arr
  }

  public static hasOnlyDistinctElements<T>(arr: Readonly<T[]>): boolean {
    return arr.length === (new Set(arr)).size
  }

  public static intersection<T>(a: ReadonlySet<T>, b: ReadonlySet<T>): Set<T> {
    return new Set([...a].filter(x => b.has(x)))
  }
}
