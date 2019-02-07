const path = require("path");
const webpack = require("webpack");
const DefinePlugin = require("webpack").DefinePlugin;
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "production",
  // context: path.resolve(__dirname),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "fennch.js",
    library: "fennch",
    umdNamedDefine: true,
    globalObject: "typeof self !== 'undefined' ? self : this",
    libraryTarget: "commonjs",
    libraryExport: "default"
  },
  externals: {
    caseless: {
      commonjs: "caseless",
      commonjs2: "caseless",
      amd: "caseless",
      root: "caseless"
    },
    qs: {
      commonjs: "qs",
      commonjs2: "qs",
      amd: "qs",
      root: "qs"
    }
  },
  entry: path.resolve(__dirname, "src/index.js"),
  resolve: {
    extensions: [".js"],
    modules: [
      path.resolve(__dirname, "./node_modules"),
      path.resolve(__dirname, "./src")
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          /* config.module.rule('ts').use('cache-loader') */
          {
            loader: "cache-loader",
            options: {
              cacheDirectory: path.resolve(__dirname, "/.cache/babel-loader"),
              cacheIdentifier: "60264e3f"
            }
          },
          /* config.module.rule('ts').use('babel-loader') */
          {
            loader: "babel-loader"
          }
        ]
      }
    ]
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        warningsFilter: () => true,
        extractComments: true,
        sourceMap: true,
        cache: true,
        cacheKeys: defaultCacheKeys => defaultCacheKeys,
        parallel: true,
        include: undefined,
        exclude: undefined,
        minify: undefined,
        terserOptions: {
          output: {
            comments: /^\**!|@preserve|@license|@cc_on/i
          },
          compress: {
            arrows: false,
            collapse_vars: false,
            comparisons: false,
            computed_props: false,
            hoist_funs: false,
            hoist_props: false,
            hoist_vars: false,
            inline: false,
            loops: false,
            negate_iife: false,
            properties: false,
            reduce_funcs: false,
            reduce_vars: false,
            switches: false,
            toplevel: false,
            typeofs: false,
            booleans: true,
            if_return: true,
            sequences: true,
            unused: true,
            conditionals: true,
            dead_code: true,
            evaluate: true
          },
          mangle: {
            safari10: true
          }
        }
      })
    ]
  },
  plugins: [
    /* config.plugin('define') */
    new DefinePlugin({
      "process.env": {
        NODE_ENV: '"production"',
        BASE_URL: '"/"'
      }
    }),
    new CaseSensitivePathsPlugin()
  ]
};
