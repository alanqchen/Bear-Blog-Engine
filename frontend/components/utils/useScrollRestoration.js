import { useEffect } from 'react';

import Router from 'next/router';

function saveScrollPos(url) {
    const scrollPos = { x: window.scrollX, y: window.scrollY };
    sessionStorage.setItem(url, JSON.stringify(scrollPos));
}

function restoreScrollPos(url) {
    const scrollPos = JSON.parse(sessionStorage.getItem(url));
    if (scrollPos) {
        window.scrollTo(scrollPos.x, scrollPos.y);
    }
}

export default function useScrollRestoration(router) {
    useEffect(() => {
        if ('scrollRestoration' in window.history) {
            let shouldScrollRestore = false;
            window.history.scrollRestoration = 'manual';
            restoreScrollPos(router.asPath);

            const onBeforeUnload = event => {
                saveScrollPos(router.asPath);
                delete event['returnValue'];
            };

            const onRouteChangeStart = () => {
                saveScrollPos(router.asPath);
            };

            const onRouteChangeComplete = url => {
                if (shouldScrollRestore) {
                    shouldScrollRestore = false;
                    restoreScrollPos(url);
                }
            };

            window.addEventListener('beforeunload', onBeforeUnload);
            Router.events.on('routeChangeStart', onRouteChangeStart);
            Router.events.on('routeChangeComplete', onRouteChangeComplete);
            Router.beforePopState(() => {
                shouldScrollRestore = true;
                return true;
            });

            return () => {
                window.removeEventListener('beforeunload', onBeforeUnload);
                Router.events.off('routeChangeStart', onRouteChangeStart);
                Router.events.off('routeChangeComplete', onRouteChangeComplete);
                Router.beforePopState(() => true);
            };
        }
    }, [router]);
}
