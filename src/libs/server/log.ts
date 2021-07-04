import chalk from 'chalk'
import { Logger as SplunkLogger } from 'splunk-logging'
import { splunk } from '../../../site.config'

chalk.level = 2 // disable level auto detection to make sure all log has correct color, see https://www.npmjs.com/package/chalk#chalklevel
const Logger = splunk.enable ? new SplunkLogger(splunk.option) : null

// level = debug, info, warn, error
const log = ({ category = '', message = '', level = 'info', req = null }) => {
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
    msg += ` ${message}`
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
      env: process.env.NEXT_PUBLIC_APP_ENV,
      message,
    },
    metadata: {
      host: process.env.HOST,
      source: process.env.HOST,
      sourcetype: `client_${level === 'error' ? 'error' : 'log'}`, // client_log, client_error
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
    payload.metadata.sourcetype = `server_${
      level === 'error' ? 'error' : 'log'
    }` // server_log, server_error
  }

  Logger.send(payload, err => {
    if (err) {
      console.error('Send logs to Splunk Error', err)
    }
  })
}

export default log
