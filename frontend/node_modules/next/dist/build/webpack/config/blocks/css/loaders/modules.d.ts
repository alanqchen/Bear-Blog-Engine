import postcss from 'postcss';
import webpack from 'webpack';
import { ConfigurationContext } from '../../../utils';
export declare function getCssModuleLoader(ctx: ConfigurationContext, postCssPlugins: postcss.AcceptedPlugin[], preProcessors?: webpack.RuleSetUseItem[]): webpack.RuleSetUseItem[];
