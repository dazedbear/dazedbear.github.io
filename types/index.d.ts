import { NextApiRequest, NextApiRequestCookies } from 'next'
import { RecordMap, SearchResults } from 'notion-types'
import { IncomingMessage, ServerResponse } from 'http'

export type NotionPageName =
  | 'article'
  | 'coding'
  | 'music-notebook'
  | string
  | string[]

export interface ErrorPageProps {
  hasError: true
}

export interface logOption {
  category: string
  message: string
  level?: 'debug' | 'info' | 'warn' | 'error'
  req?: null | GetServerSidePropsRequest
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
