import { JestChrome as JestChromeNamespace } from './jest-chrome'
import jestChromeSchema from './jest-chrome-schema.json'
import {
  addEvent,
  addFunction,
  addProperty,
} from './add-elements'

export type JestChrome = typeof JestChromeNamespace

export const chrome = new Proxy<JestChrome>(
  {} as JestChrome,
  createHandler(),
)

export function createHandler(
  schema = jestChromeSchema as any,
): ProxyHandler<JestChrome> {
  return {
    ownKeys() {
      return Reflect.ownKeys(schema)
    },
    getOwnPropertyDescriptor(target, prop) {
      if (prop in schema) {
        return {
          enumerable: true,
          configurable: true,
        }
      } else {
        return {
          enumerable: false,
          configurable: false,
        }
      }
    },
    get(target, key) {
      if (key in target) {
        return Reflect.get(target, key)
      } else if (key in schema) {
        switch (schema[key].type) {
          case 'event':
            return addEvent(schema[key], target)
          case 'function':
            return addFunction(schema[key], target)
          case 'property':
            return addProperty(schema[key], target)

          // default is namespace
          default: {
            const proxy = new Proxy<Record<string, any>>(
              {},
              createHandler(schema[key]),
            )

            Object.assign(target, { [key]: proxy })

            return proxy
          }
        }
      } else {
        return undefined
      }
    },
  }
}
