# `@bumble/jest-chrome`

A complete mock of the Chrome API for Chrome extensions, for use
with Jest.

The `chrome` object is based on schemas from the Chromium
project, with thanks to
[`sinon-chrome`](https://github.com/acvetkov/sinon-chrome) for
compiling the schemas.

TypeScript support is built in. Each function and event is based
on
[`@types/chrome`](https://www.npmjs.com/package/@types/chrome).

## Installation

```sh
npm i @bumble/jest-chrome -D
```

We will set `chrome` in the global scope during setup so that it
is mocked in imported modules. We need a setup file for this:

```javascript
// jest.config.js

module.exports = {
  // Add this line to your Jest config
  setupFilesAfterEnv: ['./jest.setup.js'],
}
```

Then in the setup file we will assign the mocked `chrome` object
to the global object:

```javascript
// jest.setup.js

Object.assign(global, require('@bumble/jest-chrome'))
```

Now `chrome` will be mocked for all modules.

## Usage

> All of the following code blocks come from
> `tests/demo.test.ts`.

Import `chrome` from `@bumble/jest-chrome` for Intellisense and
linting. It will be the same object any imported modules use.

```javascript
import { chrome } from '@bumble/jest-chrome'
```

<!-- TODO: explain events -->

```javascript
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

<!-- TODO: explain simple functions -->

```javascript
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
```

<!-- TODO: explain functions with callback -->

```javascript
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
```

<!-- TODO: explain callbacks with lastError -->

```javascript
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
```
