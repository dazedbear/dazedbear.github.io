module.exports = {
  '*': filenames => {
    const changedFiles = filenames.join(' ')
    return ['npm run lint', 'npm run format', `git add ${changedFiles}`]
  },
}
