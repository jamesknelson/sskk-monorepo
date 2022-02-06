import { useTransitionHandleRefContext } from 'retil-transition'

import { LayoutLoadingSpinner } from 'lib-ui-web/component/layout/layoutLoadingSpinner'

export function LoadingPage() {
  const transitionHandleRef = useTransitionHandleRefContext()

  return <LayoutLoadingSpinner transitionHandleRef={transitionHandleRef} />
}
