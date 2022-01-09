import chalk from 'chalk'
import get from 'lodash/get'
import util from 'util'
import { Logger as SplunkLogger } from 'splunk-logging'
import { currentEnv, splunk, website } from '../../../site.config'
import { logOption } from '../../../types'

chalk.level = 2 // disable level auto detection to make sure all log has correct color, see https://www.npmjs.com/package/chalk#chalklevel
const Logger = splunk.enable ? new SplunkLogger(splunk.option) : null

// level = debug, info, warn, error
const log = ({
  category = '',
  message = '',
  level = 'info',
  req = null,
}: logOption) => {
  const levelMap = {
    debug: {
      method: 'log',
      color: 'grey',
    },
    info: {
      method: 'log',
      color: 'whiteBright',
    },
    warn: {
      method: 'warn',
      color: 'yellowBright',
    },
    error: {
      method: 'error',
      color: 'redBright',
    },
  }

  let msg = `[${new Date().toUTCString()}]`
  if (category) {
    msg += `[${category}]`
  }
  if (message) {
    msg += ` ${typeof message === 'object' ? util.inspect(message) : message}`
  }

  const { method = 'log', color = 'whiteBright' } = levelMap[level]
  console[method](chalk[color](msg))

  if (!splunk.enable) {
    return
  }

  const payload = {
    severity: level,
    message: {
      app: 'dazedbear_studio',
      category,
      env: currentEnv,
      message,
    },
    metadata: {
      host: get(website, [currentEnv, 'host']),
      source: get(website, [currentEnv, 'host']),
      // we only send server logs now. expected values: client_log, client_error, server_log, server_error
      sourcetype: `server_${level === 'error' ? 'error' : 'log'}`,
    },
  } as any

  if (req) {
    payload.message = {
      ...payload.message,
      body: req.body || null,
      headers: req.headers,
      method: req.method,
      query: req.query || null,
      url: req.url,
    }
  }

  Logger.send(payload, err => {
    if (err) {
      console.error('Send logs to Splunk Error', err)
    }
  })
}

export default log
