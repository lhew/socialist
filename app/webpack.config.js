const path = require('path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

/*
 * SplitChunksPlugin is enabled by default and replaced
 * deprecated CommonsChunkPlugin. It automatically identifies modules which
 * should be splitted of chunk by heuristics using module duplication count and
 * module category (i. e. node_modules). And splits the chunks…
 *
 * It is safe to remove "splitChunks" from the generated configuration
 * and was added as an educational example.
 *
 * https://webpack.js.org/plugins/split-chunks-plugin/
 *
 */
const ExtractTextPlugin = require('extract-text-webpack-plugin');


const HtmlWebpackPlugin = require('html-webpack-plugin');

/*
 * We've enabled HtmlWebpackPlugin for you! This generates a html
 * page for you when you compile webpack, which will make you start
 * developing and prototyping faster.
 *
 * https://github.com/jantimon/html-webpack-plugin
 *
 */

module.exports = {
	target: 'web',
	devtool: 'source-map',
	mode: 'development',
	entry: {
		index: ['./src/index.tsx', './src/styles/index.scss'],
	},

	output: {
		filename: '[name].[chunkhash].js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: "/"
	},
	resolve: {
		aliasFields: ['browser'],
		extensions: ['.tsx', '.ts', '.js', '.json'],
	},

	plugins: [
		new ExtractTextPlugin({ filename: 'css/[name].css' }),
		new HtmlWebpackPlugin({
			filename: "index.html",
			template: "index.html",
			publicPath: "/"
		}),
		new webpack.ProgressPlugin(), 
		new Dotenv()
	],

	module: {
		rules: [
			{
				test: /.(ts|tsx)?$/,
				loader: 'ts-loader',
				include: [path.resolve(__dirname, 'src')],
				exclude: [/node_modules/]
			},
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						'style-loader',
						{
							loader: 'css-loader',
							options: { importLoaders: 1, 
								sourceMap: true
							 },
						},
						'postcss-loader',
					],
				}),
			},
			{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',

					use: [
						{ loader: 'css-loader', options: { 
							sourceMap: true 
						} },
						{ loader: 'postcss-loader', options: { 
							sourceMap: true 
						} },
						{
							loader: 'sass-loader',
							options: {
								sourceMap: true,
							},
						},
					],
				}),
			},
			{
				test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
				exclude: /(img|icons)/,
				include: /src\/fonts/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							emitFile: true,
						},
					},
				],
			},
		]
	},

	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin(),
			new OptimizeCssAssetsPlugin()
		],
		splitChunks: {
			chunks: 'all',
			name: false,
		  },
		  // Keep the runtime chunk seperated to enable long term caching
		  // https://twitter.com/wSokra/status/969679223278505985
		  runtimeChunk: true,
	},

	devServer: {
		historyApiFallback: true
	},

	resolve: {
		extensions: ['.tsx', '.ts', '.js']
	}
};
