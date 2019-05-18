const React = require("react");

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    const docsUrl = this.props.config.docsUrl;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ""}`;
    const langPart = `${language ? `${language}/` : ""}`;
    return `${baseUrl}${docsPart}${langPart}${doc}`;
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? `${language}/` : "") + doc;
  }

  render() {
    const {
      copyright = '',
      github,
      githubProfileBaseUrl = '',
      githubUserName = '',
      linkedin,
      linkedinProfileBaseUrl = '',
      linkedinUserName = '',
      soundcloud,
      soundcloudProfileBaseUrl = '',
      soundcloudUserName = '',
      youtube,
      youtubeChannelBaseUrl = '',
      youtubeChannelHash = '',
    } = this.props.config;
    return (
      <footer className="nav-footer" id="footer">
        <section className="community">
          {
            github && (
              <div className="community__tab">
                <a
                  href={`${githubProfileBaseUrl}/${githubUserName}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="community__tab-link"
                >
                  <i className="fab fa-github fa-3x community__tab-icon" />
                  <p className="community__tab-name">Github</p>
                </a>
              </div>
            )
          }
          {
            linkedin && (
              <div className="community__tab">
                <a
                  href={`${linkedinProfileBaseUrl}/${linkedinUserName}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="community__tab-link"
                >
                  <i className="fab fa-linkedin fa-3x community__tab-icon" />
                  <p className="community__tab-name">Linkedin</p>
                </a>
              </div>
            )
          }
          {
            soundcloud && (
              <div className="community__tab">
                <a
                  href={`${soundcloudProfileBaseUrl}/${soundcloudUserName}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="community__tab-link"
                >
                  <i className="fab fa-soundcloud fa-3x community__tab-icon" />
                  <p className="community__tab-name">SoundCloud</p>
                </a>
              </div>
            )
          }
          {
            youtube && (
              <div className="community__tab">
                <a
                  href={`${youtubeChannelBaseUrl}/${youtubeChannelHash}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="community__tab-link"
                >
                  <i className="fab fa-youtube fa-3x community__tab-icon" />
                  <p className="community__tab-name">YouTube</p>
                </a>
              </div>
            )
          }
        </section>
        <section className="copyright">{copyright}</section>
      </footer>
    );
  }
}

module.exports = Footer;
