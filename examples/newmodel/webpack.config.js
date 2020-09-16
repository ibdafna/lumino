var path = require('path');

module.exports = {
  entry: './src/index.ts',
  mode: 'development',
  output: {
    path: __dirname + '/build/',
    filename: 'bundle.example.js',
    publicPath: './build/'
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  module: {
    rules: [
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.png$/, use: 'file-loader' },
      { test: /\.ts$/, use: 'ts-loader', exclude: /node_modules/,},
      { test: /\.js$/, enforce: 'pre', use: ['source-map-loader']}
    ]
  },
  devtool: 'inline-source-map'
};