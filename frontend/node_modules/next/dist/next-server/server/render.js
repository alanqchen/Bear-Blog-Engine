"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const server_1 = require("react-dom/server");
const mitt_1 = __importDefault(require("../lib/mitt"));
const utils_1 = require("../lib/utils");
const head_1 = __importStar(require("../lib/head"));
// @ts-ignore types will be added later as it's an internal module
const loadable_1 = __importDefault(require("../lib/loadable"));
const loadable_context_1 = require("../lib/loadable-context");
const router_context_1 = require("../lib/router-context");
const get_page_files_1 = require("./get-page-files");
const amp_context_1 = require("../lib/amp-context");
const optimize_amp_1 = __importDefault(require("./optimize-amp"));
const amp_1 = require("../lib/amp");
const is_dynamic_1 = require("../lib/router/utils/is-dynamic");
const constants_1 = require("../../lib/constants");
const constants_2 = require("../lib/constants");
function noRouter() {
    const message = 'No router instance found. you should only use "next/router" inside the client side of your app. https://err.sh/zeit/next.js/no-router-instance';
    throw new Error(message);
}
class ServerRouter {
    constructor(pathname, query, as) {
        this.route = pathname.replace(/\/$/, '') || '/';
        this.pathname = pathname;
        this.query = query;
        this.asPath = as;
    }
    push() {
        noRouter();
    }
    replace() {
        noRouter();
    }
    reload() {
        noRouter();
    }
    back() {
        noRouter();
    }
    prefetch() {
        noRouter();
    }
    beforePopState() {
        noRouter();
    }
}
// TODO: Remove in the next major version, as this would mean the user is adding event listeners in server-side `render` method
ServerRouter.events = mitt_1.default();
function enhanceComponents(options, App, Component) {
    // For backwards compatibility
    if (typeof options === 'function') {
        return {
            App,
            Component: options(Component),
        };
    }
    return {
        App: options.enhanceApp ? options.enhanceApp(App) : App,
        Component: options.enhanceComponent
            ? options.enhanceComponent(Component)
            : Component,
    };
}
function render(renderElementToString, element, ampMode) {
    let html;
    let head;
    try {
        html = renderElementToString(element);
    }
    finally {
        head = head_1.default.rewind() || head_1.defaultHead(amp_1.isInAmpMode(ampMode));
    }
    return { html, head };
}
function renderDocument(Document, { props, docProps, pathname, query, buildId, canonicalBase, assetPrefix, runtimeConfig, nextExport, autoExport, dynamicImportsIds, dangerousAsPath, hasCssMode, err, dev, ampPath, ampState, inAmpMode, hybridAmp, staticMarkup, devFiles, files, polyfillFiles, dynamicImports, htmlProps, bodyTags, headTags, }) {
    return ('<!DOCTYPE html>' +
        server_1.renderToStaticMarkup(react_1.default.createElement(amp_context_1.AmpStateContext.Provider, { value: ampState }, Document.renderDocument(Document, Object.assign({ __NEXT_DATA__: {
                props,
                page: pathname,
                query,
                buildId,
                assetPrefix: assetPrefix === '' ? undefined : assetPrefix,
                runtimeConfig,
                nextExport,
                autoExport,
                dynamicIds: dynamicImportsIds.length === 0 ? undefined : dynamicImportsIds,
                err: err ? serializeError(dev, err) : undefined,
            }, dangerousAsPath,
            canonicalBase,
            ampPath,
            inAmpMode, isDevelopment: !!dev, hasCssMode,
            hybridAmp,
            staticMarkup,
            devFiles,
            files,
            polyfillFiles,
            dynamicImports,
            assetPrefix,
            htmlProps,
            bodyTags,
            headTags }, docProps)))));
}
async function renderToHTML(req, res, pathname, query, renderOpts) {
    pathname = pathname === '/index' ? '/' : pathname;
    const { err, dev = false, documentMiddlewareEnabled = false, staticMarkup = false, ampPath = '', App, Document, pageConfig = {}, DocumentMiddleware, Component, buildManifest, reactLoadableManifest, ErrorDebug, unstable_getStaticProps, unstable_getStaticPaths, } = renderOpts;
    const callMiddleware = async (method, args, props = false) => {
        let results = props ? {} : [];
        if (Document[`${method}Middleware`]) {
            let middlewareFunc = await Document[`${method}Middleware`];
            middlewareFunc = middlewareFunc.default || middlewareFunc;
            const curResults = await middlewareFunc(...args);
            if (props) {
                for (const result of curResults) {
                    results = Object.assign(Object.assign({}, results), result);
                }
            }
            else {
                results = curResults;
            }
        }
        return results;
    };
    const headTags = (...args) => callMiddleware('headTags', args);
    const bodyTags = (...args) => callMiddleware('bodyTags', args);
    const htmlProps = (...args) => callMiddleware('htmlProps', args, true);
    const isSpr = !!unstable_getStaticProps;
    const defaultAppGetInitialProps = App.getInitialProps === App.origGetInitialProps;
    const hasPageGetInitialProps = !!Component.getInitialProps;
    const isAutoExport = !hasPageGetInitialProps && defaultAppGetInitialProps && !isSpr;
    if (process.env.NODE_ENV !== 'production' &&
        isAutoExport &&
        is_dynamic_1.isDynamicRoute(pathname) &&
        req._nextDidRewrite) {
        // TODO: add err.sh when rewrites go stable
        // Behavior might change before then (prefer SSR in this case)
        throw new Error(`Rewrites don't support auto-exported dynamic pages yet. ` +
            `Using this will cause the page to fail to parse the params on the client`);
    }
    if (hasPageGetInitialProps && isSpr) {
        throw new Error(constants_1.SSG_GET_INITIAL_PROPS_CONFLICT + ` ${pathname}`);
    }
    if (!!unstable_getStaticPaths && !isSpr) {
        throw new Error(`unstable_getStaticPaths was added without a unstable_getStaticProps in ${pathname}. Without unstable_getStaticProps, unstable_getStaticPaths does nothing`);
    }
    if (dev) {
        const { isValidElementType } = require('react-is');
        if (!isValidElementType(Component)) {
            throw new Error(`The default export is not a React Component in page: "${pathname}"`);
        }
        if (!isValidElementType(App)) {
            throw new Error(`The default export is not a React Component in page: "/_app"`);
        }
        if (!isValidElementType(Document)) {
            throw new Error(`The default export is not a React Component in page: "/_document"`);
        }
        if (isAutoExport) {
            // remove query values except ones that will be set during export
            query = {
                amp: query.amp,
            };
            req.url = pathname;
            renderOpts.nextExport = true;
        }
    }
    if (isAutoExport)
        renderOpts.autoExport = true;
    if (isSpr)
        renderOpts.nextExport = false;
    await loadable_1.default.preloadAll(); // Make sure all dynamic imports are loaded
    // @ts-ignore url will always be set
    const asPath = req.url;
    const router = new ServerRouter(pathname, query, asPath);
    const ctx = {
        err,
        req: isAutoExport ? undefined : req,
        res: isAutoExport ? undefined : res,
        pathname,
        query,
        asPath,
        AppTree: (props) => {
            return (react_1.default.createElement(AppContainer, null,
                react_1.default.createElement(App, Object.assign({}, props, { Component: Component, router: router }))));
        },
    };
    let props;
    if (documentMiddlewareEnabled && typeof DocumentMiddleware === 'function') {
        await DocumentMiddleware(ctx);
    }
    const ampState = {
        ampFirst: pageConfig.amp === true,
        hasQuery: Boolean(query.amp),
        hybrid: pageConfig.amp === 'hybrid',
    };
    const reactLoadableModules = [];
    const AppContainer = ({ children }) => (react_1.default.createElement(router_context_1.RouterContext.Provider, { value: router },
        react_1.default.createElement(amp_context_1.AmpStateContext.Provider, { value: ampState },
            react_1.default.createElement(loadable_context_1.LoadableContext.Provider, { value: moduleName => reactLoadableModules.push(moduleName) }, children))));
    try {
        props = await utils_1.loadGetInitialProps(App, {
            AppTree: ctx.AppTree,
            Component,
            router,
            ctx,
        });
        if (isSpr) {
            const data = await unstable_getStaticProps({
                params: is_dynamic_1.isDynamicRoute(pathname) ? query : undefined,
            });
            const invalidKeys = Object.keys(data).filter(key => key !== 'revalidate' && key !== 'props');
            if (invalidKeys.length) {
                throw new Error(`Additional keys were returned from \`getStaticProps\`. Properties intended for your component must be nested under the \`props\` key, e.g.:` +
                    `\n\n\treturn { props: { title: 'My Title', content: '...' } }` +
                    `\n\nKeys that need to be moved: ${invalidKeys.join(', ')}.`);
            }
            if (typeof data.revalidate === 'number') {
                if (!Number.isInteger(data.revalidate)) {
                    throw new Error(`A page's revalidate option must be seconds expressed as a natural number. Mixed numbers, such as '${data.revalidate}', cannot be used.` +
                        `\nTry changing the value to '${Math.ceil(data.revalidate)}' or using \`Math.ceil()\` if you're computing the value.`);
                }
                else if (data.revalidate <= 0) {
                    throw new Error(`A page's revalidate option can not be less than or equal to zero. A revalidate option of zero means to revalidate after _every_ request, and implies stale data cannot be tolerated.` +
                        `\n\nTo never revalidate, you can set revalidate to \`false\` (only ran once at build-time).` +
                        `\nTo revalidate as soon as possible, you can set the value to \`1\`.`);
                }
                else if (data.revalidate > 31536000) {
                    // if it's greater than a year for some reason error
                    console.warn(`Warning: A page's revalidate option was set to more than a year. This may have been done in error.` +
                        `\nTo only run getStaticProps at build-time and not revalidate at runtime, you can set \`revalidate\` to \`false\`!`);
                }
            }
            else if (data.revalidate === true) {
                // When enabled, revalidate after 1 second. This value is optimal for
                // the most up-to-date page possible, but without a 1-to-1
                // request-refresh ratio.
                data.revalidate = 1;
            }
            else {
                // By default, we never revalidate.
                data.revalidate = false;
            }
            props.pageProps = data.props;
            renderOpts.revalidate = data.revalidate;
            renderOpts.pageData = props;
        }
    }
    catch (err) {
        if (!dev || !err)
            throw err;
        ctx.err = err;
        renderOpts.err = err;
    }
    // the response might be finished on the getInitialProps call
    if (utils_1.isResSent(res) && !isSpr)
        return null;
    const devFiles = buildManifest.devFiles;
    const files = [
        ...new Set([
            ...get_page_files_1.getPageFiles(buildManifest, '/_app'),
            ...get_page_files_1.getPageFiles(buildManifest, pathname),
        ]),
    ];
    const polyfillFiles = get_page_files_1.getPageFiles(buildManifest, '/_polyfills');
    const renderElementToString = staticMarkup
        ? server_1.renderToStaticMarkup
        : server_1.renderToString;
    const renderPageError = () => {
        if (ctx.err && ErrorDebug) {
            return render(renderElementToString, react_1.default.createElement(ErrorDebug, { error: ctx.err }), ampState);
        }
        if (dev && (props.router || props.Component)) {
            throw new Error(`'router' and 'Component' can not be returned in getInitialProps from _app.js https://err.sh/zeit/next.js/cant-override-next-props`);
        }
    };
    let renderPage = (options = {}) => {
        const renderError = renderPageError();
        if (renderError)
            return renderError;
        const { App: EnhancedApp, Component: EnhancedComponent, } = enhanceComponents(options, App, Component);
        return render(renderElementToString, react_1.default.createElement(AppContainer, null,
            react_1.default.createElement(EnhancedApp, Object.assign({ Component: EnhancedComponent, router: router }, props))), ampState);
    };
    const documentCtx = Object.assign(Object.assign({}, ctx), { renderPage });
    const docProps = await utils_1.loadGetInitialProps(Document, documentCtx);
    // the response might be finished on the getInitialProps call
    if (utils_1.isResSent(res) && !isSpr)
        return null;
    if (!docProps || typeof docProps.html !== 'string') {
        const message = `"${utils_1.getDisplayName(Document)}.getInitialProps()" should resolve to an object with a "html" prop set with a valid html string`;
        throw new Error(message);
    }
    const dynamicImportIdsSet = new Set();
    const dynamicImports = [];
    for (const mod of reactLoadableModules) {
        const manifestItem = reactLoadableManifest[mod];
        if (manifestItem) {
            manifestItem.forEach(item => {
                dynamicImports.push(item);
                dynamicImportIdsSet.add(item.id);
            });
        }
    }
    const dynamicImportsIds = [...dynamicImportIdsSet];
    const inAmpMode = amp_1.isInAmpMode(ampState);
    const hybridAmp = ampState.hybrid;
    // update renderOpts so export knows current state
    renderOpts.inAmpMode = inAmpMode;
    renderOpts.hybridAmp = hybridAmp;
    let html = renderDocument(Document, Object.assign(Object.assign({}, renderOpts), { dangerousAsPath: router.asPath, ampState,
        props, headTags: await headTags(documentCtx), bodyTags: await bodyTags(documentCtx), htmlProps: await htmlProps(documentCtx), docProps,
        pathname,
        ampPath,
        query,
        inAmpMode,
        hybridAmp,
        dynamicImportsIds,
        dynamicImports,
        files,
        devFiles,
        polyfillFiles }));
    if (inAmpMode && html) {
        // inject HTML to AMP_RENDER_TARGET to allow rendering
        // directly to body in AMP mode
        const ampRenderIndex = html.indexOf(constants_2.AMP_RENDER_TARGET);
        html =
            html.substring(0, ampRenderIndex) +
                `<!-- __NEXT_DATA__ -->${docProps.html}` +
                html.substring(ampRenderIndex + constants_2.AMP_RENDER_TARGET.length);
        html = await optimize_amp_1.default(html);
        if (renderOpts.ampValidator) {
            await renderOpts.ampValidator(html, pathname);
        }
    }
    if (inAmpMode || hybridAmp) {
        // fix &amp being escaped for amphtml rel link
        html = html.replace(/&amp;amp=1/g, '&amp=1');
    }
    return html;
}
exports.renderToHTML = renderToHTML;
function errorToJSON(err) {
    const { name, message, stack } = err;
    return { name, message, stack };
}
function serializeError(dev, err) {
    if (dev) {
        return errorToJSON(err);
    }
    return {
        name: 'Internal Server Error.',
        message: '500 - Internal Server Error.',
        statusCode: 500,
    };
}
