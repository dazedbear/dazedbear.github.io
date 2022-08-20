import classnames from 'classnames'
import { uuidToId } from 'notion-utils'
import {
  useTOCScrollHandler,
  useAppSelector,
  useAppDispatch,
} from '../libs/client/hooks'
import { updateTableOfContentViewability } from '../libs/client/slices/layout'

const TableOfContent = ({ toc }) => {
  const dispatch = useAppDispatch()
  const device = useAppSelector((state) => state.layout.device)
  const isTableOfContentViewable = useAppSelector(
    (state) => state.layout.isTableOfContentViewable
  )
  const { activeSectionId, updateTocActiveSectionId } = useTOCScrollHandler()
  const isMobile = device === 'smartphone'
  const tocItemClickHandler = (id) => {
    updateTocActiveSectionId(id)
    isMobile && dispatch(updateTableOfContentViewability())
  }
  return (
    <section
      className={classnames(
        'overflow-y-scroll lg:ml-12 lg:mb-10 lg:mt-12 lg:mr-0 lg:h-full lg:max-h-full-viewport lg:w-60 lg:shrink-0 lg:grow-0 lg:border-l lg:border-solid lg:px-4',
        {
          block: isTableOfContentViewable,
          hidden: !isTableOfContentViewable,
          'fixed left-0 right-0 top-0 z-970 m-0 h-full w-full bg-white px-5 pt-40 pb-5':
            isMobile,
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
                        'inline-block text-sm font-normal text-gray-500 lg:text-xs+',
                        {
                          'font-semibold text-lavender-purple-300':
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
