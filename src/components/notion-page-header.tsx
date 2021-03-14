const NotionPageHeader = ({ title, publishDate, lastEditedDate, cover }) => (
  <>
    <div className="notion-title">{title}</div>
    <p>
      <span>{`${publishDate}`}</span>
      <span className="text-xs ml-2">{`(updated: ${lastEditedDate})`}</span>
    </p>
    <img
      className="notion-page-cover"
      src={cover}
      loading="lazy"
      decoding="async"
    />
  </>
)

export default NotionPageHeader
