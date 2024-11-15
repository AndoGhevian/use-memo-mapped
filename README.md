# use-memo-mapped

`use-memo-mapped` is a custom React hook that maps an array of objects through **impure calculations** while preserving **purity**
of results, i.e. for same array items you get same results.

Designed for cases where computed values depend on **impure calculations** like time or randomness during render, `use-memo-mapped` combines the ***memoization*** of useMemo with the **persistence** of useRef, synchronizing calculated values across render cycles without unnecessary recalculations and useEffects.

## Live Demo

Try out the package in this live, interactive example:

[![Edit on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/sandbox/6lqjq3)

## Install

`npm install use-memo-mapped`

## Usage

```typescript
  const items = useDynamicArray(); // must be object values array

  const itemsWithId = useMemoMapped(items, (item) => ({
    ...item,
    id: String(Math.random()), // this will run once for the same items in the array
  }));

  const invalidIds = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        id: String(Math.random()), // this will run every time the array reference changed
      })),
    [items]
  );
```

## Reasons behind the package

While preserving some **impure calculations** on rerenders for the single value is easy:
```typescript
  const person = usePersonQuery() as object
  const personRandomId = useMemo(() => Math.random(), [person])
  // personRandomId is the same while person is not changed
```

Do the same staff for dynamic array of values is not a trivial task. Here you need to track reference to each value in the array
and make for it a calculations only for new references.
```typescript
  const items = useDynamicArray() as object[]

  const withRandomId = useMemo(
    () => items.map(
      item => ({
        ...item,
        randomId: Math.random()
      })
    ), [items]) // Logical Error !!!
```
You need to utilize **useRef** for persitancy and **useMemo**
for recalculations. Also you need synchronize data between this both and remove unused references from
useRef to not encounter a memory leaks.

## License

This project is licensed under the MIT License.
