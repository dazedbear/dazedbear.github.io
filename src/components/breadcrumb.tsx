import classnames from 'classnames'
import { useAppSelector, useAppDispatch } from '../libs/client/hooks'
import {
  updateNavMenuViewability,
  updateTableOfContentViewability,
} from '../libs/client/slices/layout'

const Breadcrumb = ({ title, enableToc = false }) => {
  const isNavMenuViewable = useAppSelector(
    (state) => state.layout.isNavMenuViewable
  )
  const isTableOfContentViewable = useAppSelector(
    (state) => state.layout.isTableOfContentViewable
  )
  const dispatch = useAppDispatch()

  const hamburgerLineClass =
    'w-full h-0.75 bg-gray-700 my-1 mx-0 rounded-lg transition duration-300 origin-left'
  const ellipseClass =
    'block border border-solid rounded-full box-border h-1.5 w-1.5 bg-gray-700 mx-auto my-0'
  return (
    <section
      className={classnames(
        'fixed left-0 right-0 z-980 block w-full lg:hidden',
        {
          'border-b border-gray-300':
            isNavMenuViewable || isTableOfContentViewable,
        }
      )}
    >
      <div className="relative my-0 mx-auto box-border flex max-w-1100 flex-row flex-nowrap overflow-hidden bg-gray-200 py-2 px-5">
        {/* hamburger lines */}
        <div
          className={classnames('relative mr-3 h-8 w-5', {
            invisible: isTableOfContentViewable,
          })}
        >
          <div
            className="absolute top-1 w-full"
            onClick={() => dispatch(updateNavMenuViewability())}
          >
            <div
              className={classnames(hamburgerLineClass, {
                'origin-left rotate-45': isNavMenuViewable,
              })}
            ></div>
            <div
              className={classnames(hamburgerLineClass, {
                invisible: isNavMenuViewable,
              })}
            ></div>
            <div
              className={classnames(hamburgerLineClass, {
                'origin-left -rotate-45': isNavMenuViewable,
              })}
            ></div>
          </div>
        </div>
        <h2
          className={classnames(
            'flex-grow font-semibold leading-8 text-gray-700',
            {
              invisible: isTableOfContentViewable,
            }
          )}
        >
          <i className="px-1">›</i>
          <span className="">{title}</span>
        </h2>
        {/* toc icon */}
        {enableToc && (
          <div className="relative ml-3 h-8 w-5">
            <div
              className="absolute top-2 w-full text-center"
              onClick={() => dispatch(updateTableOfContentViewability())}
            >
              <i className={classnames(ellipseClass)} />
              <i className={classnames(ellipseClass)} />
              <i className={classnames(ellipseClass)} />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Breadcrumb
