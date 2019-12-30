export default interface ValueObject {
  equals: (rhs: any) => boolean
  hashCode: () => number
}

export class ValueObjectKeyMap<K extends ValueObject, V> implements Map<K, V> {
  private readonly map: Map<number, [K, V]>

  constructor(entries?: Readonly<Readonly<[K, V]>[]> | null) {
    this.map = new Map(entries?.map(entry => [entry[0].hashCode(), [entry[0], entry[1]]]))
  }

  public clear(): void {
    this.map.clear()
  }

  public delete(key: K): boolean {
    return this.map.delete(key.hashCode())
  }

  public forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void {
    (new Map([...this.map.values()])).forEach(callbackfn, thisArg)
      
  }

  public get(key: K): V | undefined {
    return this.map.get(key.hashCode())?.[1]
  }

  public has(key: K): boolean {
    return this.map.has(key.hashCode())
  }

  public set(key: K, value: V): this {
    this.map.set(key.hashCode(), [key, value])
    return this
  }

  get size() {
    return this.map.size
  }

  public [Symbol.iterator](): IterableIterator<[K, V]> {
    return this.entries()
  }

  entries(): IterableIterator<[K, V]> {
    return this.map.values()
  }

  keys(): IterableIterator<K> {
    return Array.from(this.map.values(), x => x[0]).values()
  }

  values(): IterableIterator<V> {
    return Array.from(this.map.values(), x => x[1]).values()
  }

  get [Symbol.toStringTag]() {
    return "ValueObjectKeyMap"
  }
}
