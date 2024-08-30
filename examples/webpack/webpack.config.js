require('dotenv').config()
const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const env = process.env.NODE_ENV

module.exports = {
  entry: './src/index.js',
  mode: env,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: '/',
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    port: 3000,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: [env === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
      'process.env.API_URL': JSON.stringify(process.env.API_URL),
    }),
  ],
}
