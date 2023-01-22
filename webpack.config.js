const path = require("path");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  // target:'node',
   mode: "development",
   entry: "./src/index.js",
   output: {
     path: path.resolve(__dirname, "dist"), 
     filename: "index.js" 
   },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ { loader: "style-loader" }, { loader: "css-loader" } ],
      },
    ]
  },
  devServer: {
    static: "./dist"
  },
  resolve: {
    fallback: {
      "fs": false,
      "tls": false,
      "net": false,
      "path": false,
      "zlib": false,
      "http": false,
      "https": false,
      "stream": false,
      "crypto": false,
      "crypto-browserify": false, //if you want to use this module also don't forget npm i crypto-browserify 
      "querystring": false,
      "url": false,
      "util": false
    } 
  },
  plugins: [
    new NodePolyfillPlugin()
]  
};