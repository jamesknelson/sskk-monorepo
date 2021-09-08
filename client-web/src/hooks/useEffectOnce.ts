import { EffectCallback, useEffect } from 'react'

export function useEffectOnce(cb: EffectCallback) {
  useEffect(cb, [])
}
