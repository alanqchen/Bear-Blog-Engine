/// <reference types="node" />
import { IncomingMessage, ServerResponse } from 'http';
import { UrlWithParsedQuery } from 'url';
import Server, { ServerConstructor } from '../next-server/server/next-server';
import { Params } from '../next-server/server/router';
export default class DevServer extends Server {
    private devReady;
    private setDevReady?;
    private webpackWatcher?;
    private hotReloader?;
    private isCustomServer;
    constructor(options: ServerConstructor & {
        isNextDevCommand?: boolean;
    });
    protected currentPhase(): string;
    protected readBuildId(): string;
    addExportPathMapRoutes(): Promise<void>;
    startWatcher(): Promise<unknown>;
    stopWatcher(): Promise<void>;
    prepare(): Promise<void>;
    protected close(): Promise<void>;
    protected hasPage(pathname: string): Promise<boolean>;
    protected _beforeCatchAllRender(req: IncomingMessage, res: ServerResponse, params: Params, parsedUrl: UrlWithParsedQuery): Promise<boolean>;
    run(req: IncomingMessage, res: ServerResponse, parsedUrl: UrlWithParsedQuery): Promise<void>;
    protected getCustomRoutes(): {
        rewrites: import("../lib/check-custom-routes").Rewrite[];
        redirects: import("../lib/check-custom-routes").Redirect[];
        headers: import("../lib/check-custom-routes").Header[];
    } | undefined;
    private loadCustomRoutes;
    generateRoutes(): {
        routes: import("../next-server/server/router").Route[];
        fsRoutes: import("../next-server/server/router").Route[];
        catchAllRoute: import("../next-server/server/router").Route;
        dynamicRoutes: import("../next-server/server/router").DynamicRoutes | undefined;
        pageChecker: import("../next-server/server/router").PageChecker;
    };
    protected generatePublicRoutes(): never[];
    protected getDynamicRoutes(): never[];
    _filterAmpDevelopmentScript(html: string, event: {
        line: number;
        col: number;
        code: string;
    }): boolean;
    protected ensureApiPage(pathname: string): Promise<any>;
    renderToHTML(req: IncomingMessage, res: ServerResponse, pathname: string, query: {
        [key: string]: string;
    }, options?: {}): Promise<string | null>;
    renderErrorToHTML(err: Error | null, req: IncomingMessage, res: ServerResponse, pathname: string, query: {
        [key: string]: string;
    }): Promise<string | null>;
    sendHTML(req: IncomingMessage, res: ServerResponse, html: string): Promise<void>;
    protected setImmutableAssetCacheControl(res: ServerResponse): void;
    servePublic(req: IncomingMessage, res: ServerResponse, path: string): Promise<void>;
    hasPublicFile(path: string): Promise<boolean>;
    getCompilationError(page: string): Promise<any>;
}
