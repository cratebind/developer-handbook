import React from 'react';
import Helmet from 'react-helmet';
import { graphql } from 'gatsby';
import MDXRenderer from 'gatsby-plugin-mdx/mdx-renderer';
import styled from '@emotion/styled';
import { Layout } from '$components';
import { inlineMdx } from 'gatsby-tinacms-mdx';
import { Wysiwyg } from '@tinacms/fields';
import { TinaField } from '@tinacms/form-builder';

import NextPrevious from '../components/NextPrevious';
import '../components/styles.css';
import config from '../../config';

const forcedNavOrder = config.sidebar.forcedNavOrder;

const StyledEditor = styled(Wysiwyg)`
  p {
    margin: 16px 0px 32px;
  }

  h1 {
    font-size: 26px;
    font-weight: 800;
    line-height: 1.5;
    margin-bottom: 16px;
    margin-top: 32px;
  }

  h2 {
    font-size: 24px;
    font-weight: 700;
    line-height: 1.5;
    margin-bottom: 16px;
    margin-top: 32px;
  }

  h3 {
    font-size: 20px;
    font-weight: 600;
    line-height: 1.5;
    margin-bottom: 16px;
    margin-top: 32px;
  }

  h4 {
    font-size: 18px;
    font-weight: 500;
    line-height: 1.5;
    margin-bottom: 16px;
    margin-top: 32px;
  }

  h5 {
    font-size: 16px;
    font-weight: 400;
    line-height: 1.5;
    margin-bottom: 16px;
    margin-top: 32px;
  }

  h6 {
    font-size: 14px;
    font-weight: 300;
    line-height: 1.5;
    margin-bottom: 16px;
    margin-top: 32px;
  }
`;

// const StyledEditor = (props) => <Wysiwyg {...props} styleProps={editorStyles} />

const Edit = styled('div')`
  padding: 1rem 1.5rem;
  text-align: right;

  button {
    font-size: 14px;
    font-weight: 500;
    line-height: 1em;
    text-decoration: none;
    color: #555;
    border: 1px solid rgb(211, 220, 228);
    cursor: pointer;
    border-radius: 3px;
    transition: all 0.2s ease-out 0s;
    text-decoration: none;
    color: rgb(36, 42, 49);
    background-color: rgb(255, 255, 255);
    box-shadow: rgba(116, 129, 141, 0.1) 0px 1px 1px 0px;
    height: 30px;
    padding: 5px 16px;
    &:hover {
      background-color: rgb(245, 247, 249);
    }
  }
`;

const MDXRuntimeTest = ({ isEditing, setIsEditing, ...props }) => {
  const { data } = props;

  // if(!data) {
  //   return null;
  // }
  const {
    allMdx,
    mdx,
    site: {
      siteMetadata: { docsLocation, title },
    },
  } = data;

  const navItems = allMdx.edges
    .map(({ node }) => node.fields.slug)
    .filter(slug => slug !== '/')
    .sort()
    .reduce(
      (acc, cur) => {
        if (forcedNavOrder.find(url => url === cur)) {
          return { ...acc, [cur]: [cur] };
        }

        let prefix = cur.split('/')[1];
        if (config.gatsby && config.gatsby.trailingSlash) {
          prefix = prefix + '/';
        }

        if (prefix && forcedNavOrder.find(url => url === `/${prefix}`)) {
          return { ...acc, [`/${prefix}`]: [...acc[`/${prefix}`], cur] };
        } else {
          return { ...acc, items: [...acc.items, cur] };
        }
      },
      { items: [] }
    );

  const nav = forcedNavOrder
    .reduce((acc, cur) => {
      return acc.concat(navItems[cur]);
    }, [])
    .concat(navItems.items)
    .map(slug => {
      if (slug) {
        const { node } = allMdx.edges.find(
          ({ node }) => node.fields.slug === slug
        );

        return { title: node.fields.title, url: node.fields.slug };
      }
    });

  // meta tags
  const metaTitle = mdx.frontmatter.metaTitle;
  const metaDescription = mdx.frontmatter.metaDescription;
  let canonicalUrl = config.gatsby.siteUrl;
  canonicalUrl =
    config.gatsby.pathPrefix !== '/'
      ? canonicalUrl + config.gatsby.pathPrefix
      : canonicalUrl;
  canonicalUrl = canonicalUrl + mdx.fields.slug;

  return (
    <Layout {...props}>
      <Helmet>
        {metaTitle ? <title>{metaTitle}</title> : null}
        {metaTitle ? <meta name="title" content={metaTitle} /> : null}
        {metaDescription ? (
          <meta name="description" content={metaDescription} />
        ) : null}
        {metaTitle ? <meta property="og:title" content={metaTitle} /> : null}
        {metaDescription ? (
          <meta property="og:description" content={metaDescription} />
        ) : null}
        {metaTitle ? (
          <meta property="twitter:title" content={metaTitle} />
        ) : null}
        {metaDescription ? (
          <meta property="twitter:description" content={metaDescription} />
        ) : null}
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>
      <div className={'titleWrapper'}>
        <h1 className={'title'}>{mdx.fields.title}</h1>
        {process.env.NODE_ENV === 'production' && (
          <Edit className={'mobileView'}>
            <button
              className={'gitBtn'}
              onClick={() => setIsEditing(prev => !prev)}
            >
              {isEditing ? 'Save' : 'Edit'}
            </button>
          </Edit>
        )}
      </div>
      <div className={'mainWrapper'}>
        <TinaField name="rawMdxBody" Component={StyledEditor}>
          <MDXRenderer>{mdx.body}</MDXRenderer>
        </TinaField>
      </div>
      <div className={'addPaddTopBottom'}>
        <NextPrevious mdx={mdx} nav={nav} />
      </div>
    </Layout>
  );
};

export default inlineMdx(MDXRuntimeTest);
// export default MDXRuntimeTest;

export const pageQuery = graphql`
  query($id: String!) {
    site {
      siteMetadata {
        title
        docsLocation
      }
    }
    mdx(fields: { id: { eq: $id } }) {
      ...TinaMdx
      fields {
        id
        title
        slug
      }
      body
      tableOfContents
      parent {
        ... on File {
          relativePath
        }
      }
      frontmatter {
        metaTitle
        metaDescription
      }
    }
    allMdx {
      edges {
        node {
          fields {
            slug
            title
          }
        }
      }
    }
  }
`;
