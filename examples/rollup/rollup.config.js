import babel from 'rollup-plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import postcss from 'rollup-plugin-postcss'
import html from 'rollup-plugin-html'
import dotenv from 'dotenv'

dotenv.config()

const pages = [
  { input: 'src/form.js', output: 'dist/form.js', template: 'public/form.html' },
  { input: 'src/payment.js', output: 'dist/payment.js', template: 'public/payment.html' },
  { input: 'src/success.js', output: 'dist/success.js', template: 'public/success.html' },
]

export default pages.map(page => ({
  input: page.input,
  output: {
    file: page.output,
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
    html({
      template: page.template,
      filename: page.output.replace('.js', '.html'), // Outputs the corresponding HTML file
      inject: true, // Automatically injects the generated JS
    }),
  ],
}))
