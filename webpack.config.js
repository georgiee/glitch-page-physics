const devMode = process.env.NODE_ENV !== 'production'

const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

console.log('devMode: ', devMode);


module.exports = {
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  devServer: {
    compress: true,
    port: 3200,
    inline: true
  },
  entry: {
    main: ['./main.ts', './styles.scss']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      },
      {
        test: /\.(html)$/,
        loader: 'html-loader?interpolate'
      },
      {
        test: /\.scss$/,
        use: [
            "style-loader", // creates style nodes from JS strings
            "css-loader", // translates CSS into CommonJS
            "sass-loader" // compiles Sass to CSS
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: 'index.html'
    })
  ],
  stats: 'normal'
};
