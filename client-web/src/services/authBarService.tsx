import { createState } from 'retil-source'

let counter = 0
const [authBarHiddenSource, setAuthBarHiddenSource] = createState(false)

export { authBarHiddenSource }

export function hideAuthBarEffect() {
  const hideCount = ++counter

  setAuthBarHiddenSource(true)

  return () => {
    if (hideCount === counter) {
      setAuthBarHiddenSource(false)
    }
  }
}
