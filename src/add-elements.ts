import { createEvent } from './create-event'

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
  { name, parameters, deprecated }: SchemaData<'event'>,
  target: any,
) => {
  if (deprecated) {
    console.warn(deprecated)
  }

  const event = createEvent((...args: any[]) => {
    if (args.length > parameters.length) {
      throw new Error(
        `Max number of arguments for ${name}.addListener is ${length}`,
      )
    }

    args.forEach((arg, i) => {
      const param = parameters[i]
      if (typeof arg !== param.type) {
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
  { name, deprecated }: SchemaData<'function'>,
  target: any,
) => {
  if (deprecated) {
    console.warn(deprecated)
  }

  const fn = jest.fn()
  Object.assign(target, { [name]: fn })

  return fn
}

export const addProperty = (
  { name, value = null, deprecated }: SchemaData<'property'>,
  target: any,
) => {
  if (deprecated) {
    console.warn(deprecated)
  }
  
  // TODO: set property by type
  Object.assign(target, { [name]: value })

  return value
}
