import { chrome } from '.'
import {
  CallableEvent,
  EventCallback,
  MonotypeEventSelector,
} from './create-event'

test('gets namespace', () => {
  expect(chrome.runtime).toBeDefined()
  expect(chrome.runtime).toBe(chrome.runtime)
})

test('gets property', () => {
  expect(chrome.contextMenus.ACTION_MENU_TOP_LEVEL_LIMIT).toBe(6)
})

test('gets function', () => {
  expect(chrome.runtime.getManifest).toBe(
    chrome.runtime.getManifest,
  )
  expect(chrome.runtime.getManifest).not.toBeCalled()

  chrome.runtime.getManifest()

  expect(chrome.runtime.getManifest).toBeCalled()
})

test('gets event', () => {
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
