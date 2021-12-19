const { processEnv, loadEnvConfig } = require('@next/env')

const handler = () => {
  // https://docs.github.com/en/actions/learn-github-actions/environment-variables#default-environment-variables
  const isLocal = !process.env.CI
  const dir = process.cwd()
  const { loadedEnvFiles } = loadEnvConfig(dir, isLocal)
  processEnv(loadedEnvFiles, dir)
}

module.exports = handler
