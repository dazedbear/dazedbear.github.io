import '../src/styles/global.css'
import '../src/styles/notion.css'
import React from 'react'

/**
 * add a wrapper with id `app` to fix the style rendering of tailwind css with `important` configured in tailwind.config.js.
 * @see https://tailwindcss.com/docs/configuration#important
 */
const withAppContainer = (Story) => (
  <div id="app">
    <Story />
  </div>
)

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export const decorators = [withAppContainer]
