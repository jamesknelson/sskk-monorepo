import { ComponentStory, ComponentMeta } from '@storybook/react'
import { ButtonSurface } from 'retil-interaction'

import { RaisedButtonBody } from './buttonBodies'
import { paletteColors } from './colors'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'presentation/RaisedButtonBody',
  component: RaisedButtonBody,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    color: {
      control: 'color',
      options: Object.values(paletteColors),
    },
    leftGlyph: {
      control: 'radio',
      options: [undefined, null, 'caret', 'spinner', 'chevron', 0.5],
    },
    rightGlyph: {
      control: 'radio',
      options: [undefined, null, 'caret', 'spinner', 'chevron', 0.5],
    },
  },
} as ComponentMeta<typeof RaisedButtonBody>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof RaisedButtonBody> = (args) => (
  <div>
    <ButtonSurface>
      <RaisedButtonBody {...args} />
    </ButtonSurface>
  </div>
)

export const Primary = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  label: 'Button',
}
