import { createEvent } from './create-event'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('CallableEvent', () => {
  test('addListener', () => {
    const selector = (x: any) => [x]
    const event = createEvent(selector)
    const spy = jest.fn()

    event.addListener(spy)

    expect(event.hasListener(spy)).toBe(true)
    expect(event.hasListeners()).toBe(true)

    expect(spy).not.toBeCalled()
  })

  test('getListeners', () => {
    const selector = (x: any) => [x]
    const event = createEvent(selector)
    const spy = jest.fn()

    event.addListener(spy)

    const set = event.getListeners()

    expect(set.size).toBe(1)
    expect(set.has(spy)).toBe(true)

    expect(spy).not.toBeCalled()
  })

  test('hasListeners', () => {
    const selector = (x: any) => [x]
    const event = createEvent(selector)
    const spy = jest.fn()

    expect(event.hasListeners()).toBe(false)

    event.addListener(spy)

    expect(event.hasListeners()).toBe(true)

    expect(spy).not.toBeCalled()
  })

  test('hasListener 1', () => {
    const selector = (x: any) => [x]
    const event = createEvent(selector)
    const spy1 = jest.fn()
    const spy2 = jest.fn()

    expect(event.hasListener(spy1)).toBe(false)
    expect(event.hasListener(spy2)).toBe(false)

    event.addListener(spy1)

    expect(event.hasListener(spy1)).toBe(true)
    expect(event.hasListener(spy2)).toBe(false)

    expect(spy1).not.toBeCalled()
  })

  test('removeListener 1', () => {
    const selector = (x: any) => [x]
    const event = createEvent(selector)
    const spy = jest.fn()

    event.addListener(spy)
    event.removeListener(spy)

    expect(event.hasListener(spy)).toBe(false)

    expect(spy).not.toBeCalled()
  })

  test('removeListener 2', () => {
    const selector = (x: any) => [x]
    const event = createEvent(selector)
    const spy1 = jest.fn()
    const spy2 = jest.fn()

    event.addListener(spy1)
    event.addListener(spy2)

    expect(event.hasListener(spy1)).toBe(true)
    expect(event.hasListener(spy2)).toBe(true)

    event.removeListener(spy1)

    expect(event.hasListener(spy1)).toBe(false)
    expect(event.hasListener(spy2)).toBe(true)

    expect(spy1).not.toBeCalled()
    expect(spy2).not.toBeCalled()
  })

  test('callListeners 1', () => {
    const selector = (x: any) => [x]
    const event = createEvent(selector)
    const spy = jest.fn()

    event.addListener(spy)
    event.callListeners('test')

    expect(spy).toBeCalled()
    expect(spy).toBeCalledWith('test')
  })

  test('callListeners 2', () => {
    const selector = (x: any) => [x, 1]
    const event = createEvent(selector)
    const spy1 = jest.fn()
    const spy2 = jest.fn()

    event.addListener(spy1)
    event.addListener(spy2)
    event.callListeners('test1')
    event.callListeners('test2')
    event.removeListener(spy1)
    event.callListeners('test3')

    expect(spy1).toBeCalledTimes(2)
    expect(spy1).toBeCalledWith('test1', 1)
    expect(spy1).toBeCalledWith('test2', 1)
    expect(spy1).not.toBeCalledWith('test3', 1)

    expect(spy2).toBeCalledTimes(3)
    expect(spy2).toBeCalledWith('test1', 1)
    expect(spy2).toBeCalledWith('test2', 1)
    expect(spy2).toBeCalledWith('test3', 1)
  })

  test('callListeners 3', () => {
    const selector = (x: string, y: number) => Array(y).fill(x)
    const event = createEvent(selector)
    const spy = jest.fn()

    event.addListener(spy)
    event.callListeners('test', 3)

    expect(spy).toBeCalled()
    expect(spy).toBeCalledWith('test', 'test', 'test')
  })
})

describe('createEvent', () => {
  test('creates unique events', () => {
    const selector = (x: any) => [x]

    const event1 = createEvent(selector)
    const event2 = createEvent(selector)

    expect(event1).not.toBe(event2)

    const spy1 = jest.fn()
    const spy2 = jest.fn()

    event1.addListener(spy1)
    event2.addListener(spy2)

    const event = { message: 'test' }
    event1.callListeners(event)

    expect(spy1).toBeCalled()
    expect(spy2).not.toBeCalled()
  })
})
