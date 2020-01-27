import { chrome } from '.'
import { Storage } from './jest-chrome'
import {
  CallableEvent,
  EventCallback,
  MonotypeEventSelector,
} from './create-event'
import { readJSONSync } from 'fs-extra'
import { join } from 'path'

const chromeSchema = readJSONSync(
  join(__dirname, 'jest-chrome-schema.json'),
)

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
