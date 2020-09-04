const path = require('path');

const conf = {
  prodMode: process.env.NODE_ENV === 'production',
  templatePath: './template.yaml',
};

const config = {
  entry: {
    defaultApiResponses: path.resolve(__dirname, 'src', 'defaultResponses.ts'),
  },
  target: 'node',
  mode: conf.prodMode ? 'production' : 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  },
  devtool: 'source-map',
  plugins: [],
};

module.exports = config