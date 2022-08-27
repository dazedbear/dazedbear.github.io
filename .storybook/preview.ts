import '../src/styles/global.css'
import '../src/styles/notion.css'
import { withRootAttribute } from 'storybook-addon-root-attribute'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  /**
   * replace the id of <body> tag with `app` to align and fix the style rendering for tailwind css with `important` configured in tailwind.config.js.
   * @see https://tailwindcss.com/docs/configuration#important
   * @see https://storybook.js.org/addons/storybook-addon-root-attribute
   */
  rootAttribute: {
    root: 'body',
    attribute: 'id',
    defaultState: {
      name: 'body#app',
      value: 'app',
    },
  },
}

export const decorators = [withRootAttribute]
