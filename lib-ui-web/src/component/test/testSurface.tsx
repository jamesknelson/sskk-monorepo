import {
  inActiveSurface,
  inDisabledSurface,
  inFocusedSurface,
  inHoveredSurface,
  useSurfaceSelectorsConnector,
} from 'retil-interaction'

export interface TestSurfaceProps {
  active?: boolean
  disabled?: boolean
  focused?: boolean
  hovered?: boolean
}

export const TestSurface = ({
  active = false,
  disabled = false,
  focused = false,
  hovered = false,
  ...restProps
}: TestSurfaceProps) => {
  const [, mergeProps, provide] = useSurfaceSelectorsConnector([
    [inActiveSurface, active],
    [inDisabledSurface, disabled],
    [inFocusedSurface, focused],
    [inHoveredSurface, hovered],
  ])

  return provide(<div {...mergeProps(restProps)} />)
}
