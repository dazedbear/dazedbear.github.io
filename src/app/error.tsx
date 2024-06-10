'use client'

import Error from 'next/error'

const ErrorPage = ({ statusCode = 500 }) => {
  return <Error statusCode={statusCode} title="This page is broken" />
}

export default ErrorPage
