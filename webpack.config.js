//Docs: https://webpack.js.org/guides/getting-started/
//Run: ./node_modules/.bin/webpack bootstrap.js
//Run: npm run build

const path = require('path');

module.exports = {
	entry: './bootstrap.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'app.bundle.js'
	},
	module: {
		/*rules: [
			{ test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
		],*/
		loaders: [
			{ test: /\.txt$/, exclude: /node_modules/, use: 'raw-loader' },
			{ test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
			{ test: /\.css$/, use: [ 'style-loader', 'css-loader' ]}
		]
	}
};