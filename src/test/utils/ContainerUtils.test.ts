import ContainerUtils from "../../main/utils/ContainerUtils"

describe("Range of ...", () => {
  it("6 <= x < 11", () =>
    expect(ContainerUtils.intRange(6, 11)).toEqual([6, 7, 8, 9, 10])
  )

  it("11 > x >= 6", () =>
    expect(ContainerUtils.intRange(11, 6)).toEqual([10, 9, 8, 7, 6])
  )

  it("19 <= x <= 21", () =>
    expect(ContainerUtils.intRangeClosed(19, 21)).toEqual([19, 20, 21])
  )

  it("21 >= x >= 19", () =>
    expect(ContainerUtils.intRangeClosed(21, 19)).toEqual([21, 20, 19])
  )

  it("7 <= x < 7", () =>
    expect(ContainerUtils.intRange(7, 7)).toEqual([])
  )

  it("7 <= x <= 7", () =>
    expect(ContainerUtils.intRangeClosed(7, 7)).toEqual([7])
  )

  it("7.2 <= x < 11.2?", () =>
    expect(() => ContainerUtils.intRangeClosed(7.2, 11.7)).toThrow()
  )

})

describe("Has distinct elements?", () => {
  it("Yes", () =>
    expect(ContainerUtils.hasOnlyDistinctElements([3, 6, 11, 1531])).toBeTruthy()
  )

  it("No", () =>
    expect(ContainerUtils.hasOnlyDistinctElements([1, 1, 2, 3, 5, 8])).toBeFalsy()
  )
})

describe("Intersection of ...", () => {
  it("{1, 3}, {3, 5, 7} = {3}", () =>
    expect(ContainerUtils.intersection(new Set([1, 3]), new Set([3, 5, 7]))).toEqual(new Set([3]))
  )

  it("{1, 3}, {5, 7} = {}", () =>
    expect(ContainerUtils.intersection(new Set([1, 3]), new Set([5, 7]))).toEqual(new Set())
  )
})

describe("Take while ...", () => {
  it("(x < 6, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) = [1, 2, 3, 4, 5]", () =>
    expect(ContainerUtils.takeWhile(x => x < 6, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toEqual([1, 2, 3, 4, 5])
  )

  it("(x < 1, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) = []", () =>
    expect(ContainerUtils.takeWhile(x => x < 1, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toEqual([])
  )

  it("(x < 15, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]", () =>
    expect(ContainerUtils.takeWhile(x => x < 15, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  )

  it("(x < 7, []) = []", () =>
    expect(ContainerUtils.takeWhile(x => x < 7, [])).toEqual([])
  )
})

describe("Drop while ...", () => {
  it("(x < 6, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) = [6, 7, 8, 9, 10]", () =>
    expect(ContainerUtils.dropWhile(x => x < 6, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toEqual([6, 7, 8, 9, 10])
  )

  it("(x < 1, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]", () =>
    expect(ContainerUtils.dropWhile(x => x < 1, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  )

  it("(x < 15, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) = []", () =>
    expect(ContainerUtils.dropWhile(x => x < 15, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toEqual([])
  )

  it("(x < 7, []) = []", () =>
    expect(ContainerUtils.dropWhile(x => x < 7, [])).toEqual([])
  )
})

describe("Span ...", () => {
  it("(x < 6, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) = [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10]]", () =>
    expect(ContainerUtils.span(x => x < 6, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toEqual([[1, 2, 3, 4, 5], [6, 7, 8, 9, 10]])
  )

  it("(x < 1, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) = [[], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]]", () =>
    expect(ContainerUtils.span(x => x < 1, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toEqual([[], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]])
  )

  it("(x < 15, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) = [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], []]", () =>
    expect(ContainerUtils.span(x => x < 15, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toEqual([[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], []])
  )

  it("(x < 7, []) = [[], []]", () =>
    expect(ContainerUtils.span(x => x < 7, [])).toEqual([[], []])
  )
})

describe("Group ...", () => {
  it("[1, 2, 3, 4, 5, 6, 7, 8, 9, 10] = [[1], [2], [3], [4], [5], [6], [7], [8], [9], [10]]", () =>
    expect(ContainerUtils.group([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toEqual([[1], [2], [3], [4], [5], [6], [7], [8], [9], [10]])
  )

  it("[1, 2, 2, 3, 3, 3, 4, 5, 6, 6] = [[1], [2, 2], [3, 3, 3], [4], [5], [6, 6]]", () =>
    expect(ContainerUtils.group([1, 2, 2, 3, 3, 3, 4, 5, 6, 6])).toEqual([[1], [2, 2], [3, 3, 3], [4], [5], [6, 6]])
  )

  it("[a, a, a, a, b] = [[a, a, a, a], [b]]", () =>
    expect(ContainerUtils.group(["a", "a", "a", "a", "b"])).toEqual([["a", "a", "a", "a"], ["b"]])
  )

  it("[] = []", () =>
    expect(ContainerUtils.group([])).toEqual([])
  )
})

describe("Count occurence of ...", () => {
  it("[1, 2, 3, 4] = (1=1, 2=1, 3=1, 4=1)", () =>
    expect(ContainerUtils.countOccurrence([1, 2, 3, 4])).toEqual(new Map([[1, 1], [2, 1], [3, 1], [4, 1]]))
  )

  it("[2, 1, 3, 2, 3, 4, 3] = (1=1, 2=2, 3=3, 4=1)", () =>
    expect(ContainerUtils.countOccurrence([2, 1, 3, 2, 3, 4, 3])).toEqual(new Map([[1, 1], [2, 2], [3, 3], [4, 1]]))
  )

  it("[] = ()", () =>
    expect(ContainerUtils.countOccurrence([])).toEqual(new Map())
  )

  it("[a, a, a, a, a] = (a=5)", () =>
    expect(ContainerUtils.countOccurrence(["a", "a", "a", "a", "a"])).toEqual(new Map([["a", 5]]))
  )
})
