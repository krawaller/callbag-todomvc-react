const path = require("path");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: __dirname + '/src/index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  },
  resolve: {
    extensions: [".jsx",".js"]
  },
  plugins: [
    new CleanWebpackPlugin('dist'),
    new CopyWebpackPlugin([
      { from: 'public/**/*', flatten: true },
      { from: 'node_modules/todomvc-app-css/index.css', to: 'todomvc.css' }
    ]),
  ],
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: { loader: 'babel-loader' }
    }]
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    port: 9000,
  },
};
