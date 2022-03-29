const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    'assets/app': './src/app.js',
    serviceWorker: './src/serviceWorker.js'
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      _BUILD_VERSION_: new Date().getTime()
    })
  ],
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'public')
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './',
    publicPath: './public'
  }
};
