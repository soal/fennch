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
    filename: "fench.js",
    library: "Fench",
    umdNamedDefine: true,
    globalObject: "typeof self !== 'undefined' ? self : this",
    libraryTarget: "commonjs",
    libraryExport: "default"
  },
  externals: {
    "url-join": {
      commonjs: "url-join",
      commonjs2: "url-join",
      amd: "url-join",
      root: "url-join"
    },
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
        // exclude: [
        //   filepath => {
        //     // check if this is something the user explicitly wants to transpile
        //     if (
        //       options.transpileDependencies.some(dep => {
        //         if (typeof dep === "string") {
        //           return filepath.includes(path.normalize(dep));
        //         } else {
        //           return filepath.match(dep);
        //         }
        //       })
        //     ) {
        //       return false;
        //     }
        //     // Don't transpile node_modules
        //     return /node_modules/.test(filepath);
        //   }
        // ],
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
    /* config.plugin('fork-ts-checker') */
    // new ForkTsCheckerWebpackPlugin({
    //   tslint: true,
    //   formatter: "codeframe",
    //   checkSyntacticErrors: true
    // })
  ]
};
