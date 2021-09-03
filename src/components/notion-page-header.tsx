import Image from 'next/image'
import { notion } from '../../site.config'

/**
 * To align the page cover lazy load from react-notion-x
 * @see https://github.com/NotionX/react-notion-x/blob/be5a0d39cc11538d90b1fba4410cf6aaa0001d64/packages/react-notion-x/src/components/lazy-image.tsx
 */
const PageCover = ({ alt = '', cover, recordMap }) => {
  const previewImage = notion.previeImages.enable
    ? recordMap?.preview_images?.[cover]
    : null

  if (previewImage) {
    const aspectRatio = previewImage.originalHeight / previewImage.originalWidth
    return (
      <div
        className="w-full rounded-md relative"
        style={{
          paddingBottom: `${aspectRatio * 100}%`,
        }}
      >
        <Image
          alt={alt}
          blurDataURL={previewImage.dataURIBase64}
          className="notion-page-cover absolute rounded-md"
          src={cover}
          layout="fill"
          placeholder="blur"
        />
      </div>
    )
  }
  return (
    // use <img> intentionally since we dont know the actual size of pictures without pre-process
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} className="notion-page-cover rounded-md" src={cover} />
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
    <PageCover cover={cover} recordMap={recordMap} alt={title} />
  </>
)

export default NotionPageHeader
