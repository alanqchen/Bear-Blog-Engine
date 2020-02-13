import { Redirect, Rewrite } from '../lib/check-custom-routes';
export declare function collectPages(directory: string, pageExtensions: string[]): Promise<string[]>;
export interface PageInfo {
    isAmp?: boolean;
    isHybridAmp?: boolean;
    size: number;
    totalSize: number;
    static: boolean;
    isSsg: boolean;
    ssgPageRoutes: string[] | null;
    serverBundle: string;
}
export declare function printTreeView(list: readonly string[], pageInfos: Map<string, PageInfo>, serverless: boolean, { distPath, buildId, pagesDir, pageExtensions, buildManifest, isModern, }: {
    distPath: string;
    buildId: string;
    pagesDir: string;
    pageExtensions: string[];
    buildManifest: BuildManifestShape;
    isModern: boolean;
}): Promise<void>;
export declare function printCustomRoutes({ redirects, rewrites, }: {
    redirects: Redirect[];
    rewrites: Rewrite[];
}): void;
declare type BuildManifestShape = {
    pages: {
        [k: string]: string[];
    };
};
export declare function getSharedSizes(distPath: string, buildManifest: BuildManifestShape, buildId: string, isModern: boolean, pageInfos: Map<string, PageInfo>): Promise<{
    total: number;
    files: {
        [page: string]: number;
    };
}>;
export declare function getPageSizeInKb(page: string, distPath: string, buildId: string, buildManifest: BuildManifestShape, isModern: boolean): Promise<[number, number]>;
export declare function isPageStatic(page: string, serverBundle: string, runtimeEnvConfig: any): Promise<{
    static?: boolean;
    prerender?: boolean;
    isHybridAmp?: boolean;
    prerenderRoutes?: string[] | undefined;
}>;
export declare function hasCustomAppGetInitialProps(_appBundle: string, runtimeEnvConfig: any): boolean;
export {};
