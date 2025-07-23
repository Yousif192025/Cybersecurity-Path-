const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: {
    main: './src/scripts/main.js',
    styles: './src/styles/main.scss',
    pathwaysMain: './src/scripts/pathways/main.js',
  },
  output: {
    path: path.resolve(__dirname, '../docs'),
    filename: 'assets/js/[name].[contenthash].js',
    publicPath: '/',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name][ext]',
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),

    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].[contenthash].css',
    }),

    // صفحات عامة
    new HtmlWebpackPlugin({
      template: './src/templates/index.html',
      filename: 'index.html',
      chunks: ['main', 'styles'],
    }),

    // صفحات مسارات التعلم
    new HtmlWebpackPlugin({
      filename: 'pathways/index.html',
      template: './src/templates/pathways/index.html',
      chunks: ['main', 'pathwaysMain'],
    }),
    new HtmlWebpackPlugin({
      filename: 'pathways/beginner.html',
      template: './src/templates/pathways/beginner.html',
      chunks: ['main', 'pathwaysMain'],
    }),
    new HtmlWebpackPlugin({
      filename: 'pathways/professional.html',
      template: './src/templates/pathways/professional.html',
      chunks: ['main', 'pathwaysMain'],
    }),
    new HtmlWebpackPlugin({
      filename: 'pathways/tvtc-cs-diploma.html',
      template: './src/templates/pathways/tvtc-cs-diploma.html',
      chunks: ['main', 'pathwaysMain'],
    }),
    new HtmlWebpackPlugin({
      filename: 'pathways/tvtc-cs-security.html',
      template: './src/templates/pathways/tvtc-cs-security.html',
      chunks: ['main', 'pathwaysMain'],
    }),
    new HtmlWebpackPlugin({
      filename: 'pathways/roadmap-builder.html',
      template: './src/templates/pathways/roadmap-builder.html',
      chunks: ['main', 'pathwaysMain'],
    }),

    // نسخ الملفات الثابتة
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../src/assets/images/icons'),
          to: path.resolve(__dirname, '../docs/assets/images/icons'),
        },
        {
          from: path.resolve(__dirname, '../src/manifest.json'),
          to: path.resolve(__dirname, '../docs'),
        },
        {
          from: path.resolve(__dirname, '../src/service-worker.js'),
          to: path.resolve(__dirname, '../docs'),
        },
      ],
    }),
  ],
  resolve: {
    extensions: ['.js', '.scss', '.css'],
  },
};
