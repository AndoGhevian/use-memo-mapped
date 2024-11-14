import { useState } from 'react'

export function useMemoMapped() {
  const [state, setState] = useState(null)

  return state
}
