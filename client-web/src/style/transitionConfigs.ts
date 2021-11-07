import { ControllerUpdate } from 'react-spring'

import { crossfadeConfig } from './springConfigs'

export interface TransitionConfig {
  initial?: Record<string, any>
  from?: Record<string, any>
  enter?: ControllerUpdate<Record<string, any>>
  exit?: ControllerUpdate<Record<string, any>>
}

export const defaultColumnTransitionConfig: TransitionConfig = {
  initial: {
    opacity: 1,
    transform: 'none',
  },
  from: {
    opacity: 0,
    transform: 'translateY(-10vh)',
  },
  enter: {
    opacity: 1,
    transform: 'translateY(0vh)',
    config: {
      friction: 50,
      mass: 1,
      tension: 500,
    },
  },
  exit: {
    opacity: 0,
    transform: 'translateY(10vh)',
    config: {
      clamp: true,
      friction: 15,
      mass: 1,
      tension: 300,
    },
  },
}

export const crossfadeTransitionConfig: TransitionConfig = {
  initial: {
    opacity: 0,
  },
  from: {
    opacity: 0,
  },
  enter: {
    opacity: 1,
    config: crossfadeConfig,
  },
  exit: {
    opacity: 0,
    config: crossfadeConfig,
  },
}
