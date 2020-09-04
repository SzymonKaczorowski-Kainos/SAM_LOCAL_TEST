const p = require('path');
const yamlCfn = require('yaml-cfn');
const fs = require('fs')
const { compilerOptions } = require('./tsconfig.json')

const conf = {
  prodMode: process.env.NODE_ENV === 'production',
  templatePath: '../../template.yaml',
};

const tsPaths = Object.keys(compilerOptions.paths).reduce(
  (paths, path) =>
    Object.assign(paths, { [`${path}`]: p.resolve(__dirname, compilerOptions.paths[path][0]) }),
  {}
);

const resources = yamlCfn.yamlParse(fs.readFileSync(conf.templatePath, 'utf-8'));

const entries = Object.values(resources.Resources)
  .filter((resource) => resource.Type === 'AWS::Serverless::Function')
  .filter(
    (resource) =>
      resource.Properties.Runtime && resource.Properties.Runtime.startsWith('nodejs')
  )
  .map((resource) => ({
    filename: resource.Properties.Handler.split('.')[0],
    entryPath: resource.Properties.CodeUri.split('/').splice(3).join('/'),
  }))
  .reduce(
    (resources, resource) =>
      Object.assign(resources, {
        [`${resource.filename}`]: `./src/${resource.entryPath}${resource.filename}.ts`,
      }),
    {}
  );


const config = {
  entry: entries,
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
    alias: tsPaths,
  },
  output: {
    path: p.resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  },
  devtool: 'source-map',
  plugins: []
};

module.exports = config