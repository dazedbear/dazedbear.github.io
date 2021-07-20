import classnames from 'classnames'

const Placeholder = ({
  wrapperClassNames = '',
  itemClassNames = '',
  itemCount = 5,
}) => {
  const items = Array(itemCount)
    .fill(null)
    .map((content, index) => (
      <li
        key={`placeholder-item-${index + 1}`}
        className={classnames(
          'placeholder-item px-0 py-5',
          {
            'border-t border-gray-300': index > 0,
          },
          itemClassNames
        )}
      >
        <div className="rounded-md bg-gray-200 h-48 w-full" />
        <div className="rounded-md bg-gray-200 mt-4 h-8 w-10/12 lg:w-8/12" />
        <div className="rounded-md bg-gray-200 mt-3 h-4 w-4/12 lg:w-2/12" />
        <div className="rounded-md bg-gray-200 mt-2 h-4 w-3/12 lg:w-1/12" />
      </li>
    ))
  return (
    <ul
      className={classnames(
        'placeholder w-full animate-pulse',
        wrapperClassNames
      )}
    >
      {items}
    </ul>
  )
}

export default Placeholder
