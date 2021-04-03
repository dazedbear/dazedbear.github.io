import classnames from 'classnames'
import { uuidToId } from 'notion-utils'
import { useSiteContext, SiteContextAction } from '../lib/context'
import { useTOCScrollHandler } from '../lib/hooks'

const TableOfContent = ({ toc }) => {
  const { device, dispatch, showTableOfContent } = useSiteContext()
  const { activeSectionId, updateTocActiveSectionId } = useTOCScrollHandler()
  const isMobile = device === 'smartphone'
  const tocItemClickHandler = id => {
    updateTocActiveSectionId(id)
    isMobile && dispatch(SiteContextAction('TOGGLE_TABLE_OF_CONTENT'))
  }
  return (
    <section
      className={classnames(
        'overflow-y-scroll lg:w-60 lg:ml-12 lg:mb-10 lg:mt-12 lg:mr-0 lg:px-4 lg:flex-shrink-0 lg:flex-grow-0 lg:max-h-full-viewport lg:h-full lg:border-solid lg:border-l',
        {
          block: showTableOfContent,
          hidden: !showTableOfContent,
          'fixed w-full z-990 bg-white left-0 right-0 top-0 m-0 h-full pt-40 pb-5 px-5': isMobile,
        }
      )}
    >
      <aside>
        <div>
          <nav>
            {Array.isArray(toc) &&
              toc.map((tocItem, index) => {
                const id = uuidToId(tocItem.id)
                const nextTocItem =
                  index + 2 <= toc.length ? toc[index + 1] : null
                return (
                  <a
                    key={id}
                    href={`#${id}`}
                    className={classnames('block', {
                      'mb-2':
                        nextTocItem &&
                        nextTocItem.indentLevel < tocItem.indentLevel,
                    })}
                    onClick={tocItemClickHandler.bind(this, id)}
                  >
                    <span
                      className={classnames(
                        'inline-block text-sm text-gray-500 font-normal lg:text-xs+',
                        {
                          'text-lavender-purple-300 font-semibold':
                            activeSectionId === id,
                        }
                      )}
                      style={{
                        marginLeft: tocItem.indentLevel * 16,
                      }}
                    >
                      {tocItem.text}
                    </span>
                  </a>
                )
              })}
          </nav>
        </div>
      </aside>
    </section>
  )
}

export default TableOfContent
