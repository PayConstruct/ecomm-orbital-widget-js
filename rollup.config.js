import babel from '@rollup/plugin-babel'
import replace from '@rollup/plugin-replace'
import pkg from './package.json'
import terser from '@rollup/plugin-terser'
import dotenv from 'dotenv'
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import image from '@rollup/plugin-image'
import { dts } from 'rollup-plugin-dts'
import del from 'rollup-plugin-delete'

dotenv.config()

const { BASE_URL, NODE_ENV } = process.env

const PLUGINS = [
  resolve(),
  commonjs(),
  image(),
  postcss({
    inject: true,
    minimize: true,
    modules: {
      generateScopedName: '[name]__[local]___[hash:base64:5]',
    },
    use: [['sass', { implementation: require('sass') }]],
    sourceMap: true,
  }),
  typescript({ tsconfig: './tsconfig.json' }),
  babel({
    extensions: ['.ts', '.js', '.tsx', '.jsx'],
    exclude: /node_modules/,
    babelHelpers: 'bundled',
  }),
  replace({
    _VERSION: JSON.stringify(pkg.version),
    preventAssignment: true,
    'process.env.BASE_URL': JSON.stringify(BASE_URL),
    'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
  }),
]

export default [
  {
    input: 'src/index.ts',
    output: [
      { file: 'dist/index.js', format: 'cjs' },
      { file: 'dist/index.mjs', format: 'es' },
    ],
    plugins: PLUGINS,
  },
  {
    input: 'src/index.ts',
    output: [
      { file: 'dist/index.umd.js', format: 'umd', name: 'OrbitalWidget' },
      { file: 'dist/index.umd.min.js', format: 'umd', name: 'OrbitalWidget', plugins: [terser()] },
    ],
    plugins: PLUGINS,
  },
  {
    input: 'src/types/index.d.ts',
    output: [{ file: 'dist/types/index.d.ts', format: 'es' }],
    plugins: [dts(), del({ hook: 'buildEnd', targets: './dist/components' })],
  },
]
