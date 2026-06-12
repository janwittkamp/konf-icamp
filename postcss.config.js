module.exports = {
	plugins: [
		require("postcss-nested"),
		require("postcss-strip-inline-comments"),
		require("tailwindcss"),
		require("postcss-preset-env"),
		require("autoprefixer"),
	],
}
