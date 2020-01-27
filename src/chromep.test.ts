import chromep from 'chrome-promise'
import { chrome } from '.'

it('works with chrome-promise', async () => {
  const alarms = [{ name: 'alarm', scheduledTime: 0 }]
  chrome.alarms.getAll.mockImplementation((cb) => {
    cb([{ name: 'alarm', scheduledTime: 0 }])
  })

  expect(await chromep.alarms.getAll()).toStrictEqual(alarms)
})
