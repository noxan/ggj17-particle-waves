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
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack-loader?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ],
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
