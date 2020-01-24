const path = require('path')
const fs = require('fs-extra')
const prettier = require('prettier')

const code = fs.readFileSync(
  path.join(__dirname, 'jest-chrome-src.d.ts'),
  'utf8',
)

fs.writeFileSync(
  path.join(__dirname, 'jest-chrome-src.d.ts'),
  prettier.format(code, {
    printWidth: 200,
    parser: 'typescript',
    semi: false,
  }),
)
