# WIP

# `@bumble/jest-chrome`

A complete mock of the Chrome API for Chrome extensions for use
with Jest.

The `chrome` object is based on schemas from the Chromium
project.

TypeScript support is built in. Each function and event is typed
using the types from `@types/chrome`.

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
