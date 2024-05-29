import chalk from 'chalk'
import util from 'util'
import { logOption } from '../../../types'

chalk.level = 2 // disable level auto detection to make sure all log has correct color, see https://www.npmjs.com/package/chalk#chalklevel

// level = debug, info, warn, error
const log = ({ category = '', message = '', level = 'info' }: logOption) => {
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
}

export default log
