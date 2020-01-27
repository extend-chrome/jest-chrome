test('chrome is mocked', () => {
  expect(chrome).toBeDefined()
  expect(window.chrome).toBeDefined()
  expect(chrome.storage.local).toBeDefined()
})
