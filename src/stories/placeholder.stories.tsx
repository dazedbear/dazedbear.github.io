import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Placeholder from '../components/placeholder'

export default {
  title: 'Placeholder',
  component: Placeholder,
} as ComponentMeta<typeof Placeholder>

const Template = (args) => <Placeholder {...args} />

export const StreamPlaceholder: ComponentStory<typeof Placeholder> =
  Template.bind({})
StreamPlaceholder.args = {
  itemCount: 3,
  itemClassNames: '',
  wrapperClassNames: '',
}
