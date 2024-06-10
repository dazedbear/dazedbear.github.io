'use client'

import Error from 'next/error'

const NotFoundPage = () => {
  return <Error statusCode={404} title="This page could not be found." />
}

export default NotFoundPage
