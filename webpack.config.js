//webpack.config.js
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const AngularWebpackPlugin = require('@ngtools/webpack').AngularWebpackPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = (env) => {
  return {

    mode: env.production ? "production" : "development",
    devtool: env.production ? false : "eval",

    context: path.resolve(__dirname),
    entry: {
      app: path.resolve(__dirname, "src/main.ts"),
      index: ["./src/main.ts"]
    },
    stats: 'normal',
    output: {
      clean: true,
      path: path.resolve(__dirname, "dist"),
      publicPath: '/',
      filename: env.production ? "[name].[chunkhash].js" : "[name].js"
    },


    resolve: {
      extensions: [".ts", ".js"]
    },

    module: {
      rules: [
        {
          test: /\.?(svg|html)$/,
          resourceQuery: /\?ngResource/,
          type: "asset/source"
        },
        {
          test: /\.[cm]?[tj]sx?$/,
          exclude: /\/node_modules\//,
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
                compact: true,
                plugins: ["@angular/compiler-cli/linker/babel"],
              },
            },
            {
              loader: "@angular-devkit/build-angular/src/babel/webpack-loader",
              options: {
                aot: true,
                optimize: true,
                scriptTarget: 7
              }
            },
            {
              loader: '@ngtools/webpack',
            },
            'angular2-template-loader',
            'angular-router-loader'
          ],
        },


        {//styleUrls
          test: /\.?(css|scss)$/,
          exclude: /\/node_modules\//,
          oneOf: [
            {
              resourceQuery: {
                not: [/\?ngResource/]
              },
              use: [MiniCssExtractPlugin.loader,
                'css-loader',
                "postcss-loader",
                'sass-loader'
              ]
            },
            {
              type: "asset/source",
              loader: "postcss-loader",
              //use: ["postcss-loader"]
              options: {
                postcssOptions: {
                  ident: 'postcss',
                  syntax: 'postcss-scss',
                },
              }
            }
          ],
          exclude: path.join(__dirname, 'src/app')
        },
        {//styleUrls
          test: /\.?(css|scss)$/,
          exclude: /\/node_modules\//,
          use: [{ loader: 'to-string-loader' }, //'style-loader' to user styleUrls
          { loader: 'css-loader' },
          { loader: 'sass-loader' }],
          include: path.join(__dirname, 'src/app')
        },

      ]
    },
    devServer: {
      static: {
        directory: path.resolve(__dirname, "dist"),
      },
      port: 4200,
      //hot: true,
      open: false,
      client: {
        overlay: {
          errors: true,
          warnings: false,
        }
      },
      historyApiFallback: true//route not found
    },

    plugins: [
      new HtmlWebpackPlugin({
        filename: path.resolve(__dirname, "dist", "index.html"),
        template: path.resolve(__dirname, "src/index.html")
      }),

      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: "[name].css"
      }),

      new CopyPlugin({
        patterns: [
          {
            context: "src/assets/",
            from: "**/*",
            to: "assets/",
          }
        ]
      }),

      new AngularWebpackPlugin({
        tsconfig: path.resolve(__dirname, "tsconfig.json"),
        jitMode: false,
      }),


    ],

    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    }

  }
}