const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: { main: './src-compiled/app/index.js', "searchengine.webworker": './src-compiled/app/searchengine.webworker.js' },
  mode: 'development',
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'app'),
    },
    plugins: [
      new CopyPlugin([
        { from: '**/*', to: '', context: 'static' },
      ]),
    ],
};