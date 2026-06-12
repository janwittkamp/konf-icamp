const path = require("path")
const fs = require("fs")

const dotenv = require("dotenv")

const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const HtmlWebpackHardDiskPlugin = require("html-webpack-harddisk-plugin")

const prod = process.env.NODE_ENV === "production"

// get env from .env
dotenv.config({ path: path.resolve(__dirname, ".env") })

if (!prod && !process.env.WEBPACK_PORT) {
	const defaultValue = 9000
	console.warn(
		`WEBPACK_PORT not set. Falling back to default ${defaultValue}. Edit .env to change it.`
	)
	process.env.WEBPACK_PORT = defaultValue
}

if (!prod && !process.env.SOURCE_URL) {
	const defaultValue = "http://localhost:6"
	console.warn(
		`SOURCE_URL not set. Falling back to default "${defaultValue}". Edit .env to change it.`
	)
	process.env.SOURCE_URL = defaultValue
}

if (!prod && !process.env.WEBPACK_HOST) {
	process.env.WEBPACK_HOST = "localhost"
}

const plugins = [
	new HtmlWebpackPlugin({
		filename: path.resolve(
			__dirname,
			"partials",
			"_generated",
			"header.htm"
		),
		template: "src/generate-partials/header.ejs",
		inject: false,
		scriptLoading: "defer",
		alwaysWriteToDisk: true,
	}),
	new HtmlWebpackPlugin({
		filename: path.resolve(__dirname, "partials", "_generated", "body.htm"),
		template: "src/generate-partials/body.ejs",
		inject: false,
		scriptLoading: "defer",
		alwaysWriteToDisk: true,
	}),
	new HtmlWebpackHardDiskPlugin(),
]

if (prod) {
	plugins.push(
		new MiniCssExtractPlugin({
			filename: "css/[name].[contenthash].css",
			chunkFilename: "css/[id].[contenthash].css",
		})
	)
}

const webpackConfig = {
	entry: {
		main: "./src/index.js",
		jquery: "./src/jquery.js",
	},
	output: {
		filename: "js/[name].[contenthash].js",
		path: path.resolve(__dirname, "assets/dist/"),
		publicPath: `${process.env.THEME_PATH}/assets/dist/`,
	},

	mode: prod ? "production" : "development",

	module: {
		rules: [
			{
				test: /\.css$/,
				sideEffects: true,
				use: [
					{
						loader: prod
							? MiniCssExtractPlugin.loader
							: "style-loader",
					},
					{
						loader: "css-loader",
						options: {
							importLoaders: 1
						},
					},
					{
						loader: "postcss-loader",
					},
				],
			},
			{
				test: /\.(png|jpg|gif)$/,
				generator: {
					filename: 'images_compiled/[hash].[ext][query]'
			   	},
				type: 'asset',
			},
			{
				test: /\.svg$/,
				use: [
					{
						loader: "svgo-loader",
					}
				],
				generator: {
					filename: 'images_compiled/[hash].[ext][query]'
			   	},
				type: 'asset',
			},
			{
				test: /\.(eot|woff2?|ttf)$/,
				generator: {
					filename: 'webfonts/[hash].[ext][query]'
			   	},
				type: 'asset/resource',
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: [
							["@babel/preset-env", {
								useBuiltIns: "usage",
								corejs: 3
							}],
						],
						plugins: ["@babel/plugin-transform-runtime"]
					},
				},
			},
		],
	},

	plugins,

	devtool: prod ? undefined : "eval-cheap-module-source-map",

	target: "web",

	devServer: {
		host: process.env.WEBPACK_HOST,
		port: process.env.WEBPACK_PORT,
		proxy: {
			[`!${process.env.THEME_PATH}/assets/dist/`]: {
				target: process.env.SOURCE_URL,
				secure: false,
			},
		},
		static: false,
		// devMiddleware: {
		// 	publicPath: `${process.env.THEME_PATH}/assets/dist/`,
		// },
		hot: true,
		https: process.env.WEBPACK_SSL
			? {
					key: fs.readFileSync(process.env.WEBPACK_SSL_KEY),
					cert: fs.readFileSync(process.env.WEBPACK_SSL_CERT),
					cacert: fs.readFileSync(process.env.WEBPACK_SSL_CA),
			  }
			: undefined,
	},

	optimization: prod
		? {
				runtimeChunk: "single",
				splitChunks: {
					chunks: "all",
				},
				minimizer: [
					// this tells webpack@5 to keep the default minifier chain
					`...`,
					new CssMinimizerPlugin(),
				],
		  }
		: {
				runtimeChunk: "single",
		  },
}

module.exports = webpackConfig
