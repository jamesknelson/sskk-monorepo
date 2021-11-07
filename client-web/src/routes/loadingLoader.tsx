import { useOverrideColumnTransitionHandleRef } from 'src/components/columnTransition'
import { FixedCenteredLoadingSpinner } from 'src/presentation/fixedCenteredLoadingSpinner'

function LoadingPage() {
  const transitionHandleRef = useOverrideColumnTransitionHandleRef()

  return (
    <FixedCenteredLoadingSpinner transitionHandleRef={transitionHandleRef} />
  )
}

export default LoadingPage
