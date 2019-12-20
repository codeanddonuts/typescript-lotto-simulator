export default class ContainerUtils {
  public static intRange(begin: number, end: number): number[] {
    return Array.from(Array(end - begin).keys()).map(n => n + begin)
  }

  public static intRangeClosed(begin: number, end: number): number[] {
    return this.intRange(begin, end + 1)
  }

  public static shuffle<T>(arr: T[]): T[] {
    let i = arr.length
    while (i !== 0) {
      const j = Math.floor(Math.random() * i)
      const tmp = arr[--i]
      arr[i] = arr[j]
      arr[j] = tmp
    }
    return arr
  }

  public static hasDistinctElements<T>(arr: Readonly<T[]>): boolean {
    return arr.length === (new Set(arr)).size
  }

  public static intersection<T>(a: ReadonlySet<T>, b: ReadonlySet<T>): Set<T> {
    return new Set([...a].filter(x => b.has(x)))
  }
}
