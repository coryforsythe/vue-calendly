'use strict'

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require('terser-webpack-plugin');

const merge = require('webpack-merge');
const webpack = require('webpack');

const options = require('./options');
const baseConfig = require('./webpack.base.js');

const config = merge(baseConfig, {
  // without this, webpack throws in a polyfill for node.js's Buffer class
  node: {
    Buffer: false,
    process: false
  },
  entry: options.paths.resolve('src/index.js'),
  output: {
    filename: options.isProduction ? 'vue-calendly.min.js' : 'vue-calendly.js',
    path: options.paths.output.main,
    libraryTarget: 'umd'
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          ecma: 6,
          compress: true,
          output: {
            comments: false,
            beautify: false
          }
        }
      }),
    ]
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: options.banner,
      raw: true,
      entryOnly: true
    })
  ]
});

// debug and production
config.plugins = config.plugins.concat([
  new webpack.LoaderOptionsPlugin({
    minimize: true
  }),
  new webpack.DefinePlugin({
    VERSION: JSON.stringify(options.version)
  })
]);

if (options.isProduction) {
  config.plugins.push(
    // Set the production environment
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  );
}

config.module.rules.push({
  test: /\.css$/,
  use: [
    options.isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader',
    'css-loader'
  ]
});

config.plugins.push(
  new MiniCssExtractPlugin({
    filename: options.isProduction ? 'vue-calendly.min.css' : 'vue-calendly.css',
    disable: !options.isProduction
  })
);

module.exports = config;
