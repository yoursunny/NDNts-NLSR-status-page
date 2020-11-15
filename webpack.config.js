// eslint-disable-next-line import/no-extraneous-dependencies
const path = require("path");

/** @return {import("webpack").Configuration} */
module.exports = (env, argv) => ({
  mode: argv.mode ?? "production",
  devtool: argv.mode === "development" ? "eval-cheap-module-source-map" : "source-map",
  entry: "./src/main.tsx",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: "ts-loader",
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
  node: false,
  devServer: {
    contentBase: path.join(__dirname, "public"),
    disableHostCheck: true,
    port: 3333,
    headers: {
      "Origin-Trial": "Ap35eCHDwwsbFvzCecmVsWjl1eFe//k0PaTSQKrzKNZ/GRkQXr3208qHPKthQn570YfwJCW0TDPeo09BRF/7mwMAAABQeyJvcmlnaW4iOiJodHRwOi8vbG9jYWxob3N0OjMzMzMiLCJmZWF0dXJlIjoiUXVpY1RyYW5zcG9ydCIsImV4cGlyeSI6MTYwOTA5MzMyN30=", // Chromium QuicTransport origin trial token for http://localhost:3333
    },
  },
});
