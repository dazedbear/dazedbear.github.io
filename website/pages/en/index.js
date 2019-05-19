/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const { Container, GridBlock } = require('../../core/CompLibrary.js');

const Block = props => (
  <Container
    padding={['bottom', 'top']}
    id={props.id}
    background={props.background}>
    <GridBlock
      align="center"
      contents={props.children}
      layout={props.layout}
    />
  </Container>
);

const Index = props => {
  const {config: siteConfig} = props;
  const {baseUrl, tagline, title, } = siteConfig;

  return (
    <React.Fragment>
      <div className="homeContainer">
        <div className="homeSplashFade">
          <div className="wrapper homeWrapper">
            <div className="inner">
              <h2 className="projectTitle">
                {title}
                <small>{tagline}</small>
              </h2>
              <Block layout="threeColumn">
                {[
                  {
                    content: '關注前端工程技術與工具、軟體開發方法、團隊協作 ... 等主題，期許使用 JavaScript 在各種裝置上開發產品！',
                    image: `${baseUrl}img/web.png`,
                    imageAlign: 'top',
                    title: 'Web Development',
                  },
                  {
                    content: '關注作曲、數位編曲、影視遊戲配樂、聲音合成、音樂科技產品與開發 ... 等主題，科技能夠為音樂創作帶來更多可能性！',
                    image: `${baseUrl}img/sibelius.png`,
                    imageAlign: 'top',
                    title: 'Digital Music',
                  },
                  {
                    content: '關注如何提升工作效率、自主學習方法、時間管理方法、目標追蹤 ... 等主題，在這瞬息萬變的時代更需要掌握這些技能！',
                    image: `${baseUrl}img/gtd.png`,
                    imageAlign: 'top',
                    title: 'Self Development',
                  },
                ]}
              </Block>
              <p className="unsplash-hint">
                Photo by
                <a
                  href="https://unsplash.com/photos/ai4lpAIt7EU"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  The Creative Exchange
                </a>
                on
                <a
                  href="https://unsplash.com/"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Unsplash
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

module.exports = Index;
