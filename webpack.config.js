const path = require('path');

module.exports = {
	entry: "./src/typescript/program.ts",
	devtool: "source-map",
	mode: "production",
	target: "web",
	output: {
		path: path.join(__dirname, 'app', 'static', 'js'),
		filename: 'program.js'
	},
	resolve: {
		extensions: ['.ts']
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: /(node_modules)/,
				use: {
		  			loader: "babel-loader",
					options: {
						presets: ["@babel/preset-typescript"],
		  			},
				},
			}
		]
	}
}
