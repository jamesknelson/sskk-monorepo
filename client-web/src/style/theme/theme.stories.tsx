import { css } from '@emotion/react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { ButtonSurface } from 'retil-interaction'

import { Theme } from 'src/types'

import { theme as lightTheme } from './lightTheme'

const themes = { lightTheme }

export default {
  title: 'style/Theme',
  component: ThemeDemo,
  argTypes: {
    theme: {
      options: Object.keys(themes),
      mapping: themes,
      control: {
        type: 'radio',
        labels: {
          lightTheme: 'Light',
          darkTheme: 'Dark',
        },
      },
    },
  },
} as ComponentMeta<typeof ThemeDemo>

const Template: ComponentStory<typeof ThemeDemo> = (args) => (
  <div>
    <ButtonSurface>
      <ThemeDemo {...args} />
    </ButtonSurface>
  </div>
)

export const LightTheme = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
LightTheme.args = {
  theme: lightTheme,
}

function ThemeDemo(props: { theme: Theme }) {
  const { color, opacity } = props.theme

  return (
    <div
      css={css`
        background-color: ${color};
      `}>
      Theme
    </div>
  )
}
