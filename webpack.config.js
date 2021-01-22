// eslint-disable-next-line import/no-extraneous-dependencies
const path = require("path");

/** @return {import("webpack").Configuration} */
module.exports = (env, argv) => ({
  mode: argv.mode ?? "production",
  devtool: argv.mode === "development" ? "cheap-module-source-map" : "source-map",
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
    contentBase: path.resolve(__dirname, "public"),
    disableHostCheck: true,
    port: 3333,
    headers: {
      "Origin-Trial": "AkBSxDbplNDpjSJqthxgSgn9I99vuHZTCzxKEz2TqfVYH1l7A6xsJUQfwEZekfhoMDpcCz8FFXhfWwnrGzqZ7AAAAABQeyJvcmlnaW4iOiJodHRwOi8vbG9jYWxob3N0OjMzMzMiLCJmZWF0dXJlIjoiUXVpY1RyYW5zcG9ydCIsImV4cGlyeSI6MTYxMjA2NTUwMX0=", // Chromium QuicTransport origin trial token for http://localhost:3333
    },
  },
});
