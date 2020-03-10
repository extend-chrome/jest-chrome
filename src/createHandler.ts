import jestChromeSchema from '../jest-chrome-schema.json';
import { addEvent, addFunction, addProperty } from './add-elements';
import { JestChrome } from '../jest-chrome';

export function createHandler(schema = jestChromeSchema as any): ProxyHandler<JestChrome> {
  return {
    ownKeys() {
      return Reflect.ownKeys(schema);
    },
    getOwnPropertyDescriptor(target, prop) {
      if (prop in schema) {
        return {
          enumerable: true,
          configurable: true,
        };
      }
      else {
        return {
          enumerable: false,
          configurable: false,
        };
      }
    },
    set(target, key, value) {
      if (key in schema &&
        key === 'lastError' &&
        !(typeof value === 'object' &&
          typeof value?.message === 'string')) {
        throw new TypeError('chrome.runtime.lastError should be type { message: string }');
      }
      return Reflect.set(target, key, value);
    },
    deleteProperty(target, key) {
      // Mark property as deleted, so it won't be retrieved from the schema
      return Reflect.set(target, key, null);
    },
    has(target, key) {
      const inTarget = key in target && Reflect.get(target, key);
      return inTarget !== null && !!inTarget;
    },
    get(target, key) {
      if (key in target) {
        const value = Reflect.get(target, key);
        // Check that the value wasn't deleted
        return value !== null ? value : undefined;
      }
      else if (key in schema) {
        switch (schema[key].type) {
          case 'event':
            return addEvent(schema[key], target);
          case 'function':
            return addFunction(schema[key], target);
          case 'property':
            return addProperty(schema[key], target);
          // default is namespace
          default: {
            const proxy = new Proxy<Record<string, any>>({}, createHandler(schema[key]));
            Object.assign(target, { [key]: proxy });
            return proxy;
          }
        }
      }
      else {
        return undefined;
      }
    },
  };
}
