console.clear()

const _ = require('lodash')
const path = require('path')
const fs = require('fs-extra')
const prettier = require('prettier')

const code = fs.readFileSync(
  path.join(__dirname, 'jest-chrome-src.d.ts'),
  'utf8',
)

const replaced = [
  fixMultilineComments,
  fixNamespaces,
  fixFunctionExports,
].reduce((x, fn) => fn(x), code)

fs.writeFileSync(
  path.join(__dirname, 'jest-chrome-dest.d.ts'),
  prettier.format(replaced, {
    parser: 'typescript',
    printWidth: 80,
    semi: false,
  }),
)

function fixMultilineComments(code) {
  return code
    .replace(/^( *)\/\*\* ([^n][^*\n]+)$/gm, '$1/**\n$1 * $2') // Fix sloppy multiline comments
    .replace(/^( *) \* ([^n][^*\n]+)\*\/$/gm, '$1 * $2\n$1 */') // Fix sloppy multiline comments
    .replace(/( *)\* +\*\//gm, '$1*/') // Fix irregular multiline comment terminations
    .replace(/^( +?)(\* .+?\n)(?= *[^\s])/gm, '$1$2$1*\n') // Separate paragraphs
    .replace(/^ * \* ?\n( +)\*\//gm, '$1*/') // Remove last empty comment line
}

function fixNamespaces(code) {
  const namespaces = new Set()

  return code
    .replace(/namespace JestChrome\.(\b.+?\b)/g, (match, g1) => {
      const space = _.upperFirst(g1)
      namespaces.add(space)

      return 'namespace ' + space
    })
    .replace(
      /( +)\/\/ JestChrome namespaces/,
      [...namespaces]
        .map(
          (space) =>
            `$1export { ${space} as ${_.lowerFirst(space)} }`,
        )
        .join('\n'),
    )
}

function fixFunctionExports(code) {
  return code.replace(
    /^( +)export function (\b.+?\b)\((.+)\): ([\w.]+)/gm, // Get function export
    (
      match,
      indent, // Indentation
      fnName, // Function name
      params, // Params
      returnType, // Return type
    ) => {
      const callbacks = []
      const generics = []

      const types = params
        .replace(
          /\(.+\) => \b.+\b/g, // Get function callback
          (match) => `callback${callbacks.push(match) - 1}`,
        )
        .replace(
          /[A-Z][A-z]+<.+>/g,
          (match) => `generic${generics.push(match) - 1}`,
        )
        .split(', ')
        .map((param) => {
          const [, pName, type] = param
            .split(/^([\w]+\??):/)
            .map((x) => x.trim())

          const isOptional = pName.endsWith('?')
          const isCallback = type.startsWith('callback')
          const isGeneric = type.startsWith('generic')

          let result = type
          if (isCallback) {
            const i = type.replace(/callback(\d+)/, '$1')
            result = `(${callbacks[parseInt(i)]})`
          } else if (isGeneric) {
            const i = type.replace(/generic(\d+)/, '$1')
            result = `(${generics[parseInt(i)]})`
          }

          return `(${result})${isOptional ? '?' : ''}`
        })
        .join(', ')

      const transformed = `${indent}export type ${fnName} = jest.Mock<${returnType}, [${types}]>`

      return transformed
    },
  )
}
