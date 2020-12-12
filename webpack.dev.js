const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
  entry: {
    ovo: './src/ovo.ts',
    anchor: './src/anchor/anchor.ts',
    parallax: './src/anchor/anchor.ts',
  },
  output: {
    // path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
  },
  mode: 'development',
  devtool: 'inline-source-map',
  watch: true,
  module: {
    rules: [
      {
        test: /\.([j|t]s)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
    ],
  },
});
