import { createState } from 'retil-source'
import { useEffectOnce } from 'retil-support'

let counter = 0
const [authBarHiddenSource, setAuthBarHiddenSource] = createState(false)

export { authBarHiddenSource }

export function useHideAuthBarEffect() {
  useEffectOnce(() => {
    const hideCount = ++counter

    setAuthBarHiddenSource(true)

    return () => {
      if (hideCount === counter) {
        setAuthBarHiddenSource(false)
      }
    }
  })
}
