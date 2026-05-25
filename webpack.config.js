const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv && argv.mode === 'production';

  return {
    mode: 'development',
    entry: './src/ts/index.ts',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.scss$/,
          use: [
            'style-loader',
            { loader: 'css-loader', options: { importLoaders: 1 } },
            'postcss-loader',
          ],
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          loader: 'file-loader',
          options: {
            name: './assets/img/[name].[ext]',
          },
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      filename: 'js/bundle.js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: isProduction ? './' : '/',
    },
    devServer: {
      host: '127.0.0.1',
      compress: true,
      hot: true,
      static: false,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'src/index.html',
      }),
    ],
  };
};
