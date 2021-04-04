import classnames from 'classnames'
import { useSiteContext, SiteContextAction } from '../libs/client/context'

const Breadcrumb = ({ title, enableToc = false }) => {
  const { showNavMenu, showTableOfContent, dispatch } = useSiteContext()
  const hamburgerLineClass =
    'w-full h-0.75 bg-gray-700 my-1 mx-0 rounded-lg transition duration-300 origin-left'
  const ellipseClass =
    'block border border-solid rounded-full box-border h-1.5 w-1.5 bg-gray-700 mx-auto my-0'
  return (
    <section
      className={classnames(
        'fixed w-full left-0 right-0 z-1000 block lg:hidden',
        { 'border-b border-gray-300': showNavMenu || showTableOfContent }
      )}
    >
      <div className="max-w-1100 py-2 px-5 my-0 mx-auto relative bg-gray-200 flex flex-row flex-nowrap box-border overflow-hidden">
        {/* hamburger lines */}
        <div
          className={classnames('h-8 w-5 mr-3 relative', {
            invisible: showTableOfContent,
          })}
        >
          <div
            className="absolute top-1 w-full"
            onClick={() => dispatch(SiteContextAction('TOGGLE_NAV_MENU'))}
          >
            <div
              className={classnames(hamburgerLineClass, {
                'origin-left transform rotate-45': showNavMenu,
              })}
            ></div>
            <div
              className={classnames(hamburgerLineClass, {
                invisible: showNavMenu,
              })}
            ></div>
            <div
              className={classnames(hamburgerLineClass, {
                'origin-left transform -rotate-45': showNavMenu,
              })}
            ></div>
          </div>
        </div>
        <h2
          className={classnames(
            'flex-grow font-semibold leading-8 text-gray-700',
            {
              invisible: showTableOfContent,
            }
          )}
        >
          <i className="px-1">›</i>
          <span className="">{title}</span>
        </h2>
        {/* toc icon */}
        {enableToc && (
          <div className="h-8 w-5 ml-3 relative">
            <div
              className="absolute top-2 w-full text-center"
              onClick={() =>
                dispatch(SiteContextAction('TOGGLE_TABLE_OF_CONTENT'))
              }
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
