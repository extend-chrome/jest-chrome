# WIP

# `@bumble/jest-chrome`

A complete mock of the Chrome API for Chrome extensions, for use
with Jest.

The `chrome` object is based on schemas from the Chromium
project, with thanks to
[`sinon-chrome`](https://github.com/acvetkov/sinon-chrome) for
compiling the schemas.

TypeScript support is built in. Each function and event is typed
using the types from
[`@types/chrome`](https://www.npmjs.com/package/@types/chrome).

## Usage

```javascript
import { chrome } from '@bumble/jest-chrome'

test('chrome api functions', () => {
  const manifest = {
    name: 'my chrome extension',
    manifest_version: 2,
    version: '1.0.0',
  }

  chrome.runtime.getManifest.mockImplementation(() => manifest)

  expect(chrome.runtime.getManifest()).toEqual(manifest)
  expect(chrome.runtime.getManifest).toBeCalled()
})

test('chrome api functions with callback', () => {
  const message = { greeting: 'hello?' }
  const response = { greeting: 'here I am' }
  const callbackSpy = jest.fn()

  chrome.runtime.sendMessage.mockImplementation(
    (message, callback) => {
      callback(response)
    },
  )

  chrome.runtime.sendMessage(message, callbackSpy)

  expect(chrome.runtime.sendMessage).toBeCalledWith(
    message,
    callbackSpy,
  )
  expect(callbackSpy).toBeCalledWith(response)
})

test('chrome api functions with lastError', () => {
  const message = { greeting: 'hello?' }
  const response = { greeting: 'here I am' }

  const lastErrorSpy = jest.fn()
  const callbackSpy = jest.fn(() => {
    if (chrome.runtime.lastError) {
      lastErrorSpy(chrome.runtime.lastError.message)
    }
  })

  const lastErrorMessage = 'this is an error'
  const lastErrorGetter = jest.fn(() => lastErrorMessage)
  const lastError = {
    get message() {
      return lastErrorGetter()
    },
  }

  chrome.runtime.sendMessage.mockImplementation(
    (message, callback) => {
      chrome.runtime.lastError = lastError

      callback(response)

      delete chrome.runtime.lastError
    },
  )

  chrome.runtime.sendMessage(message, callbackSpy)

  expect(chrome.runtime.sendMessage).toBeCalledWith(
    message,
    callbackSpy,
  )

  expect(callbackSpy).toBeCalledWith(response)
  expect(lastErrorGetter).toBeCalled()
  expect(lastErrorSpy).toBeCalledWith(lastErrorMessage)

  expect(chrome.runtime.lastError).toBeUndefined()
})

test('chrome api events', () => {
  const listenerSpy = jest.fn()
  const sendResponseSpy = jest.fn()

  chrome.runtime.onMessage.addListener(listenerSpy)

  expect(listenerSpy).not.toBeCalled()
  expect(chrome.runtime.onMessage.hasListeners()).toBe(true)

  chrome.runtime.onMessage.callListeners(
    { greeting: 'hello' }, // message
    {}, // MessageSender object
    sendResponseSpy, // SendResponse function
  )

  expect(listenerSpy).toBeCalledWith(
    { greeting: 'hello' },
    {},
    sendResponseSpy,
  )
  expect(sendResponseSpy).not.toBeCalled()
})
```
