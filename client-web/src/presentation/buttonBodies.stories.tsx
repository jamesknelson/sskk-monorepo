import { ComponentStory, ComponentMeta } from '@storybook/react'

import { RaisedButtonBody } from './buttonBodies'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'buttonBodies/RaisedButtonBody',
  component: RaisedButtonBody,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof RaisedButtonBody>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof RaisedButtonBody> = (args) => (
  <div>
    <RaisedButtonBody {...args} />
  </div>
)

export const Primary = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  label: 'Button',
}
