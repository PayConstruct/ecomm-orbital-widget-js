const babel = require('rollup-plugin-babel')
const commonjs = require('@rollup/plugin-commonjs')
const resolve = require('@rollup/plugin-node-resolve')
const replace = require('@rollup/plugin-replace')
const postcss = require('rollup-plugin-postcss')
require('dotenv').config()

export default [
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
      postcss({
        extract: true,
        plugins: [require('tailwindcss'), require('autoprefixer')],
      }),
    ],
  },
]
