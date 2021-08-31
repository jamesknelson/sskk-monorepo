import { PopupDialogArrowDiv } from 'retil-interaction'
import styled from 'styled-components'

import { colors } from 'src/theme'

export const PopupArrow = styled(PopupDialogArrowDiv)`
  position: absolute;
  width: 0;
  height: 0;

  &::before,
  &::after {
    content: '';
    margin: auto;
    display: block;
    width: 0;
    height: 0;
    border-style: solid;
    border-color: transparent;
    position: absolute;
  }
  &::before {
    border-width: 8px;
  }
  &::after {
    border-width: 7px;
  }

  &[data-placement*='bottom'] {
    top: 0;
    left: 0;
    margin-top: -1rem;
    width: 0.5rem;
    height: 0.5rem;
    &::before {
      border-color: transparent transparent ${colors.structure.border}
        transparent;
      z-index: 1;
    }
    &::after {
      border-color: transparent transparent ${colors.structure.bg} transparent;
      z-index: 2;
      margin-left: 1px;
      margin-top: 2px;
    }
  }
  &[data-placement*='top'] {
    bottom: 0;
    left: 0;
    margin-bottom: -0.5rem;
    width: 0.5rem;
    height: 0.5rem;
    &::before {
      border-color: ${colors.structure.border} transparent transparent
        transparent;
      z-index: 1;
    }
    &::after {
      border-color: ${colors.structure.bg} transparent transparent transparent;
      z-index: 2;
      margin-left: 1px;
      margin-bottom: -2px;
    }
  }
  &[data-placement*='right'] {
    top: 0;
    left: 0;
    margin-top: -0.75rem;
    margin-left: -1rem;
    height: 0.5rem;
    width: 0.5rem;
    &::before {
      border-color: transparent ${colors.structure.border} transparent
        transparent;
      z-index: 1;
    }
    &::after {
      border-color: transparent ${colors.structure.bg} transparent transparent;
      z-index: 2;
      margin-top: 1px;
      margin-left: 2px;
    }
  }
  &[data-placement*='left'] {
    top: 0;
    right: -0.5rem;
    margin-top: -0.75rem;
    height: 0.5rem;
    width: 0.5rem;
    &::before {
      border-color: transparent transparent transparent
        ${colors.structure.border};
      z-index: 1;
    }
    &::after {
      border-color: transparent transparent transparent ${colors.structure.bg};
      z-index: 2;
      margin-top: 1px;
      margin-left: 0px;
    }
  }
`
