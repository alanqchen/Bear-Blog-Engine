import NextApp from 'next/app'
import Head from 'next/head';
import React from 'react'
import '../assests/css/fonts.css'
import { ThemeProvider } from 'styled-components'
import { ThemeProvider as MUIThemeProvider } from '@material-ui/core/styles';
import CssBaseline from "@material-ui/core/CssBaseline"
import theme from '../assests/theme/theme'

export default class App extends NextApp {
  // remove it here
  componentDidMount() {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles && jssStyles.parentNode)
      jssStyles.parentNode.removeChild(jssStyles)
  }

  render() {
    const { Component, pageProps } = this.props

    return (
      <React.Fragment>
        <Head>
          <title>Bear Post</title>
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        </Head>
        <MUIThemeProvider theme={theme} injectFirst>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Component {...pageProps} />
          </ThemeProvider>
        </MUIThemeProvider>
      </React.Fragment>
    )
  }
}