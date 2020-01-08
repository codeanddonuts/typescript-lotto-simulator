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

  public static takeWhile<T>(predicate: (x: T) => boolean, arr: Readonly<T[]>): T[] {
    return arr.slice(0, this.splitPoint(predicate, arr))
  }

  public static dropWhile<T>(predicate: (x: T) => boolean, arr: Readonly<T[]>): T[] {
    return arr.slice(this.splitPoint(predicate, arr))
  }

  public static span<T>(predicate: (x: T) => boolean, arr: Readonly<T[]>): [T[], T[]] {
    const splitPoint = this.splitPoint(predicate, arr)
    return [arr.slice(0, splitPoint), arr.slice(splitPoint)]
  }

  private static splitPoint<T>(predicate: (x: T) => boolean, arr: Readonly<T[]>, index: number = 0): number {
    return (predicate(arr[index]) && (index < arr.length)) ? this.splitPoint(predicate, arr, index + 1) : index
  }

  public static group<T>(arr: Readonly<T[]>): T[][] {
    if (arr.length === 0) {
      return []
    }
    const x = arr[0]
    const [ys, zs] = this.span(y => y === x, arr.slice(1) ?? [])
    return [[x, ...ys], ...this.group(zs)]
  }

  public static countOccurrence<T>(arr: Readonly<T[]>): Map<T, number> {
    return new Map(this.group([...arr].sort()).map(x => [x[0], x.length]))
  }
}
