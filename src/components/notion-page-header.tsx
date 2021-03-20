import { LazyImageFull, ImageState } from 'react-lazy-images'
import classnames from 'classnames'
import { notion } from '../lib/site.config'

/**
 * To align the page cover lazy load from react-notion-x
 * @see https://github.com/NotionX/react-notion-x/blob/be5a0d39cc11538d90b1fba4410cf6aaa0001d64/packages/react-notion-x/src/components/lazy-image.tsx
 */
const PageCover = ({ cover, recordMap }) => {
  const previewImage = notion.previeImages.enable
    ? recordMap?.preview_images?.[cover]
    : null

  if (previewImage) {
    const aspectRatio = previewImage.originalHeight / previewImage.originalWidth
    return (
      <LazyImageFull src={cover}>
        {({ imageState, ref }) => {
          return (
            <div
              className={classnames('lazy-image-wrapper w-full rounded-md', {
                'lazy-image-loaded': imageState === ImageState.LoadSuccess,
              })}
              style={{
                paddingBottom: `${aspectRatio * 100}%`,
              }}
            >
              <img
                src={previewImage.dataURIBase64}
                ref={ref}
                className="notion-page-cover lazy-image-preview rounded-md"
                width={previewImage.originalWidth}
                height={previewImage.originalHeight}
                decoding="async"
              />

              <img
                src={cover}
                ref={ref}
                className="notion-page-cover lazy-image-real absolute rounded-md"
                width={previewImage.originalWidth}
                height={previewImage.originalHeight}
                decoding="async"
                loading="lazy"
              />
            </div>
          )
        }}
      </LazyImageFull>
    )
  }
  return (
    <img
      className="notion-page-cover"
      src={cover}
      loading="lazy"
      decoding="async"
    />
  )
}

const NotionPageHeader = ({
  title,
  publishDate,
  lastEditedDate,
  cover,
  recordMap,
}) => (
  <>
    <div className="notion-title">{title}</div>
    <p>
      <span>{`${publishDate}`}</span>
      <span className="text-xs ml-2">{`(updated: ${lastEditedDate})`}</span>
    </p>
    <PageCover cover={cover} recordMap={recordMap} />
  </>
)

export default NotionPageHeader
