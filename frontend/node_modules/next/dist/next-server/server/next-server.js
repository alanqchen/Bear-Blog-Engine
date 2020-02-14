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
const compression_1 = __importDefault(require("compression"));
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const path_to_regexp_1 = require("path-to-regexp");
const querystring_1 = require("querystring");
const url_1 = require("url");
const coalesced_function_1 = require("../../lib/coalesced-function");
const constants_1 = require("../lib/constants");
const utils_1 = require("../lib/router/utils");
const envConfig = __importStar(require("../lib/runtime-config"));
const utils_2 = require("../lib/utils");
const api_utils_1 = require("./api-utils");
const config_1 = __importStar(require("./config"));
const path_match_1 = __importDefault(require("./lib/path-match"));
const recursive_readdir_sync_1 = require("./lib/recursive-readdir-sync");
const load_components_1 = require("./load-components");
const render_1 = require("./render");
const require_1 = require("./require");
const router_1 = __importStar(require("./router"));
const send_html_1 = require("./send-html");
const serve_static_1 = require("./serve-static");
const spr_cache_1 = require("./spr-cache");
const utils_3 = require("./utils");
const check_custom_routes_1 = require("../../lib/check-custom-routes");
const getCustomRouteMatcher = path_match_1.default(true);
class Server {
    constructor({ dir = '.', staticMarkup = false, quiet = false, conf = null, dev = false, } = {}) {
        this.dir = path_1.resolve(dir);
        this.quiet = quiet;
        const phase = this.currentPhase();
        this.nextConfig = config_1.default(phase, this.dir, conf);
        this.distDir = path_1.join(this.dir, this.nextConfig.distDir);
        this.publicDir = path_1.join(this.dir, constants_1.CLIENT_PUBLIC_FILES_PATH);
        this.hasStaticDir = fs_1.default.existsSync(path_1.join(this.dir, 'static'));
        // Only serverRuntimeConfig needs the default
        // publicRuntimeConfig gets it's default in client/index.js
        const { serverRuntimeConfig = {}, publicRuntimeConfig, assetPrefix, generateEtags, compress, } = this.nextConfig;
        this.buildId = this.readBuildId();
        this.renderOpts = {
            poweredByHeader: this.nextConfig.poweredByHeader,
            canonicalBase: this.nextConfig.amp.canonicalBase,
            documentMiddlewareEnabled: this.nextConfig.experimental
                .documentMiddleware,
            hasCssMode: this.nextConfig.experimental.css,
            staticMarkup,
            buildId: this.buildId,
            generateEtags,
        };
        // Only the `publicRuntimeConfig` key is exposed to the client side
        // It'll be rendered as part of __NEXT_DATA__ on the client side
        if (Object.keys(publicRuntimeConfig).length > 0) {
            this.renderOpts.runtimeConfig = publicRuntimeConfig;
        }
        if (compress && this.nextConfig.target === 'server') {
            this.compression = compression_1.default();
        }
        // Initialize next/config with the environment configuration
        if (this.nextConfig.target === 'server') {
            envConfig.setConfig({
                serverRuntimeConfig,
                publicRuntimeConfig,
            });
        }
        this.serverBuildDir = path_1.join(this.distDir, this._isLikeServerless ? constants_1.SERVERLESS_DIRECTORY : constants_1.SERVER_DIRECTORY);
        const pagesManifestPath = path_1.join(this.serverBuildDir, constants_1.PAGES_MANIFEST);
        if (!dev) {
            this.pagesManifest = require(pagesManifestPath);
        }
        this.router = new router_1.default(this.generateRoutes());
        this.setAssetPrefix(assetPrefix);
        // call init-server middleware, this is also handled
        // individually in serverless bundles when deployed
        if (!dev && this.nextConfig.experimental.plugins) {
            const initServer = require(path_1.join(this.serverBuildDir, 'init-server.js'))
                .default;
            this.onErrorMiddleware = require(path_1.join(this.serverBuildDir, 'on-error-server.js')).default;
            initServer();
        }
        spr_cache_1.initializeSprCache({
            dev,
            distDir: this.distDir,
            pagesDir: path_1.join(this.distDir, this._isLikeServerless
                ? constants_1.SERVERLESS_DIRECTORY
                : `${constants_1.SERVER_DIRECTORY}/static/${this.buildId}`, 'pages'),
            flushToDisk: this.nextConfig.experimental.sprFlushToDisk,
        });
    }
    currentPhase() {
        return constants_1.PHASE_PRODUCTION_SERVER;
    }
    logError(err) {
        if (this.onErrorMiddleware) {
            this.onErrorMiddleware({ err });
        }
        if (this.quiet)
            return;
        // tslint:disable-next-line
        console.error(err);
    }
    handleRequest(req, res, parsedUrl) {
        // Parse url if parsedUrl not provided
        if (!parsedUrl || typeof parsedUrl !== 'object') {
            const url = req.url;
            parsedUrl = url_1.parse(url, true);
        }
        // Parse the querystring ourselves if the user doesn't handle querystring parsing
        if (typeof parsedUrl.query === 'string') {
            parsedUrl.query = querystring_1.parse(parsedUrl.query);
        }
        if (parsedUrl.pathname.startsWith(this.nextConfig.experimental.basePath)) {
            // If replace ends up replacing the full url it'll be `undefined`, meaning we have to default it to `/`
            parsedUrl.pathname =
                parsedUrl.pathname.replace(this.nextConfig.experimental.basePath, '') || '/';
            req.url = req.url.replace(this.nextConfig.experimental.basePath, '');
        }
        res.statusCode = 200;
        return this.run(req, res, parsedUrl).catch(err => {
            this.logError(err);
            res.statusCode = 500;
            res.end('Internal Server Error');
        });
    }
    getRequestHandler() {
        return this.handleRequest.bind(this);
    }
    setAssetPrefix(prefix) {
        this.renderOpts.assetPrefix = prefix ? prefix.replace(/\/$/, '') : '';
    }
    // Backwards compatibility
    async prepare() { }
    // Backwards compatibility
    async close() { }
    setImmutableAssetCacheControl(res) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
    getCustomRoutes() {
        return require(path_1.join(this.distDir, constants_1.ROUTES_MANIFEST));
    }
    generateRoutes() {
        this.customRoutes = this.getCustomRoutes();
        const publicRoutes = fs_1.default.existsSync(this.publicDir)
            ? this.generatePublicRoutes()
            : [];
        const staticFilesRoute = this.hasStaticDir
            ? [
                {
                    // It's very important to keep this route's param optional.
                    // (but it should support as many params as needed, separated by '/')
                    // Otherwise this will lead to a pretty simple DOS attack.
                    // See more: https://github.com/zeit/next.js/issues/2617
                    match: router_1.route('/static/:path*'),
                    name: 'static catchall',
                    fn: async (req, res, params, parsedUrl) => {
                        const p = path_1.join(this.dir, 'static', ...(params.path || []));
                        await this.serveStatic(req, res, p, parsedUrl);
                        return {
                            finished: true,
                        };
                    },
                },
            ]
            : [];
        const fsRoutes = [
            {
                match: router_1.route('/_next/static/:path*'),
                type: 'route',
                name: '_next/static catchall',
                fn: async (req, res, params, parsedUrl) => {
                    // The commons folder holds commonschunk files
                    // The chunks folder holds dynamic entries
                    // The buildId folder holds pages and potentially other assets. As buildId changes per build it can be long-term cached.
                    // make sure to 404 for /_next/static itself
                    if (!params.path) {
                        await this.render404(req, res, parsedUrl);
                        return {
                            finished: true,
                        };
                    }
                    if (params.path[0] === constants_1.CLIENT_STATIC_FILES_RUNTIME ||
                        params.path[0] === 'chunks' ||
                        params.path[0] === 'css' ||
                        params.path[0] === 'media' ||
                        params.path[0] === this.buildId) {
                        this.setImmutableAssetCacheControl(res);
                    }
                    const p = path_1.join(this.distDir, constants_1.CLIENT_STATIC_FILES_PATH, ...(params.path || []));
                    await this.serveStatic(req, res, p, parsedUrl);
                    return {
                        finished: true,
                    };
                },
            },
            {
                match: router_1.route('/_next/data/:path*'),
                type: 'route',
                name: '_next/data catchall',
                fn: async (req, res, params, _parsedUrl) => {
                    // Make sure to 404 for /_next/data/ itself and
                    // we also want to 404 if the buildId isn't correct
                    if (!params.path || params.path[0] !== this.buildId) {
                        await this.render404(req, res, _parsedUrl);
                        return {
                            finished: true,
                        };
                    }
                    // remove buildId from URL
                    params.path.shift();
                    // show 404 if it doesn't end with .json
                    if (!params.path[params.path.length - 1].endsWith('.json')) {
                        await this.render404(req, res, _parsedUrl);
                        return {
                            finished: true,
                        };
                    }
                    // re-create page's pathname
                    const pathname = `/${params.path.join('/')}`
                        .replace(/\.json$/, '')
                        .replace(/\/index$/, '/');
                    req.url = pathname;
                    const parsedUrl = url_1.parse(pathname, true);
                    await this.render(req, res, pathname, { _nextDataReq: '1' }, parsedUrl);
                    return {
                        finished: true,
                    };
                },
            },
            {
                match: router_1.route('/_next/:path*'),
                type: 'route',
                name: '_next catchall',
                // This path is needed because `render()` does a check for `/_next` and the calls the routing again
                fn: async (req, res, _params, parsedUrl) => {
                    await this.render404(req, res, parsedUrl);
                    return {
                        finished: true,
                    };
                },
            },
            ...publicRoutes,
            ...staticFilesRoute,
        ];
        const routes = [];
        if (this.customRoutes) {
            const { redirects, rewrites, headers } = this.customRoutes;
            const getCustomRoute = (r, type) => (Object.assign(Object.assign({}, r), { type, matcher: getCustomRouteMatcher(r.source) }));
            // Headers come very first
            routes.push(...headers.map(r => {
                const route = getCustomRoute(r, 'header');
                return {
                    check: true,
                    match: route.matcher,
                    type: route.type,
                    name: `${route.type} ${route.source} header route`,
                    fn: async (_req, res, _params, _parsedUrl) => {
                        for (const header of route.headers) {
                            res.setHeader(header.key, header.value);
                        }
                        return { finished: false };
                    },
                };
            }));
            const customRoutes = [
                ...redirects.map(r => getCustomRoute(r, 'redirect')),
                ...rewrites.map(r => getCustomRoute(r, 'rewrite')),
            ];
            routes.push(...customRoutes.map(route => {
                return {
                    check: true,
                    match: route.matcher,
                    type: route.type,
                    statusCode: route.statusCode,
                    name: `${route.type} ${route.source} route`,
                    fn: async (_req, res, params, _parsedUrl) => {
                        const parsedDestination = url_1.parse(route.destination, true);
                        const destQuery = parsedDestination.query;
                        let destinationCompiler = path_to_regexp_1.compile(`${parsedDestination.pathname}${parsedDestination.hash || ''}`);
                        let newUrl;
                        Object.keys(destQuery).forEach(key => {
                            const val = destQuery[key];
                            if (typeof val === 'string' &&
                                val.startsWith(':') &&
                                params[val.substr(1)]) {
                                destQuery[key] = params[val.substr(1)];
                            }
                        });
                        try {
                            newUrl = destinationCompiler(params);
                        }
                        catch (err) {
                            if (err.message.match(/Expected .*? to not repeat, but got an array/)) {
                                throw new Error(`To use a multi-match in the destination you must add \`*\` at the end of the param name to signify it should repeat. https://err.sh/zeit/next.js/invalid-multi-match`);
                            }
                            throw err;
                        }
                        if (route.type === 'redirect') {
                            const parsedNewUrl = url_1.parse(newUrl);
                            const updatedDestination = url_1.format(Object.assign(Object.assign({}, parsedDestination), { pathname: parsedNewUrl.pathname, hash: parsedNewUrl.hash, search: undefined }));
                            res.setHeader('Location', updatedDestination);
                            res.statusCode = check_custom_routes_1.getRedirectStatus(route);
                            // Since IE11 doesn't support the 308 header add backwards
                            // compatibility using refresh header
                            if (res.statusCode === 308) {
                                res.setHeader('Refresh', `0;url=${updatedDestination}`);
                            }
                            res.end();
                            return {
                                finished: true,
                            };
                        }
                        else {
                            ;
                            _req._nextDidRewrite = true;
                        }
                        return {
                            finished: false,
                            pathname: newUrl,
                            query: parsedDestination.query,
                        };
                    },
                };
            }));
        }
        const catchPublicDirectoryRoute = {
            match: router_1.route('/:path*'),
            type: 'route',
            name: 'Catch public directory route',
            fn: async (req, res, params, parsedUrl) => {
                const { pathname } = parsedUrl;
                if (!pathname) {
                    throw new Error('pathname is undefined');
                }
                // Used in development to check public directory paths
                if (await this._beforeCatchAllRender(req, res, params, parsedUrl)) {
                    return {
                        finished: true,
                    };
                }
                return {
                    finished: false,
                };
            },
        };
        routes.push(catchPublicDirectoryRoute);
        const catchAllRoute = {
            match: router_1.route('/:path*'),
            type: 'route',
            name: 'Catchall render',
            fn: async (req, res, params, parsedUrl) => {
                var _a, _b;
                const { pathname, query } = parsedUrl;
                if (!pathname) {
                    throw new Error('pathname is undefined');
                }
                if (((_b = (_a = params) === null || _a === void 0 ? void 0 : _a.path) === null || _b === void 0 ? void 0 : _b[0]) === 'api') {
                    const handled = await this.handleApiRequest(req, res, pathname, query);
                    if (handled) {
                        return { finished: true };
                    }
                }
                await this.render(req, res, pathname, query, parsedUrl);
                return {
                    finished: true,
                };
            },
        };
        if (this.nextConfig.useFileSystemPublicRoutes) {
            this.dynamicRoutes = this.getDynamicRoutes();
            // It's very important to keep this route's param optional.
            // (but it should support as many params as needed, separated by '/')
            // Otherwise this will lead to a pretty simple DOS attack.
            // See more: https://github.com/zeit/next.js/issues/2617
            routes.push(catchAllRoute);
        }
        return {
            routes,
            fsRoutes,
            catchAllRoute,
            dynamicRoutes: this.dynamicRoutes,
            pageChecker: this.hasPage.bind(this),
        };
    }
    async getPagePath(pathname) {
        return require_1.getPagePath(pathname, this.distDir, this._isLikeServerless, this.renderOpts.dev);
    }
    async hasPage(pathname) {
        let found = false;
        try {
            found = !!(await this.getPagePath(pathname));
        }
        catch (_) { }
        return found;
    }
    async _beforeCatchAllRender(_req, _res, _params, _parsedUrl) {
        return false;
    }
    // Used to build API page in development
    async ensureApiPage(pathname) { }
    /**
     * Resolves `API` request, in development builds on demand
     * @param req http request
     * @param res http response
     * @param pathname path of request
     */
    async handleApiRequest(req, res, pathname, query) {
        let page = pathname;
        let params = false;
        let pageFound = await this.hasPage(page);
        if (!pageFound && this.dynamicRoutes) {
            for (const dynamicRoute of this.dynamicRoutes) {
                params = dynamicRoute.match(pathname);
                if (params) {
                    page = dynamicRoute.page;
                    pageFound = true;
                    break;
                }
            }
        }
        if (!pageFound) {
            return false;
        }
        // Make sure the page is built before getting the path
        // or else it won't be in the manifest yet
        await this.ensureApiPage(page);
        const builtPagePath = await this.getPagePath(page);
        const pageModule = require(builtPagePath);
        query = Object.assign(Object.assign({}, query), params);
        if (!this.renderOpts.dev && this._isLikeServerless) {
            if (typeof pageModule.default === 'function') {
                this.prepareServerlessUrl(req, query);
                await pageModule.default(req, res);
                return true;
            }
        }
        await api_utils_1.apiResolver(req, res, query, pageModule, this.onErrorMiddleware);
        return true;
    }
    generatePublicRoutes() {
        const publicFiles = new Set(recursive_readdir_sync_1.recursiveReadDirSync(this.publicDir).map(p => p.replace(/\\/g, '/')));
        return [
            {
                match: router_1.route('/:path*'),
                name: 'public folder catchall',
                fn: async (req, res, params, parsedUrl) => {
                    const path = `/${(params.path || []).join('/')}`;
                    if (publicFiles.has(path)) {
                        await this.serveStatic(req, res, 
                        // we need to re-encode it since send decodes it
                        path_1.join(this.dir, 'public', encodeURIComponent(path)), parsedUrl);
                        return {
                            finished: true,
                        };
                    }
                    return {
                        finished: false,
                    };
                },
            },
        ];
    }
    getDynamicRoutes() {
        const dynamicRoutedPages = Object.keys(this.pagesManifest).filter(utils_1.isDynamicRoute);
        return utils_1.getSortedRoutes(dynamicRoutedPages).map(page => ({
            page,
            match: utils_1.getRouteMatcher(utils_1.getRouteRegex(page)),
        }));
    }
    handleCompression(req, res) {
        if (this.compression) {
            this.compression(req, res, () => { });
        }
    }
    async run(req, res, parsedUrl) {
        this.handleCompression(req, res);
        try {
            const matched = await this.router.execute(req, res, parsedUrl);
            if (matched) {
                return;
            }
        }
        catch (err) {
            if (err.code === 'DECODE_FAILED') {
                res.statusCode = 400;
                return this.renderError(null, req, res, '/_error', {});
            }
            throw err;
        }
        await this.render404(req, res, parsedUrl);
    }
    async sendHTML(req, res, html) {
        const { generateEtags, poweredByHeader } = this.renderOpts;
        return send_html_1.sendHTML(req, res, html, { generateEtags, poweredByHeader });
    }
    async render(req, res, pathname, query = {}, parsedUrl) {
        const url = req.url;
        if (url.match(/^\/_next\//) ||
            (this.hasStaticDir && url.match(/^\/static\//))) {
            return this.handleRequest(req, res, parsedUrl);
        }
        if (utils_3.isBlockedPage(pathname)) {
            return this.render404(req, res, parsedUrl);
        }
        const html = await this.renderToHTML(req, res, pathname, query, {});
        // Request was ended by the user
        if (html === null) {
            return;
        }
        return this.sendHTML(req, res, html);
    }
    async findPageComponents(pathname, query = {}) {
        const serverless = !this.renderOpts.dev && this._isLikeServerless;
        // try serving a static AMP version first
        if (query.amp) {
            try {
                return await load_components_1.loadComponents(this.distDir, this.buildId, (pathname === '/' ? '/index' : pathname) + '.amp', serverless);
            }
            catch (err) {
                if (err.code !== 'ENOENT')
                    throw err;
            }
        }
        return await load_components_1.loadComponents(this.distDir, this.buildId, pathname, serverless);
    }
    __sendPayload(res, payload, type, revalidate) {
        // TODO: ETag? Cache-Control headers? Next-specific headers?
        res.setHeader('Content-Type', type);
        res.setHeader('Content-Length', Buffer.byteLength(payload));
        if (!this.renderOpts.dev) {
            if (revalidate) {
                res.setHeader('Cache-Control', `s-maxage=${revalidate}, stale-while-revalidate`);
            }
            else if (revalidate === false) {
                res.setHeader('Cache-Control', `s-maxage=31536000, stale-while-revalidate`);
            }
        }
        res.end(payload);
    }
    prepareServerlessUrl(req, query) {
        const curUrl = url_1.parse(req.url, true);
        req.url = url_1.format(Object.assign(Object.assign({}, curUrl), { search: undefined, query: Object.assign(Object.assign({}, curUrl.query), query) }));
    }
    async renderToHTMLWithComponents(req, res, pathname, query = {}, result, opts) {
        // handle static page
        if (typeof result.Component === 'string') {
            return result.Component;
        }
        // check request state
        const isLikeServerless = typeof result.Component === 'object' &&
            typeof result.Component.renderReqToHTML === 'function';
        const isSSG = !!result.unstable_getStaticProps;
        // non-spr requests should render like normal
        if (!isSSG) {
            // handle serverless
            if (isLikeServerless) {
                this.prepareServerlessUrl(req, query);
                return result.Component.renderReqToHTML(req, res);
            }
            return render_1.renderToHTML(req, res, pathname, query, Object.assign(Object.assign({}, result), opts));
        }
        // Toggle whether or not this is an SPR Data request
        const isDataReq = query._nextDataReq;
        delete query._nextDataReq;
        // Compute the SPR cache key
        const ssgCacheKey = url_1.parse(req.url || '').pathname;
        // Complete the response with cached data if its present
        const cachedData = await spr_cache_1.getSprCache(ssgCacheKey);
        if (cachedData) {
            const data = isDataReq
                ? JSON.stringify(cachedData.pageData)
                : cachedData.html;
            this.__sendPayload(res, data, isDataReq ? 'application/json' : 'text/html; charset=utf-8', cachedData.curRevalidate);
            // Stop the request chain here if the data we sent was up-to-date
            if (!cachedData.isStale) {
                return null;
            }
        }
        // If we're here, that means data is missing or it's stale.
        // Serverless requests need its URL transformed back into the original
        // request path (to emulate lambda behavior in production)
        if (isLikeServerless && isDataReq) {
            let { pathname } = url_1.parse(req.url || '', true);
            pathname = !pathname || pathname === '/' ? '/index' : pathname;
            req.url = `/_next/data/${this.buildId}${pathname}.json`;
        }
        const doRender = coalesced_function_1.withCoalescedInvoke(async function () {
            let pageData;
            let html;
            let sprRevalidate;
            let renderResult;
            // handle serverless
            if (isLikeServerless) {
                renderResult = await result.Component.renderReqToHTML(req, res, true);
                html = renderResult.html;
                pageData = renderResult.renderOpts.pageData;
                sprRevalidate = renderResult.renderOpts.revalidate;
            }
            else {
                const renderOpts = Object.assign(Object.assign({}, result), opts);
                renderResult = await render_1.renderToHTML(req, res, pathname, query, renderOpts);
                html = renderResult;
                pageData = renderOpts.pageData;
                sprRevalidate = renderOpts.revalidate;
            }
            return { html, pageData, sprRevalidate };
        });
        return doRender(ssgCacheKey, []).then(async ({ isOrigin, value: { html, pageData, sprRevalidate } }) => {
            // Respond to the request if a payload wasn't sent above (from cache)
            if (!utils_2.isResSent(res)) {
                this.__sendPayload(res, isDataReq ? JSON.stringify(pageData) : html, isDataReq ? 'application/json' : 'text/html; charset=utf-8', sprRevalidate);
            }
            // Update the SPR cache if the head request
            if (isOrigin) {
                await spr_cache_1.setSprCache(ssgCacheKey, { html: html, pageData }, sprRevalidate);
            }
            return null;
        });
    }
    renderToHTML(req, res, pathname, query = {}, { amphtml, hasAmp, } = {}) {
        return this.findPageComponents(pathname, query)
            .then(result => {
            return this.renderToHTMLWithComponents(req, res, pathname, result.unstable_getStaticProps
                ? { _nextDataReq: query._nextDataReq }
                : query, result, Object.assign(Object.assign({}, this.renderOpts), { amphtml, hasAmp }));
        }, err => {
            if (err.code !== 'ENOENT' || !this.dynamicRoutes) {
                return Promise.reject(err);
            }
            for (const dynamicRoute of this.dynamicRoutes) {
                const params = dynamicRoute.match(pathname);
                if (!params) {
                    continue;
                }
                return this.findPageComponents(dynamicRoute.page, query).then(result => {
                    return this.renderToHTMLWithComponents(req, res, dynamicRoute.page, Object.assign(Object.assign({}, (result.unstable_getStaticProps
                        ? { _nextDataReq: query._nextDataReq }
                        : query)), params), result, Object.assign(Object.assign({}, this.renderOpts), { amphtml,
                        hasAmp }));
                });
            }
            return Promise.reject(err);
        })
            .catch(err => {
            if (err && err.code === 'ENOENT') {
                res.statusCode = 404;
                return this.renderErrorToHTML(null, req, res, pathname, query);
            }
            else {
                this.logError(err);
                res.statusCode = 500;
                return this.renderErrorToHTML(err, req, res, pathname, query);
            }
        });
    }
    async renderError(err, req, res, pathname, query = {}) {
        res.setHeader('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate');
        const html = await this.renderErrorToHTML(err, req, res, pathname, query);
        if (html === null) {
            return;
        }
        return this.sendHTML(req, res, html);
    }
    async renderErrorToHTML(err, req, res, _pathname, query = {}) {
        let result = null;
        // use static 404 page if available and is 404 response
        if (this.nextConfig.experimental.static404 && err === null) {
            try {
                result = await this.findPageComponents('/_errors/404');
            }
            catch (err) {
                if (err.code !== 'ENOENT') {
                    throw err;
                }
            }
        }
        if (!result) {
            result = await this.findPageComponents('/_error', query);
        }
        let html;
        try {
            html = await this.renderToHTMLWithComponents(req, res, '/_error', query, result, Object.assign(Object.assign({}, this.renderOpts), { err }));
        }
        catch (err) {
            console.error(err);
            res.statusCode = 500;
            html = 'Internal Server Error';
        }
        return html;
    }
    async render404(req, res, parsedUrl) {
        const url = req.url;
        const { pathname, query } = parsedUrl ? parsedUrl : url_1.parse(url, true);
        if (!pathname) {
            throw new Error('pathname is undefined');
        }
        res.statusCode = 404;
        return this.renderError(null, req, res, pathname, query);
    }
    async serveStatic(req, res, path, parsedUrl) {
        if (!this.isServeableUrl(path)) {
            return this.render404(req, res, parsedUrl);
        }
        if (!(req.method === 'GET' || req.method === 'HEAD')) {
            res.statusCode = 405;
            res.setHeader('Allow', ['GET', 'HEAD']);
            return this.renderError(null, req, res, path);
        }
        try {
            await serve_static_1.serveStatic(req, res, path);
        }
        catch (err) {
            if (err.code === 'ENOENT' || err.statusCode === 404) {
                this.render404(req, res, parsedUrl);
            }
            else if (err.statusCode === 412) {
                res.statusCode = 412;
                return this.renderError(err, req, res, path);
            }
            else {
                throw err;
            }
        }
    }
    isServeableUrl(path) {
        const resolved = path_1.resolve(path);
        if (resolved.indexOf(path_1.join(this.distDir) + path_1.sep) !== 0 &&
            resolved.indexOf(path_1.join(this.dir, 'static') + path_1.sep) !== 0 &&
            resolved.indexOf(path_1.join(this.dir, 'public') + path_1.sep) !== 0) {
            // Seems like the user is trying to traverse the filesystem.
            return false;
        }
        return true;
    }
    readBuildId() {
        const buildIdFile = path_1.join(this.distDir, constants_1.BUILD_ID_FILE);
        try {
            return fs_1.default.readFileSync(buildIdFile, 'utf8').trim();
        }
        catch (err) {
            if (!fs_1.default.existsSync(buildIdFile)) {
                throw new Error(`Could not find a valid build in the '${this.distDir}' directory! Try building your app with 'next build' before starting the server.`);
            }
            throw err;
        }
    }
    get _isLikeServerless() {
        return config_1.isTargetLikeServerless(this.nextConfig.target);
    }
}
exports.default = Server;
