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
    allowedHosts: "all",
    headers: {
      "Origin-Trial": "Ap99qRV6p2wigaFtSrZsnpG2lIyW+s25pMHp5RgsiIrZCPvQ3+PJCvvCEbWYELy3oW9iHyLZoRPbg3T4scUkJQ8AAABPeyJvcmlnaW4iOiJodHRwOi8vbG9jYWxob3N0OjMzMzMiLCJmZWF0dXJlIjoiV2ViVHJhbnNwb3J0IiwiZXhwaXJ5IjoxNjM0MDgzMTk5fQ==", // Chromium WebTransport origin trial token for http://localhost:3333
    },
    port: 3333,
    static: {
      directory: path.resolve(__dirname, "public"),
    },
  },
});
