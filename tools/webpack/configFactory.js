import { resolve as resolvePath } from 'path'
import webpack from 'webpack'
import appRootDir from 'app-root-dir'
import { removeEmpty, ifElse } from '../utils'

function webpackConfigFactory({ target }) {
  const libraryName = 'react-tree-walker'
  const minimize = target === 'umd-min'

  return {
    entry: {
      index: resolvePath(appRootDir.get(), './src/index.js'),
    },
    output: {
      path: resolvePath(appRootDir.get(), './umd'),
      filename: target === 'umd' ? `${libraryName}.js` : `${libraryName}.min.js`,
      library: 'ReactTreeWalker',
      libraryTarget: 'umd',
    },
    externals: {
      react: {
        root: 'React',
        amd: 'react',
        commonjs: 'react',
        commonjs2: 'react',
      },
      'react-dom': {
        root: 'ReactDOM',
        amd: 'react-dom',
        commonjs: 'react-dom',
        commonjs2: 'react-dom',
      },
    },
    plugins: removeEmpty([
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),

      new webpack.LoaderOptionsPlugin({
        minimize,
      }),

      ifElse(minimize)(
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            screw_ie8: true,
            warnings: false,
          },
          mangle: {
            screw_ie8: true,
          },
          output: {
            comments: false,
            screw_ie8: true,
          },
        }),
      ),
    ]),
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          include: [resolvePath(appRootDir.get(), './src')],
        },
      ],
    },
  }
}

module.exports = webpackConfigFactory
