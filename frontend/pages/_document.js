import React from 'react'
import NextDocument, { Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet as StyledComponentSheets } from 'styled-components'
import { ServerStyleSheets as MaterialUiServerStyleSheets } from '@material-ui/styles'
import theme from '../assets/theme/MUItheme'
import SCtheme from '../assets/theme/SCtheme'

export default class Document extends NextDocument {
  render() {
    return (
      <html lang="en">
        <Head>
          {/* PWA primary color */}
          <meta name="theme-color" content={theme.palette.primary.main} />
          <link rel="icon" type="image/x-icon" href="/static/favicon.ico" />
        </Head>
        <body content={theme.palette.background}>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

Document.getInitialProps = async ctx => {
  const styledComponentSheet = new StyledComponentSheets()
  const materialUiSheets = new MaterialUiServerStyleSheets()
  const originalRenderPage = ctx.renderPage

  try {
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: App => props =>
          styledComponentSheet.collectStyles(
            materialUiSheets.collect(<App {...props} />),
          ),
      })

    const initialProps = await NextDocument.getInitialProps(ctx)

    return {
      ...initialProps,
      styles: [
        <React.Fragment key="styles">
          {initialProps.styles}
          {materialUiSheets.getStyleElement()}
          {styledComponentSheet.getStyleElement()}
        </React.Fragment>,
      ],
    }
  } finally {
    styledComponentSheet.seal()
  }
}
