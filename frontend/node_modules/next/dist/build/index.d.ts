export declare type SsgRoute = {
    initialRevalidateSeconds: number | false;
    srcRoute: string | null;
    dataRoute: string;
};
export declare type DynamicSsgRoute = {
    routeRegex: string;
    dataRoute: string;
    dataRouteRegex: string;
};
export declare type PrerenderManifest = {
    version: number;
    routes: {
        [route: string]: SsgRoute;
    };
    dynamicRoutes: {
        [route: string]: DynamicSsgRoute;
    };
};
export default function build(dir: string, conf?: null): Promise<void>;
