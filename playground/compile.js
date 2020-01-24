const { resolve } = require('path')
const _ = require('lodash')
const schema = require('./sinon-chrome-schema.json')
const { writeJSON } = require('fs-extra')

const chromeApi = schema.reduce(
  (
    r,
    { namespace, events = [], functions = [], properties = {} },
  ) => {
    const withEvents = events.reduce(addEvents, {})
    const withFns = functions.reduce(addFns, {})
    const withProps = Object.entries(properties).reduce(
      addProps,
      {},
    )

    const value = { ...withEvents, ...withFns, ...withProps }

    return _.set(r, namespace, value)
  },
  {},
)

writeJSON(
  resolve(__dirname, 'jest-chrome-schema.json'),
  chromeApi,
  {
    spaces: 2,
  },
)

function addEvents(
  r,
  {
    name,
    deprecated,
    parameters = [],
    supportsRules: rules = false,
  },
) {
  const p = parameters.map(
    ({
      name,
      optional = false,
      parameters: { length } = [],
      type,
    }) => ({ name, optional, parameters: length, type }),
  )

  return {
    ...r,
    [name]: {
      type: 'event',
      name,
      deprecated,
      parameters: p,
      rules,
    },
  }
}

function addFns(r, { name, deprecated, parameters = [] }) {
  const p = parameters.map(
    ({
      name,
      optional = false,
      parameters: { length } = [],
      type,
    }) => ({ name, optional, length, type }),
  )

  return {
    ...r,
    [name]: {
      type: 'function',
      name,
      deprecated,
      parameters: p,
    },
  }
}

function addProps(r, [name, { deprecated, value }]) {
  return {
    ...r,
    [name]: { type: 'property', name, deprecated, value },
  }
}
