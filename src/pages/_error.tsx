import Error from 'next/error'
import { logOption } from '../../types'
import log from '../libs/server/log'
import { showCommonPage } from '../libs/server/page'
import { PAGE_TYPE_ERROR_PAGE } from '../libs/constant'

export const getServerSideProps = async ({ req, res, err }) => {
  if (err) {
    const options: logOption = {
      category: PAGE_TYPE_ERROR_PAGE,
      message: err,
      level: 'error',
      req,
    }
    log(options)
  }
  return showCommonPage(req, res, 'error', req.url.split('/'))
}

const ErrorPage = ({ statusCode = 500 }) => {
  return <Error statusCode={statusCode} title="This page is broken" />
}

export default ErrorPage
