import { js, preact, ts, web } from "@yoursunny/xo-config";

/** @type {import("xo").FlatXoConfig} */
const config = [
  js,
  {
    files: [
      "./mk/*.ts",
      "./src/**/*.{ts,tsx}",
    ],
    ...ts,
  },
  {
    files: [
      "./src/**/*.{ts,tsx}",
    ],
    ...web,
  },
  {
    files: [
      "./src/**/*.tsx",
    ],
    ...preact,
  },
];

export default config;
