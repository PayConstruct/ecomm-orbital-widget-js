const babel = require('rollup-plugin-babel')
const commonjs = require('@rollup/plugin-commonjs')
const resolve = require('@rollup/plugin-node-resolve')
const replace = require('@rollup/plugin-replace')
require('dotenv').config()

module.exports.default = [
  {
    input: 'src/index.js',
    output: {
      dir: 'dist',
      format: 'esm',
    },
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
        'process.env.API_URL': JSON.stringify(process.env.API_URL),
        preventAssignment: true,
      }),
      babel({ runtimeHelpers: true }),
      resolve(),
      commonjs(),
    ],
  },
]
