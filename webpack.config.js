const path = require('path');

module.exports = {
  entry: {
    app: './src/app.js',
    serviceWorker: './src/serviceWorker.js',
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'public', 'assets'),
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './',
    publicPath: './public',
  },
};
