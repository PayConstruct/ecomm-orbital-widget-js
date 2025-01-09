const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const Dotenv = require('dotenv-webpack')

module.exports = {
  entry: {
    form: './src/form.js',
    payment: './src/payment.js',
    success: './src/success.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].bundle.js',
    clean: true,
    publicPath: '/',
  },
  mode: process.env.NODE_ENV || 'development',
  devServer: {
    static: path.join(__dirname, 'public'),
    compress: true,
    port: 3001,
    hot: true,
    open: true,
    historyApiFallback: {
      index: '/form.html',
      rewrites: [
        { from: /^\/form$/, to: '/form.html' },
        { from: /^\/payment$/, to: '/payment.html' },
        { from: /^\/success$/, to: '/success.html' },
      ],
    },
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
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/form.html',
      filename: 'form.html',
      chunks: ['form'],
    }),
    new HtmlWebpackPlugin({
      template: './src/payment.html',
      filename: 'payment.html',
      chunks: ['payment'],
    }),
    new HtmlWebpackPlugin({
      template: './src/success.html',
      filename: 'success.html',
      chunks: ['success'],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    new Dotenv(),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
}
