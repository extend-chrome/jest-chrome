import { chrome } from '.'
import { Storage, Runtime } from './jest-chrome'
import {
  CallableEvent,
  EventCallback,
  MonotypeEventSelector,
} from './create-event'
import { readJSONSync } from 'fs-extra'
import { resolve } from 'path'

const chromeSchema = readJSONSync(
  resolve(__dirname, '..', 'jest-chrome-schema.json'),
)

afterEach(() => {
  delete chrome.runtime.lastError
})

test('get: namespace', () => {
  expect(chrome.runtime).toBeDefined()
  expect(chrome.runtime).toBe(chrome.runtime)
})

test('get: property', () => {
  expect(chrome.contextMenus.ACTION_MENU_TOP_LEVEL_LIMIT).toBe(6)
})

test('get: function', () => {
  expect(chrome.runtime.getManifest).toBe(
    chrome.runtime.getManifest,
  )
  expect(chrome.runtime.getManifest).not.toBeCalled()

  chrome.runtime.getManifest()

  expect(chrome.runtime.getManifest).toBeCalled()
})

test('get: event', () => {
  expect(chrome.runtime.onMessage).toMatchObject<
    CallableEvent<
      EventCallback,
      MonotypeEventSelector<EventCallback>
    >
  >({
    addListener: expect.any(Function),
    callListeners: expect.any(Function),
    clearListeners: expect.any(Function),
    hasListener: expect.any(Function),
    hasListeners: expect.any(Function),
    removeListener: expect.any(Function),
    toEvent: expect.any(Function),
  })

  expect(chrome.runtime.onMessage).toBe(chrome.runtime.onMessage)
})

test('ownKeys: namespaces', () => {
  expect(Object.keys(chrome)).toEqual(Object.keys(chromeSchema))
})

test('ownKeys: storage', () => {
  const { storage } = chrome
  const areas = Object.keys(storage)

  expect(areas).toContain('local')
  expect(areas).toContain('sync')
  expect(areas).toContain('managed')

  expect(storage.local).toMatchObject<Storage.StorageArea>({
    clear: expect.any(Function),
    get: expect.any(Function),
    getBytesInUse: expect.any(Function),
    remove: expect.any(Function),
    set: expect.any(Function),
  })
})

test('set: lastError correctly', () => {
  const lastErrorSpy = jest.fn(() => 'test')
  const lastError = {
    get message() {
      return lastErrorSpy()
    },
  } as Runtime.LastError
  const setter = () => (chrome.runtime.lastError = lastError)

  expect(setter).not.toThrow()
  expect(chrome.runtime.lastError?.message).toBe('test')
  expect(lastErrorSpy).toBeCalled()
})

test('set: lastError incorrectly', () => {
  const lastError = ('error' as unknown) as Runtime.LastError

  const setter = () => (chrome.runtime.lastError = lastError)

  expect(setter).toThrow()
  expect(chrome.runtime.lastError).toBeUndefined()
})

test('deleteProperty: lastError', () => {
  chrome.runtime.lastError = { message: 'test' }
  const setter = () => delete chrome.runtime.lastError

  expect(setter).not.toThrow()
  expect(chrome.runtime.lastError).toBeUndefined()
})

test('deleteProperty: delete namespace', () => {
  delete chrome.alarms

  expect('alarms' in chrome).toBe(false)
  expect(chrome.alarms).toBeUndefined()
})
