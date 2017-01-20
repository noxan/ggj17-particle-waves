const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    main: './src/main.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: './dist'
  },
  module: {
    rules: [
      {
        test: /phaser\.js$/,
        loader: 'imports-loader?PIXI=pixi,p2=p2',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  resolve: {
    alias: {
      'p2': path.join(__dirname, 'node_modules/phaser/build/p2.js'),
      'pixi': path.join(__dirname, 'node_modules/phaser/build/pixi.js'),
      'phaser': path.join(__dirname, 'node_modules/phaser/build/phaser.js'),
    }
  },
  plugins: [
    new HtmlWebpackPlugin(),
  ],
}
