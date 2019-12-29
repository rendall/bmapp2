const path = require('path');

module.exports = {
  entry: './src/app/index.js',
  mode: 'development',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'app'),
  },
};