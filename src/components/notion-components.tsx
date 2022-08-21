import dynamic from 'next/dynamic'
import Link from 'next/link'

const NotionComponentMap: object = {
  Code: dynamic(() =>
    import('react-notion-x/build/third-party/code').then(
      (notion) => notion.Code
    )
  ),
  Collection: dynamic(() =>
    import('react-notion-x/build/third-party/collection').then(
      (notion) => notion.Collection
    )
  ),
  Equation: () => null, // we don't have math equation in articles, so we don't need this
  Modal: dynamic(
    () =>
      import('react-notion-x/build/third-party/modal').then(
        (notion) => notion.Modal
      ),
    {
      ssr: false,
    }
  ),
  PageLink: (props) => (
    <Link {...props}>
      <a {...props} />
    </Link>
  ),
  Pdf: dynamic(
    () =>
      import('react-notion-x/build/third-party/pdf').then(
        (notion) => notion.Pdf
      ),
    {
      ssr: false,
    }
  ),
  Tweet: () => null,
}

export default NotionComponentMap
