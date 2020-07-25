import { Provider as ReduxProvider } from 'react-redux';
import NextApp from 'next/app'
import { wrapper } from '../redux/store';
import Head from 'next/head';
import React from 'react';
import '../assets/css/fonts.css';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { ThemeProvider as MUIThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../assets/theme/MUItheme';
import SCtheme from '../assets/theme/SCtheme';
import useScrollRestoration from '../components/utils/useScrollRestoration';
import config from '../config.json';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${SCtheme.backgroundDark};
  }
`

const App = ({Component, pageProps, router}) => {
    
    useScrollRestoration(router);

    return (
        <React.Fragment>
            <Head>
                <title>Bear Post</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
                <link rel="preconnect" href="https://fonts.gstatic.com/" crossorigin />
                <link rel="preconnect" href={config.apiURL} crossorigin />
            </Head>
            <MUIThemeProvider theme={theme}>
                <ThemeProvider theme={SCtheme}>
                    <GlobalStyle/>
                    <CssBaseline />
                    <Component {...pageProps} />
                </ThemeProvider>
            </MUIThemeProvider>
        </React.Fragment>
    );
}

export default wrapper.withRedux(App);
