export default interface ValueObject {
  equals: (rhs: any) => boolean
  hashCode: () => number
}

export const hash = (str: string, seed = 0): number => {
  let h1 = 0xdeadbeef ^ seed
  let h2 = 0x41c6ce57 ^ seed
  for (let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i)
      h1 = Math.imul(h1 ^ ch, 2654435761)
      h2 = Math.imul(h2 ^ ch, 1597334677)
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  return 4294967296 * (2097151 & h2) + (h1 >>> 0)
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
    const self = this
    return new class {
      public next(...args: [] | [undefined]): IteratorResult<[K, V], any> {
        return self.map.values().next()
      }

      public [Symbol.iterator](): IterableIterator<[K, V]> {
        return this
      }
    }
  }

  keys(): IterableIterator<K> {
    const self = this
    return new class {
      public next(...args: [] | [undefined]): IteratorResult<K, any> {
        return [...self.map.values()].map(x => x[0]).values().next()
      }

      public [Symbol.iterator](): IterableIterator<K> {
        return this
      }
    }
  }

  values(): IterableIterator<V> {
    const self = this
    return new class {
      public next(...args: [] | [undefined]): IteratorResult<V, any> {
        return [...self.map.values()].map(x => x[1]).values().next()
      }

      public [Symbol.iterator](): IterableIterator<V> {
        return this
      }
    }
  }

  get [Symbol.toStringTag]() {
    return "ValueObjectKeyMap"
  }
}
