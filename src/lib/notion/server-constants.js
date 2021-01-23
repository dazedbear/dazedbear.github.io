// use commonjs so it can be required without transpiling
const path = require('path')

const normalizeId = id => {
  if (!id) return id
  if (id.length === 36) return id
  if (id.length !== 32) {
    throw new Error(
      `Invalid blog-index-id: ${id} should be 32 characters long. Info here https://github.com/ijjk/notion-blog#getting-blog-index-and-token`
    )
  }
  return `${id.substr(0, 8)}-${id.substr(8, 4)}-${id.substr(12, 4)}-${id.substr(
    16,
    4
  )}-${id.substr(20)}`
}

const NOTION_TOKEN = process.env.NOTION_TOKEN
const DEMO_INDEX_ID = normalizeId(process.env.DEMO_INDEX_ID)
const MEMO_INDEX_ID = normalizeId(process.env.MEMO_INDEX_ID)
const BLOG_INDEX_ID = normalizeId(process.env.BLOG_INDEX_ID)
const API_ENDPOINT = 'https://www.notion.so/api/v3'
const BLOG_INDEX_CACHE = path.resolve('.blog_index_data')
const COLLECTION_VIEW_NAME = 'Publish'

module.exports = {
  NOTION_TOKEN,
  BLOG_INDEX_ID,
  DEMO_INDEX_ID,
  MEMO_INDEX_ID,
  API_ENDPOINT,
  BLOG_INDEX_CACHE,
  COLLECTION_VIEW_NAME,
}
