import babel from '@rollup/plugin-babel'
import ts from 'rollup-plugin-typescript2'
import replace from '@rollup/plugin-replace'
import pkg from './package.json'
import terser from '@rollup/plugin-terser'
import dotenv from 'dotenv'

dotenv.config()

const { BASE_URL, NODE_ENV } = process.env

const PLUGINS = [
  ts({
    tsconfigOverride: { exclude: ['**/*.test.ts'] },
  }),
  babel({
    extensions: ['.ts', '.js', '.tsx', '.jsx'],
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
      { file: 'dist/index.umd.js', format: 'umd', name: 'OrbitalWidget' }, // UMD format for browsers
      { file: 'dist/index.umd.min.js', format: 'umd', name: 'OrbitalWidget', plugins: [terser()] }, // Minified UMD format
    ],
    plugins: PLUGINS,
  },
]
