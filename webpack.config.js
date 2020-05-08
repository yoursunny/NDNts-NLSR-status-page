const path = require("path");

module.exports = (env, argv) => ({
  entry: "./src/index.tsx",
  devtool: argv.mode === "development" ? "cheap-module-eval-source-map" : "source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "ifdef-loader",
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: "ts-loader",
      },
      {
        test: /\.html$/,
        exclude: /node_modules/,
        loader: "file-loader",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "public"),
  },
  devServer: {
    contentBase: path.join(__dirname, "public"),
    disableHostCheck: true,
    port: 3333,
  },
});
