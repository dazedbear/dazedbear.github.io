import cacheClient from '../../libs/server/cache'
import chalk from 'chalk'

export default async function handler(req, res) {
  const allowMethod = ['GET', 'POST']
  if (allowMethod.includes(req.method)) {
    // return ok first
    res.status(200).send('OK')
    console.log(
      chalk.blueBright(
        `[${new Date().toUTCString()}][API] ${req.method} ${req.url} - success`
      ),
      '\nheaders',
      req.headers,
      '\nbody',
      req.body
    )

    // clean up cache later
    await cacheClient.reset()
    console.log(
      chalk.yellowBright(
        `[${new Date().toUTCString()}][cacheClient] clear all cache.`
      )
    )
  } else {
    // invalid request
    res.status(400).send('INVALID')
    console.log(
      chalk.yellowBright(
        `[${new Date().toUTCString()}][API] ${req.method} ${
          req.url
        } - invalid request`
      ),
      '\nheaders',
      req.headers,
      '\nbody',
      req.body
    )
  }
}
