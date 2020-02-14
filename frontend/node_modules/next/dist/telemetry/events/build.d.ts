declare type EventBuildCompleted = {
    durationInSeconds: number;
    totalPageCount: number;
};
export declare function eventBuildDuration(event: EventBuildCompleted): {
    eventName: string;
    payload: EventBuildCompleted;
};
declare type EventBuildOptimized = {
    durationInSeconds: number;
    totalPageCount: number;
    staticPageCount: number;
    ssrPageCount: number;
};
export declare function eventBuildOptimize(event: EventBuildOptimized): {
    eventName: string;
    payload: EventBuildOptimized;
};
export {};
