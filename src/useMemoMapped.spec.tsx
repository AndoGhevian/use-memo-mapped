import { renderHook } from "@testing-library/react"
import { useMemoMapped } from "./useMemoMapped"

describe("useMappedMemo hook", () => {
  it("should render hook", () => {
    renderHook(() => useMemoMapped([], () => { }))
  })

  it("should map objects array", () => {
    const persons = [
      { name: "test-1" },
      { name: "test-2" },
    ]
    const { result } = renderHook(() => useMemoMapped(
      persons, (item, index) => ({
        testData: `${item.name}_${index}`,
      })
    ))
    expect(result.current).toEqual([
      { testData: "test-1_0" },
      { testData: "test-2_1" },
    ])
  })

  it("should provide original array as third argument to map", () => {
    const persons = [
      { name: "test-1" },
      { name: "test-2" },
    ]
    const map = jest.fn((item) => item)
    renderHook(() => useMemoMapped(
      persons, map
    ))

    expect(map).toHaveBeenCalledWith(
      expect.anything(), expect.anything(), persons
    )
  })

  it("should preserve values for the same objects between renders", () => {
    const persons = [
      { name: "test-1" },
      { name: "test-2" },
    ]
    const { result, rerender } = renderHook((props: {
      persons: { name: string }[]
    }) => useMemoMapped(
      props.persons, (item, index) => ({
        testData: `${item.name}_${index}`,
      })
    ), { initialProps: { persons } })

    const firstResults = result.current

    const newPerson = { name: "test-3" }
    rerender({persons: [...persons, newPerson]})

    expect(result.current[0]).toBe(firstResults[0])
    expect(result.current[1]).toBe(firstResults[1])
    expect(result.current[2]).toEqual({testData: "test-3_2"})
  })

  it("should not recompute the value for the object given it is already calculated", () => {
    const persons = [
      { name: "test-1" },
      { name: "test-2" },
    ]
    const map = jest.fn((item) => item)
    const { rerender } = renderHook((props: {
      persons: { name: string }[];
    }) => useMemoMapped(
      props.persons, map
    ), { initialProps: { persons } })

    expect(map).toHaveBeenCalledTimes(2)
    rerender({persons: [...persons, { name: "test-3" } ]})

    expect(map).toHaveBeenCalledTimes(3)
  })

  it("should recalculate mapped values array given array is changed", () => {
    const persons = [
      { name: "test-1" },
      { name: "test-2" },
    ]
    const { result, rerender } = renderHook((props: {
      persons: { name: string }[];
    }) =>  useMemoMapped(
      props.persons, (item) => item
    ), { initialProps: { persons } })

    const firstResults = result.current

    rerender({persons: [...persons]})

    expect(firstResults).not.toBe(result.current)
  })

  it("should not recalculate mapped values array given array is not changed", () => {
    const persons = [
      { name: "test-1" },
      { name: "test-2" },
    ]
    const { result, rerender } = renderHook(() => useMemoMapped(
      persons, (item) => item
    ))

    const firstResults = result.current

    rerender()

    expect(firstResults).toBe(result.current)
  })

  it("should not recalculate mapped values array given map function is changed", () => {
    const persons = [
      { name: "test-1" },
      { name: "test-2" },
    ]
    const map = jest.fn((item) => item)
    const { result, rerender } = renderHook((props: {
      persons: { name: string }[];
      map: (item: any) => any;
    }) => useMemoMapped(
      props.persons, props.map
    ), { initialProps: { persons, map: map as (item: any) => any } })

    const firstResults = result.current

    rerender({persons: persons, map: (item) => item})

    expect(firstResults).toBe(result.current)
  })

  describe("deps", () => {
    it("should recompute all values given deps are changed", () => {
      const persons = [
        { name: "test-1" },
        { name: "test-2" },
      ]
      const map = jest.fn((item) => item)
      const { result, rerender } = renderHook((props: {
        persons: { name: string }[];
        deps: any[];
      }) => useMemoMapped(
        props.persons, map, props.deps
      ), { initialProps: { persons, deps: [1] } })

      const firstResults = result.current
      expect(map).toHaveBeenCalledTimes(2)

      rerender({persons: persons, deps: [2]})
      expect(firstResults).not.toBe(result.current)
      expect(map).toHaveBeenCalledTimes(4)
    })
  })
})
