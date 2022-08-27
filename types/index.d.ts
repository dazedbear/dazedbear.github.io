import { NextApiRequest, NextApiRequestCookies } from 'next'
import { RecordMap, SearchResults } from 'notion-types'
import { IncomingMessage, ServerResponse } from 'http'

export type NotionPageName = 'article' | 'coding' | 'music' | 'about' | string

export interface ErrorPageProps {
  hasError: true
}

export type logLevel = 'debug' | 'info' | 'warn' | 'error'

export interface logOption {
  category: string
  message: string | object
  level?: logLevel
  req?: null | GetServerSidePropsRequest | any
}

export interface PreviewImagesMap {
  [image_url: string]: string
}

export interface ExtendRecordMap extends RecordMap {
  preview_images?: PreviewImagesMap
}

export interface ExtendSearchResults extends SearchResults {
  recordMap: ExtendRecordMap
  allPosts?: ExtendRecordMap
}

export interface MenuItem {
  label: string
  url: string
}

export interface GetServerSidePropsRequest extends IncomingMessage {
  cookies: NextApiRequestCookies
}

export interface GetServerSidePropsResponse extends ServerResponse {}

export interface ArticleStream {
  content?: object
  ids?: string[]
  hasNext?: boolean
  index?: number
  total?: number
}

export interface SinglePage {}

export type CacheClientServingStatus =
  | 'default'
  | 'initializing'
  | 'running'
  | 'terminated'

export interface PageMeta {
  title?: string
  description?: string
  image?: string
}
