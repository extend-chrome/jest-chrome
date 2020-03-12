import { createEvent } from './create-event'
import { Storage } from './jest-chrome'

/**
 * Namespace member data format from jest-chrome-schema.json
 *
 * @interface SchemaData
 * @template T Type of namespace member
 */
interface SchemaData<
  T extends 'event' | 'function' | 'property'
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

    const types = [
      'boolean',
      'number',
      'string',
      'function',
      'object',
    ]
    args.forEach((arg, i) => {
      const param = parameters[i]
      if (
        types.includes(param.type) &&
        typeof arg !== param.type
      ) {
        throw new TypeError(
          `Invalid argument for ${name}: (${param.name}) should be type "${param.type}"`,
        )
      }
    })

    return args
  })

  Object.assign(target, { [name]: event })

  return event
}

export const addFunction = (
  { name }: SchemaData<'function'>,
  target: any,
) => {
  const fn = jest.fn()
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
    clear: jest.fn(),
    get: jest.fn(),
    getBytesInUse: jest.fn(),
    remove: jest.fn(),
    set: jest.fn(),
  }
}
