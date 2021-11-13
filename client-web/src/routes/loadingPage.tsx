import { useTransitionHandleRefContext } from 'src/context/transitionHandleRefContext'
import { LayoutLoadingSpinner } from 'src/components/web/layout/layoutLoadingSpinner'

export function LoadingPage() {
  const transitionHandleRef = useTransitionHandleRefContext()

  return <LayoutLoadingSpinner transitionHandleRef={transitionHandleRef} />
}
