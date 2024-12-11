/** @typedef {import("xo").Options} XoOptions */

/** @type {import("@yoursunny/xo-config")} */
const { js, ts, web, preact, merge } = require("@yoursunny/xo-config");

/** @type {XoOptions} */
module.exports = {
  ...js,
  overrides: [
    {
      files: [
        "./mk/*.ts",
      ],
      ...merge(js, ts),
    },
    {
      files: [
        "./src/**/*.ts",
      ],
      ...merge(js, ts, web),
    },
    {
      files: [
        "./src/**/*.tsx",
      ],
      ...merge(js, ts, web, preact, {
        rules: {
          "etc/no-implicit-any-catch": "off",
        },
      }),
    },
  ],
};
