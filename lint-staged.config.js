module.exports = {
  '*': filenames => {
    const changedFiles = filenames.join(' ')
    return [
      'npm run lint:eslint',
      'npm run lint:stylelint',
      'npm run format',
      `git add ${changedFiles}`,
    ]
  },
}
