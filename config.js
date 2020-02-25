const config = {
  gatsby: {
    pathPrefix: '/',
    siteUrl: 'https://cratebind-developer-handbook.netlify.com/',
    gaTrackingId: null,
    trailingSlash: false,
  },
  header: {
    logo: 'https://cratebind.com/cratebind-map-marker.svg',
    logoLink: 'https://cratebind-developer-handbook.netlify.com/',
    title: 'Cratebind Dev Handbook',
    githubUrl: 'https://github.com/cratebind/developer-handbook',
    helpUrl: '',
    tweetText: '',
    links: [{ text: '', link: '' }],
    search: {
      enabled: false,
      indexName: '',
      algoliaAppId: process.env.GATSBY_ALGOLIA_APP_ID,
      algoliaSearchKey: process.env.GATSBY_ALGOLIA_SEARCH_KEY,
      algoliaAdminKey: process.env.ALGOLIA_ADMIN_KEY,
    },
  },
  sidebar: {
    forcedNavOrder: [
      '/introduction', // add trailing slash if enabled above
      '/codeblock',
    ],
    collapsedNav: [
      '/codeblock', // add trailing slash if enabled above
    ],
    // links: [{ text: 'Hasura', link: 'https://hasura.io' }],
    links: [],
    frontline: false,
    ignoreIndex: true,
  },
  siteMetadata: {
    title: 'Cratebind Developer Handbook',
    description: 'Cratebind Developer Handbook',
    ogImage: null,
    docsLocation:
      'https://github.com/hasura/gatsby-gitbook-boilerplate/tree/master/content',
    favicon: 'https://graphql-engine-cdn.hasura.io/img/hasura_icon_black.svg',
  },
  pwa: {
    enabled: false, // disabling this will also remove the existing service worker.
    manifest: {
      name: 'Cratebind Developer Handbook',
      short_name: 'CratebindDevHandbook',
      start_url: '/',
      background_color: '#6b37bf',
      theme_color: '#6b37bf',
      display: 'standalone',
      crossOrigin: 'use-credentials',
      icons: [
        {
          src: 'src/pwa-512.png',
          sizes: `512x512`,
          type: `image/png`,
        },
      ],
    },
  },
};

module.exports = config;
