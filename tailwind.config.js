const { theme } = require("tailwindcss/defaultConfig")

module.exports = {
    purge: {
        content: [
            "layouts/**/*.htm",
            "pages/**/*.htm",
            "partials/**/*.htm",
            "contents/contentblocks/templates/**/*.htm",
        ],
		safelist: [
			"text-red",
			"sr-only",
			"text-justify",
		],
        options: {
            defaultExtractor: function (content) {
                return content.match(/[^<>"'`\s|]*[^<>"'`\s:|]/g) ?? []
            }
        },
    },
    darkMode: false,
    theme: {
        extend: {
			screens: {
				'2xl': '1440px',
			},
			colors: {
				transparent: "transparent",
				current: "currentColor",
				yellow: "#ffd43d",
				"almost-white": "#fff8ec",
				red: "#c4262f",
				purple: "#7d2442",
				black: "#000",
				gray: {
					dark: "#241b18",
					warm: "#6d625d",
					light: {
						blue: "#f5f8fb",
						warm: "#fff8ec",
					},
				},
				blue: {
					light: "#d8edf6",
					middle: "#5fb6c8",
					dark: "#16333b"
				},
				primary: {
					light: "#ffd43d",
					dark: "#c4262f"
				},
				secondary: {
					dark: "#16333b"
				},
				camp: {
					cream: "#fff8ec",
					sun: "#ffd43d",
					red: "#c4262f",
					redDark: "#8f1723",
					ink: "#241b18",
					forest: "#1e5a4b",
					sky: "#d8edf6",
				},
			},
			fontFamily: {
				default: ['Cabin Variable', '"Cabin Variable"', ...theme.fontFamily.sans],
				heading: ['Work Sans Variable', '"Work Sans Variable"', ...theme.fontFamily.sans],
			}
		},
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
