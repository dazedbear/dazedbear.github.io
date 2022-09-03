/**
 * @jest-environment jsdom
 */
import initStoryshots from '@storybook/addon-storyshots'
initStoryshots({
  configPath: 'tests/.storybook',
  framework: 'react',
})
