const originMain = require('../../.storybook/main')

/**
 * exclude `*.mdx` from snapshot testing for incompatibility between Jest v27+ and @storybook/addon-storyshots v6
 * @see https://github.com/storybookjs/storybook/issues/15916
 */
const resolvedMain = Object.assign({}, originMain, {
  stories: ['../../src/**/*.stories.@(js|jsx|ts|tsx)'],
  staticDirs: ['../../public'],
})

module.exports = resolvedMain
