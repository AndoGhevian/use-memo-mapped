import { useMemo, useRef } from 'react'

export const useMemoMapped = <T extends object, B>(
  array: T[],
  map: (item: T, index: number, array: T[]) => B
): B[] => {
  const weakMapRef = useRef(new WeakMap<T, B>())
  return useMemo(() => {
    const mappedData: B[] = []
    array.forEach((item, index) => {
      if (weakMapRef.current.has(item)) {
        mappedData.push(weakMapRef.current.get(item) as B)
        return
      }

      const value = map(item, index, array)
      weakMapRef.current.set(item, value)
      mappedData.push(value as B)
    })

    return mappedData
  }, [array])
}
