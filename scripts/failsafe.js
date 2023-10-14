require('./env')()
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const { XMLParser } = require('fast-xml-parser')
const get = require('lodash/get')
const Ajv = require('ajv')
const addFormats = require('ajv-formats')
const { aws, currentEnv, website, failsafe } = require('../site.config')
const {
  FAILSAFE_PAGE_GENERATION_QUERY,
  FORCE_CACHE_REFRESH_QUERY,
} = require('../src/libs/constant')
const log = require('./log')

// node-fetch and pMap doesn't support common js since v3.
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args))
const pMap = (...args) =>
  import('p-map').then(({ default: pMap }) => pMap(...args))

const parser = new XMLParser()
const ajv = new Ajv()
addFormats(ajv)

const getPageUrls = async () => {
  const host = get(website, [currentEnv, 'host'])
  const protocal = get(website, [currentEnv, 'protocol'])
  const endpoint = `${protocal}://${host}/api/sitemap`
  const response = await fetch(endpoint)
  if (!response.ok) {
    throw Error(
      `fetch sitemap error | status: ${response.status} | statusText: ${response.statusText} | url: ${endpoint}`
    )
  }
  const sitemapXml = await response.text()
  const sitemapObj = parser.parse(sitemapXml)

  const pageUrls = get(sitemapObj, ['urlset', 'url'], []).map(
    ({ loc }) =>
      `${loc}?${FAILSAFE_PAGE_GENERATION_QUERY}=1&${FORCE_CACHE_REFRESH_QUERY}=1`
  ) // failsafe generation mode

  log({ category: 'getPageUrls', message: pageUrls })
  return pageUrls
}

const generateFailsafePages = async (pageUrls) => {
  const failsafeSuffix = '<!-- dazedbear studio failsafe -->'
  const pageUrlsSchema = {
    type: 'array',
    items: {
      type: 'string',
      format: 'uri',
    },
  }
  const failsagePagesSchema = {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
        },
        content: {
          type: 'string',
          minLength: 100,
        },
      },
      required: ['path', 'content'],
    },
  }
  const validatePageUrls = ajv.compile(pageUrlsSchema)
  const validateFailsafePages = ajv.compile(failsagePagesSchema)
  if (!validatePageUrls(pageUrls)) {
    throw validatePageUrls.errors
  }

  let failsafePages = await pMap(
    pageUrls,
    async (url) => {
      const response = await fetch(url)
      if (!response.ok) {
        log({
          category: 'generateFailsafePages',
          message: `fetch page url error | status: ${response.status} | statusText: ${response.statusText} | url = ${url}`,
          level: 'error',
        })
        return
      }
      const pageHTML = await response.text()

      const urlObject = new URL(url)
      const filename =
        urlObject.pathname === '/'
          ? '/index.html'
          : `${urlObject.pathname}.html`
      const metadata = {
        path: `${urlObject.hostname}${filename}`,
        content: `${pageHTML}${failsafeSuffix}`,
      }
      log({
        category: 'generateFailsafePages',
        message: `fetch page url success | status: ${response.status} | statusText: ${response.statusText} | url = ${url}`,
      })
      return metadata
    },
    {
      concurrency: failsafe.concurrency,
    }
  )

  failsafePages = failsafePages.filter((metadata) => metadata)
  if (!validateFailsafePages(failsafePages)) {
    throw validateFailsafePages.errors
  }
  return failsafePages
}

const uploadFailsafeToCDN = async (failsafePages) => {
  const awsS3Client = new S3Client({})
  await pMap(
    failsafePages,
    async (metadata) => {
      try {
        const param = {
          Bucket: aws.s3bucket,
          Key: metadata.path,
          Body: metadata.content,
          ContentType: 'text/html; charset=utf-8',
          CacheControl: 'public, max-age=0, must-revalidate',
        }
        const command = new PutObjectCommand(param)
        const response = await awsS3Client.send(command)
        const { requestId, cfId, extendedRequestId } = response.$metadata
        log({
          category: 'uploadFailsafeToCDN',
          message: `upload failsafe page to AWS S3 success | Key: ${metadata.path} | requestId: ${requestId} | cfId: ${cfId} | extendedRequestId: ${extendedRequestId}`,
        })
      } catch (err) {
        const { requestId, cfId, extendedRequestId } = err.$metadata
        throw Error(
          `upload failsafe page to AWS S3 failed | Key: ${metadata.path} | requestId: ${requestId} | cfId: ${cfId} | extendedRequestId: ${extendedRequestId}`
        )
      }
    },
    {
      concurrency: failsafe.concurrency,
    }
  )
  await awsS3Client.destroy()
}

;(async () => {
  try {
    log({ category: 'failsafe', message: 'start failsafe generation.' })
    const pageUrls = await getPageUrls()
    const failsafePages = await generateFailsafePages(pageUrls)
    await uploadFailsafeToCDN(failsafePages)
    log({ category: 'failsafe', message: 'finish failsafe generation.' })
    process.exit(0)
  } catch (err) {
    log({
      category: 'failsafe',
      message: err,
      level: 'error',
    })
    log({
      category: 'failsafe',
      message: 'stop failsafe generation due to errors.',
      level: 'error',
    })
    process.exit(127)
  }
})()
