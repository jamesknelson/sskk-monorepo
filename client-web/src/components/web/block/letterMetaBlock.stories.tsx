import { ComponentStory, ComponentMeta } from '@storybook/react'
import { ButtonSurface } from 'retil-interaction'

import { LetterMetaBlock } from './letterMetaBlock'

const addresses = {
  member: [
    {
      type: 'member',
      handle: 'jkn',
      name: 'James K Nelson (at Letterhouse)',
    },
  ],
  placeholder: [{ type: 'placeholder', label: 'You' }],
}

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'presentation/LetterMetaBlock',
  component: LetterMetaBlock,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    from: {
      options: Object.keys(addresses),
      mapping: addresses,
      control: {
        type: 'select',
      },
    },
    to: {
      options: Object.keys(addresses),
      mapping: addresses,
      control: {
        type: 'select',
      },
    },
  },
} as ComponentMeta<typeof LetterMetaBlock>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof LetterMetaBlock> = (args) => (
  <div>
    <ButtonSurface>
      <LetterMetaBlock {...args} />
    </ButtonSurface>
  </div>
)

export const Primary = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  title: "You've just taken the first step.",
  from: addresses.member,
  to: addresses.placeholder,
}
