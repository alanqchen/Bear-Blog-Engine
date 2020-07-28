import Router from 'next/router'
import React from 'react'
import { LoadingProgress } from '../Posts/Page/pageStyled'

const DONE_DURATION = 250

export const RouteIndicator = () => {
    const [loading, setLoading] = React.useState(null);
    const [timeoutId, setTimeoutId] = React.useState(null);

    const onLoad = () => setLoading(true);
    const onDone = () => {
        setLoading(false);
        setTimeoutId(
            setTimeout(() => {
            setTimeoutId(null)
            setLoading(null)
            }, DONE_DURATION)
        );
    }

  React.useEffect(() => {
    Router.events.on('routeChangeStart', onLoad)
    Router.events.on('routeChangeComplete', onDone)
    Router.events.on('routeChangeError', onDone)

    return () => {
        Router.events.off('routeChangeStart', onLoad)
        Router.events.off('routeChangeComplete', onDone)
        Router.events.off('routeChangeError', onDone)
    }
  })

  React.useEffect(
    () => () => {
      if (timeoutId) clearTimeout(timeoutId)
    },
    [timeoutId]
  );

  return (
    <>
        {loading && <LoadingProgress />}
    </>
  );
}
