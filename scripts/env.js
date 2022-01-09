const { processEnv, loadEnvConfig } = require('@next/env')
const env = require('env-var')

const handler = () => {
  // https://docs.github.com/en/actions/learn-github-actions/environment-variables#default-environment-variables
  const isLocal = !env
    .get('CI')
    .default('false')
    .asBool()
  const dir = process.cwd()
  const { loadedEnvFiles } = loadEnvConfig(dir, isLocal)
  processEnv(loadedEnvFiles, dir)
}

module.exports = handler
