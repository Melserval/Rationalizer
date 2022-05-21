const path = require('path');
let mode = 'development';

if (process.env.NODE_ENV == 'production') {
	mode = 'production';
}

module.exports = {
	mode: mode,
	entry: "./src/typescript/program.ts",
	devtool: "source-map",
	devServer: {
		hot: true
	},
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
