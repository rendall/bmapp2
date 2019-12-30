const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src-compiled/app/index.js',
  mode: 'development',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'app'),
  },
  plugins: [
    new CopyPlugin([
      { from: '**/*', to: '', context: 'static' },
    ]),
  ],
};