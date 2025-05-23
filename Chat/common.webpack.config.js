// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpackConfig = (sampleAppDir, env, babelConfig) => {
  const config = {
    entry: './src/index.tsx',
    ...(env.production || !env.development ? {} : { devtool: 'eval-source-map' }),
    resolve: {
      extensions: ['.ts', '.tsx', '.js']
    },
    output: {
      path: path.join(sampleAppDir, env.production ? '/dist/build' : 'dist'),
      filename: 'build.js'
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: {
            transpileOnly: true
          },
          exclude: /dist/
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.svg/,
          type: 'asset/inline'
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({ template: './public/index.html' }),
      new webpack.DefinePlugin({
        'process.env.PRODUCTION': env.production || !env.development,
        'process.env.NAME': JSON.stringify(require(path.resolve(sampleAppDir, 'package.json')).name),
        'process.env.VERSION': JSON.stringify(require(path.resolve(sampleAppDir, 'package.json')).version),
        __CHATVERSION__: JSON.stringify(
          require(path.resolve(sampleAppDir, 'package.json')).dependencies['@azure/communication-chat']
        ),
        __COMMUNICATIONREACTVERSION__: JSON.stringify(
          require(path.resolve(sampleAppDir, 'package.json')).dependencies['@azure/communication-react']
        ),
        __BUILDTIME__: JSON.stringify(new Date().toLocaleString()),
        __COMMITID__: `"${process.env.REACT_APP_COMMIT_SHA || ''}"`
      })
    ],
    devServer: {
      port: 3002,
      hot: true,
      open: true,
      static: { directory: path.resolve(sampleAppDir, 'public') },
      proxy: [
        {
          path: '/token',
          target: 'http://[::1]:8082'
        },
        {
          path: '/refreshToken/*',
          target: 'http://[::1]:8082'
        },
        {
          path: '/isValidThread/*',
          target: 'http://[::1]:8082'
        },
        {
          path: '/createThread',
          target: 'http://[::1]:8082'
        },
        {
          path: '/userConfig/*',
          target: 'http://[::1]:8082'
        },
        {
          path: '/getEndpointUrl',
          target: 'http://[::1]:8082'
        },
        {
          path: '/addUser/*',
          target: 'http://[::1]:8082'
        },
        {
          path: '/registerWorker/*',
          target: 'http://[::1]:8082'
        },
        {
          path: '/getJobAssignment/*',
          target: 'http://[::1]:8082'
        },
        {
          path: '/getJobDetail/*',
          target: 'http://[::1]:8082'
        },
        {
          path: '/acceptJobOffer',
          target: 'http://[::1]:8082'
        },
      ]
    }
  };

  return config;
};

module.exports = webpackConfig;
