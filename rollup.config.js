/* eslint-env node */

import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'lib/index.esm.js',
        format: 'esm',
        sourcemap: true,
      },
      {
        file: 'lib/index.cjs.js',
        format: 'cjs',
        sourcemap: true,
      },
    ],
    plugins: [
      typescript({
        tsconfig: './tsconfig.base.json',
      }),
      json(),
    ],
  },
]
