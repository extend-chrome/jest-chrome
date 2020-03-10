import { JestChrome } from '../jest-chrome'
import { createHandler } from './createHandler'

export const chrome = new Proxy<JestChrome>(
  {} as JestChrome,
  createHandler(),
)
