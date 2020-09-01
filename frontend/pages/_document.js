import React from "react";
import NextDocument, { Head, Main, NextScript } from "next/document";
import { ServerStyleSheet as StyledComponentSheets } from "styled-components";
import { ServerStyleSheets as MaterialUiServerStyleSheets } from "@material-ui/styles";
import theme from "../assets/theme/MUItheme";
import config from "../config.json";
import { GA_TRACKING_ID } from "../components/utils/gtag";

export default class Document extends NextDocument {
  render() {
    return (
      <html lang="en">
        <Head>
          {GA_TRACKING_ID && (
            <>
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());

                    gtag('config', '${GA_TRACKING_ID}', {
                      page_path: window.location.pathname,
                    });
                  `,
                }}
              />
            </>
          )}

          <meta name="application-name" content={config.blogName} />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content={config.blogName} />
          <meta name="description" content={config.blogDescription} />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="theme-color" content={theme.palette.primary.main} />

          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/static/icons/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/static/icons/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/static/icons/favicon-16x16.png"
          />
          <link
            rel="icon"
            type="image/x-icon"
            href="/static/icons/favicon.ico"
          />
          <link rel="manifest" href="/static/manifest.json" />
          <link rel="shortcut icon" href="/static/icons/favicon.ico" />
          <link
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap"
            rel="stylesheet"
          />

          <meta name="twitter:card" content="summary" />
          <meta name="twitter:url" content={config.blogURL} />
          <meta name="twitter:title" content={config.blogName} />
          <meta name="twitter:description" content={config.blogDescription} />
          <meta
            name="twitter:image"
            content={
              config.blogURL +
              "/static/icons/android/android-launchericon-192-192.png"
            }
          />
          <meta name="twitter:creator" content={config.blogName} />
          <meta property="og:type" content="website" />
          <meta property="og:title" content={config.blogName} />
          <meta property="og:description" content="Best PWA App in the world" />
          <meta property="og:site_name" content={config.blogName} />
          <meta property="og:url" content={config.blogURL} />
          <meta
            property="og:image"
            content={config.blogURL + "/static/icons/apple-touch-icon.png"}
          />
        </Head>
        <body content={theme.palette.background}>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

Document.getInitialProps = async (ctx) => {
  const styledComponentSheet = new StyledComponentSheets();
  const materialUiSheets = new MaterialUiServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  try {
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) =>
          styledComponentSheet.collectStyles(
            materialUiSheets.collect(<App {...props} />)
          ),
      });

    const initialProps = await NextDocument.getInitialProps(ctx);

    return {
      ...initialProps,
      styles: [
        <React.Fragment key="styles">
          {initialProps.styles}
          {materialUiSheets.getStyleElement()}
          {styledComponentSheet.getStyleElement()}
        </React.Fragment>,
      ],
    };
  } finally {
    styledComponentSheet.seal();
  }
};
