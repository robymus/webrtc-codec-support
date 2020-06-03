const path = require('path');

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, 'src/webrtc-codec-support.ts'),
  output: {
    filename: 'webrtc-codec-support.min.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd2'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  devServer: {
    contentBase: path.resolve(__dirname, '__tests__/html'),
    port: 9999,
    hot: false,
    liveReload: false // this server is only used for testing, so live reloading is not required
  }
};