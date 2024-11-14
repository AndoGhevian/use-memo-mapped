import { renderHook } from "@testing-library/react"
import { useMemoMapped } from "./useMemoMapped"

describe("useMappedMemo hook", () => {
  it("should render hook", () => {
    renderHook(useMemoMapped)
  })
})
