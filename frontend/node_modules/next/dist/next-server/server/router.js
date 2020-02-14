"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_match_1 = __importDefault(require("./lib/path-match"));
exports.route = path_match_1.default();
class Router {
    constructor({ routes = [], fsRoutes = [], catchAllRoute, dynamicRoutes = [], pageChecker, }) {
        this.routes = routes;
        this.fsRoutes = fsRoutes;
        this.pageChecker = pageChecker;
        this.catchAllRoute = catchAllRoute;
        this.dynamicRoutes = dynamicRoutes;
    }
    setDynamicRoutes(routes = []) {
        this.dynamicRoutes = routes;
    }
    add(route) {
        this.routes.unshift(route);
    }
    async execute(req, res, parsedUrl) {
        // memoize page check calls so we don't duplicate checks for pages
        const pageChecks = {};
        const memoizedPageChecker = async (p) => {
            if (pageChecks[p]) {
                return pageChecks[p];
            }
            const result = await this.pageChecker(p);
            pageChecks[p] = result;
            return result;
        };
        let parsedUrlUpdated = parsedUrl;
        for (const route of [...this.fsRoutes, ...this.routes]) {
            const newParams = route.match(parsedUrlUpdated.pathname);
            // Check if the match function matched
            if (newParams) {
                // Combine parameters and querystring
                if (route.type === 'rewrite' || route.type === 'redirect') {
                    parsedUrlUpdated.query = Object.assign(Object.assign({}, parsedUrlUpdated.query), newParams);
                }
                const result = await route.fn(req, res, newParams, parsedUrlUpdated);
                // The response was handled
                if (result.finished) {
                    return true;
                }
                if (result.pathname) {
                    parsedUrlUpdated.pathname = result.pathname;
                }
                if (result.query) {
                    parsedUrlUpdated.query = Object.assign(Object.assign({}, parsedUrlUpdated.query), result.query);
                }
                // check filesystem
                if (route.check === true) {
                    for (const fsRoute of this.fsRoutes) {
                        const fsParams = fsRoute.match(parsedUrlUpdated.pathname);
                        if (fsParams) {
                            const result = await fsRoute.fn(req, res, fsParams, parsedUrlUpdated);
                            if (result.finished) {
                                return true;
                            }
                        }
                    }
                    let matchedPage = await memoizedPageChecker(parsedUrlUpdated.pathname);
                    // If we didn't match a page check dynamic routes
                    if (!matchedPage) {
                        for (const dynamicRoute of this.dynamicRoutes) {
                            if (dynamicRoute.match(parsedUrlUpdated.pathname)) {
                                matchedPage = true;
                            }
                        }
                    }
                    // Matched a page or dynamic route so render it using catchAllRoute
                    if (matchedPage) {
                        const pageParams = this.catchAllRoute.match(parsedUrlUpdated.pathname);
                        await this.catchAllRoute.fn(req, res, pageParams, parsedUrlUpdated);
                        return true;
                    }
                }
            }
        }
        return false;
    }
}
exports.default = Router;
