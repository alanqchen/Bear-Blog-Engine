import { NodePath, PluginObj } from '@babel/core';
import * as BabelTypes from '@babel/types';
export declare const EXPORT_NAME_GET_STATIC_PROPS = "unstable_getStaticProps";
export declare const EXPORT_NAME_GET_STATIC_PATHS = "unstable_getStaticPaths";
declare type PluginState = {
    refs: Set<NodePath<BabelTypes.Identifier>>;
    isPrerender: boolean;
    done: boolean;
};
export default function nextTransformSsg({ types: t, }: {
    types: typeof BabelTypes;
}): PluginObj<PluginState>;
export {};
