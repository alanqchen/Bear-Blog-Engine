import { Provider as ReduxProvider } from 'react-redux';
import NextApp from 'next/app';
import { wrapper } from '../redux/store';
import Head from 'next/head';
import React from 'react';
import GoogleFonts from "next-google-fonts";
import '../assets/css/fonts.css';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { ThemeProvider as MUIThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../assets/theme/MUItheme';
import SCtheme from '../assets/theme/SCtheme';
import useScrollRestoration from "../components/utils/useScrollRestoration";

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${SCtheme.backgroundDark};
  }
`

const App = ({Component, pageProps, router}) => {
    // remove it here
    /*
    componentDidMount() {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles && jssStyles.parentNode)
        jssStyles.parentNode.removeChild(jssStyles)
    }
    */
    /*
    render() {
        const { Component, pageProps, router } = this.props;

        useScrollRestoration(router);

        return (
            <React.Fragment>
                <GoogleFonts href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
                <Head>
                    <title>Bear Post</title>
                    <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
                </Head>
                <MUIThemeProvider theme={theme}>
                    <ThemeProvider theme={SCtheme}>
                        <GlobalStyle/>
                        <CssBaseline />
                        <Component {...pageProps} />
                    </ThemeProvider>
                </MUIThemeProvider>
            </React.Fragment>
        )
    }
    */
    useScrollRestoration(router);

    return (
        <React.Fragment>
            <GoogleFonts href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
            <Head>
                <title>Bear Post</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
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
