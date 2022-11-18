module.exports = {
	mode: 'development',
	devtool: "inline-source-map",
	entry: './src/typescript/program.ts',
	output: {
		filename: 'program.js',
		path: 'D:\\Projects\\Рационализатор\\Rationalizer\\app\\static\\js'
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: 'ts-loader'
			}
		]
	},
	resolve: {
		extensions: ['.ts', '.js']
	}
}
