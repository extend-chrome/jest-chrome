import { createEvent } from './create-event'
import { Storage } from './jest-chrome'

/**
 * Namespace member data format from jest-chrome-schema.json
 *
 * @interface SchemaData
 * @template T Type of namespace member
 */
interface SchemaData<
  T extends 'event' | 'function' | 'property',
> {
  name: string
  type: T
  deprecated: string | false
  parameters: T extends 'event' | 'function'
    ? {
        name: string
        optional: boolean
        parameters: number
        type: string
      }[]
    : never[]
  value: T extends 'property' ? any : undefined
}

export const addEvent = (
  { name, parameters }: SchemaData<'event'>,
  target: any,
) => {
  const event = createEvent((...args: any[]) => {
    if (args.length > parameters.length) {
      throw new Error(
        `Max number of arguments for ${name}.addListener is ${length}`,
      )
    }

    // const types = [
    //   'boolean',
    //   'number',
    //   'string',
    //   'function',
    //   'object',
    // ]
    // args.forEach((arg, i) => {
    //   const param = parameters[i]
    //   if (
    //     types.includes(param.type) &&
    //     typeof arg !== param.type
    //   ) {
    //     throw new TypeError(
    //       `Invalid argument for ${name}: (${param.name}) should be type "${param.type}"`,
    //     )
    //   }
    // })

    return args
  })

  Object.assign(target, { [name]: event })

  return event
}

/** As of Manifest v3, all the Chrome API functions that accepted a callback
 * now return promises when the callback is not supplied.
 */
const makeAsyncMock = (callbackArgIndex: number) =>
  jest
    .fn()
    .mockImplementation(
      (...args: any[]): Promise<void> | void => {
        if (!args[callbackArgIndex]) {
          return Promise.resolve()
        }
      },
    )

export const addFunction = (
  { name, parameters }: SchemaData<'function'>,
  target: any,
) => {
  const fn =
    parameters?.length &&
    parameters[parameters.length - 1]?.name === 'callback' &&
    parameters[parameters.length - 1]?.type === 'function'
      ? makeAsyncMock(parameters.length - 1)
      : jest.fn()
  Object.assign(target, { [name]: fn })

  return fn
}

export const addProperty = (
  { name, value = undefined }: SchemaData<'property'>,
  target: any,
) => {
  switch (value) {
    case '%storage%':
      value = addStorageArea()
      break

    default:
    // do nothing
  }

  // TODO: set property by type
  Object.assign(target, { [name]: value })

  return value
}

export function addStorageArea(): Storage.StorageArea {
  return {
    clear: makeAsyncMock(0),
    get: makeAsyncMock(1),
    getBytesInUse: jest.fn(),
    remove: makeAsyncMock(1),
    set: makeAsyncMock(1),
  }
}
