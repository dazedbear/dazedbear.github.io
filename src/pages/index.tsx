import ExtLink from '../components/ext-link'
import { meta } from '../../site.config'

const GridBlock = ({ content, image, title }) => (
  <div className="box-border text-center md:flex-1-0-26 md:mx-3  blockElement alignCenter imageAlignTop threeByGridBlock">
    <div className="mb-5 mx-auto max-w-150 min-h-100 md:min-h-150 relative block-image blockImage">
      <img className="max-w-full inline-block align-middle" src={image} />
    </div>
    <div className="blockContent">
      <h2 className="text-center">
        <div>
          <span>
            <p className="p-0 text-2xl mb-6">{title}</p>
          </span>
        </div>
      </h2>
      <div className="text-left">
        <span>
          <p className="mb-4">{content}</p>
        </span>
      </div>
    </div>
  </div>
)

const BlockLayout = ({ items = [] }) => (
  <div className="pb-10 pt-5 my-0 mx-auto md:pb-20 md:pt-20 bg-opacity-white-75 rounded-xl container feature-topic paddingBottom paddingTop">
    <div className="my-0 mx-auto max-w-900 py-0 px-5 text-gray-600 font-semibold wrapper">
      <div className="p-0 md:flex md:flex-wrap md:flex-row gridBlock">
        {items.map(props => (
          <GridBlock key={props.title} {...props} />
        ))}
      </div>
    </div>
  </div>
)

const Homepage = () => (
  <div className="text-center homeContainer">
    <div
      className="min-h-screen pt-24 lg:pt-12 bg-cover bg-50% homeSplashFade"
      style={{ backgroundImage: "url('/cover.jpg')" }}
    >
      <div className="my-0 mx-auto max-w-1100 py-8 px-2.5 wrapper homeWrapper">
        <div>
          <h2 className="block text-lavender-purple-300 text-4.5xl md:text-5xl font-semibold  mt-2 mb-6 mx-0 projectTitle">
            {meta.title}
            <small className="block font-normal text-xl md:text-2xl mt-3 mb-5 mx-0">
              {meta.description}
            </small>
          </h2>
          <BlockLayout
            items={[
              {
                content:
                  '關注前端工程技術與工具、軟體開發方法、團隊協作 ... 等主題，期許使用 JavaScript 在各種裝置上開發產品！',
                image: `/web.png`,
                imageAlign: 'top',
                title: 'Web Development',
              },
              {
                content:
                  '關注作曲、數位編曲、影視遊戲配樂、聲音合成、音樂科技產品與開發 ... 等主題，科技能夠為音樂創作帶來更多可能性！',
                image: `/sibelius.png`,
                imageAlign: 'top',
                title: 'Digital Music',
              },
              {
                content:
                  '關注如何提升工作效率、自主學習方法、時間管理方法、目標追蹤 ... 等主題，在這瞬息萬變的時代更需要掌握這些技能！',
                image: `/gtd.png`,
                imageAlign: 'top',
                title: 'Self Development',
              },
            ]}
          />
          <p className="my-4 mx-0 text-center text-gray-300 text-sm unsplash-hint">
            Photo by
            <ExtLink
              className="inline-block my-0 mx-1 font-bold text-yellow-300"
              href="https://unsplash.com/photos/ai4lpAIt7EU"
            >
              The Creative Exchange
            </ExtLink>
            on
            <ExtLink
              className="inline-block my-0 mx-1 font-bold text-yellow-300"
              href="https://unsplash.com/"
            >
              Unsplash
            </ExtLink>
            .
          </p>
        </div>
      </div>
    </div>
  </div>
)

export default Homepage
