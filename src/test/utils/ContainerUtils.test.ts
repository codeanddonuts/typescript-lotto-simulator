import ContainerUtils from "../../main/utils/ContainerUtils"

describe("Range of ...", () => {
  it("6 <= x < 11", () =>
    expect(ContainerUtils.intRange(6, 11)).toEqual([6, 7, 8, 9, 10])
  )

  it("19 <= x <= 21", () =>
    expect(ContainerUtils.intRangeClosed(19, 21)).toEqual([19, 20, 21])
  )
})

describe("Has distinct elements?", () => {
  it("Yes", () =>
    expect(ContainerUtils.hasDistinctElements([3, 6, 11, 1531])).toBeTruthy()
  )

  it("No", () =>
    expect(ContainerUtils.hasDistinctElements([1, 1, 2, 3, 5, 8])).toBeFalsy()
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