import ExtLink from '../components/ext-link'
import { meta } from '../lib/site.config'

const GridBlock = ({ content, image, title }) => (
  <div className="blockElement alignCenter imageAlignTop threeByGridBlock">
    <div className="blockImage">
      <img src={image} />
    </div>
    <div className="blockContent">
      <h2>
        <div>
          <span>
            <p>{title}</p>
          </span>
        </div>
      </h2>
      <div>
        <span>
          <p>{content}</p>
        </span>
      </div>
    </div>
  </div>
)

const BlockLayout = ({ items = [] }) => (
  <div className="container feature-topic paddingBottom paddingTop">
    <div className="wrapper">
      <div className="gridBlock">
        {items.map(props => (
          <GridBlock key={props.title} {...props} />
        ))}
      </div>
    </div>
  </div>
)

const Homepage = () => (
  <>
    <div className="homeContainer">
      <div className="homeSplashFade">
        <div className="wrapper homeWrapper">
          <div>
            <h2 className="projectTitle">
              {meta.title}
              <small>{meta.description}</small>
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
            <p className="unsplash-hint">
              Photo by
              <ExtLink href="https://unsplash.com/photos/ai4lpAIt7EU">
                The Creative Exchange
              </ExtLink>
              on
              <ExtLink href="https://unsplash.com/">Unsplash</ExtLink>.
            </p>
          </div>
        </div>
      </div>
    </div>
  </>
)

export default Homepage
