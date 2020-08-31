import React from 'react';
import { wrapper } from '../redux/store';
import Head from 'next/head';
import Router from 'next/router'
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { ThemeProvider as MUIThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../assets/theme/MUItheme';
import SCtheme from '../assets/theme/SCtheme';
import useScrollRestoration from '../components/utils/useScrollRestoration';
import { RouteIndicator } from '../components/Theme/routeIndicator';
import * as gtag from '../components/utils/gtag';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${SCtheme.backgroundDark};
  }
`

Router.events.on('routeChangeComplete', (url) => gtag.pageview(url));

const App = ({Component, pageProps, router}) => {

    useScrollRestoration(router);

    return (
        <React.Fragment>
            <Head>
                <title>Bear Post</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
                <link rel="preconnect" href="https://fonts.gstatic.com/" crossOrigin="true" />
                <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_URL} crossOrigin="true" />
            </Head>
            <MUIThemeProvider theme={theme}>
                <ThemeProvider theme={SCtheme}>
                    <GlobalStyle />
                    <CssBaseline />
                    <RouteIndicator />
                    <Component {...pageProps} />
                </ThemeProvider>
            </MUIThemeProvider>
        </React.Fragment>
    );
}

export default wrapper.withRedux(App);
