const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CopyPlugin = require("copy-webpack-plugin");
const AngularWebpackPlugin = require('@ngtools/webpack').AngularWebpackPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env) => {
  return {
    mode: env.production ? "production" : "development",
    devtool: env.production ? false : "eval",

    context: path.resolve(__dirname),
    entry: {
      //polyfills: './src/polyfills.ts',
      app: path.resolve(__dirname, "src/main.ts"),
      index: ["./src/main.ts"]
    },
    stats: 'normal',
    output: {
      clean: true,
      path: path.resolve(__dirname, "dist"),
      //publicPath: '/',
      filename: env.production ? "assets/js/[name].[chunkhash].js" : "assets/js/[name].js",
    },


    resolve: {
      extensions: [".ts", ".js", '.html']
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


        {
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
        {
          test: /\.?(css|scss)$/,
          exclude: /\/node_modules\//,
          use: [{ loader: 'to-string-loader' }, //'style-loader' to user styleUrls
          { loader: 'css-loader' },
          { loader: 'sass-loader' }],
          include: path.join(__dirname, 'src/app')
        },

        {//fonts to folder
          test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
          type: 'asset/resource',
          generator: {
            filename: env.production ? 'assets/fonts/[name].[contenthash][ext]' : 'assets/fonts/[name].[ext]'
          }
        },
      ]
    },
    devServer: {
      static: {
        directory: path.resolve(__dirname, "dist"),
      },
      port: 4200,

      open: false,
      client: {
        overlay: {
          errors: true,
          warnings: false,
        },
        logging: 'info'
      },
      historyApiFallback: true, //route not found
    },

    plugins: [
      new webpack.LoaderOptionsPlugin({
        options: {
          handlebarsLoader: {}
        }
      }),
      new HtmlWebpackPlugin({
        filename: path.resolve(__dirname, env.production ? "dist/assets/pages" : "dist", `index.${env.production ? "hbs" : "html"}`),
        template: path.resolve(__dirname, `src/index.${env.production ? "hbs" : "html"}`),
        inject: 'body',
      }),

      new webpack.ContextReplacementPlugin(
        /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/
      ),
      //styles to css folder
      new MiniCssExtractPlugin({
        filename: env.production ? 'assets/css/[name].[chunkhash].css' : 'assets/css/[name].css',
        chunkFilename: env.production ? 'assets/css/[name].[chunkhash].chunk.css' : "assets/css/[name].css"
      }),
      //copy assets in dist
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
        jitMode: true//false,
      }),
    ],

    optimization: {
      minimize: false,
      splitChunks: {
        chunks: 'all'
      }
    }

  }
}
