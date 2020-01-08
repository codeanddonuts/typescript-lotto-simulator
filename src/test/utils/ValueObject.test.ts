import ValueObject, { ValueObjectKeyMap } from "../../main/utils/ValueObject"
import { hash } from "../../main/utils/HashUtils"

class Person implements ValueObject {
  constructor(private readonly name: string, private readonly age: number) {}

  equals(rhs: any) {
    if (this === rhs) {
      return true
    } else if (!(rhs instanceof Person)) {
      return false
    }
    return (this.name === rhs.name) && (this.age === rhs.age)
  }

  hashCode() {
    return hash(`${hash(this.name) + this.age}`)
  }
}

let map: ValueObjectKeyMap<Person, string>

beforeEach(() => {
  map = new ValueObjectKeyMap()
})

describe("Is sample class valid?", () => {
  it("Yes", () => {
    const p = new Person("Kang", 29)
    expect(p.equals(p)).toBeTruthy()
    expect(p.equals(3)).toBeFalsy()
    expect(p.equals(new Person("Kang", 29))).toBeTruthy()
  })
})

describe("Cleared?", () => {
  it("Yes", () => {
    map.set(new Person("Park", 17), "Bad girl").set(new Person("Kim", 14), "Good boy").clear()
    expect(map.size).toEqual(0)
  })
})

describe("Deleted?", () => {
  it("Yes", () => {
    map.set(new Person("Park", 17), "Bad girl").set(new Person("Kim", 14), "Good boy").delete(new Person("Park", 17))
    expect(map.size).toEqual(1)
    expect(map.get(new Person("Kim", 14))).toEqual("Good boy")
    expect(map.get(new Person("Park", 17))).toBeUndefined()
  })
})

describe("How many times?", () => {
  it("3", () => {
    let i = 1
    map.set(new Person("Park", 17), "Bad girl").set(new Person("Kim", 14), "Good boy").set(new Person("Nam", 21), "Hi")
    expect(map.size).toEqual(3)
    map.forEach(() => i *= 2 )
    expect(i).toEqual(8)
  })
})

describe("Has ...?", () => {
  it("Park, Kim: Yes", () => {
    map.set(new Person("Park", 17), "Bad girl").set(new Person("Kim", 14), "Good boy")
    expect(map.size).toEqual(2)
    expect(map.has(new Person("Kim", 14))).toBeTruthy()
    expect(map.has(new Person("Park", 17))).toBeTruthy()
  })

  it("Nam, Yang: No", () => {
    map.set(new Person("Park", 17), "Bad girl").set(new Person("Kim", 14), "Good boy")
    expect(map.size).toEqual(2)
    expect(map.has(new Person("Nam", 21))).toBeFalsy()
    expect(map.has(new Person("Yang", 8))).toBeFalsy()
  })
})

describe("Successfully overrided?", () => {
  it("Yes", () => {
    map.set(new Person("Kim", 14), "Good boy")
    expect(map.size).toEqual(1)
    expect(map.get(new Person("Kim", 14))).toEqual("Good boy")
    map.set(new Person("Kim", 14), "Weird boy")
    expect(map.size).toEqual(1)
    expect(map.get(new Person("Kim", 14))).toEqual("Weird boy")
  })
})

describe("Entry = [Key, Value]?", () => {
  it("Yes", () => {
    map.set(new Person("Park", 17), "Bad girl").set(new Person("Kim", 14), "Good boy").set(new Person("Nam", 21), "Hi")
    expect(map.size).toEqual(3)
    const entryIterator = map.entries()
    expect(entryIterator.next().value).toEqual([new Person("Park", 17), "Bad girl"])
    expect(entryIterator.next().value).toEqual([new Person("Kim", 14), "Good boy"])
    expect(entryIterator.next().value).toEqual([new Person("Nam", 21), "Hi"])
    expect([...map.entries()].map(entry => entry[0])).toEqual([...map.keys()])
    expect([...map.entries()].map(entry => entry[1])).toEqual([...map.values()])
  })
})
