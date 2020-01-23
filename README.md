<p align="center">
  <a href="http://bit.ly/35jbrc5" rel="noopener">
 <img width=200px height=200px src="https://i.imgur.com/vDjh5SL.png" alt="@bumble/storage logo"></a>
</p>

<h3 align="center">@bumble/storage</h3>

<div align="center">

[![npm (scoped)](https://img.shields.io/npm/v/@bumble/storage.svg)](http://bit.ly/2KA6cNp)
[![GitHub last commit](https://img.shields.io/github/last-commit/bumble-org/storage.svg)](http://bit.ly/35jbrc5)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)
[![TypeScript Declarations Included](https://img.shields.io/badge/types-TypeScript-informational)](#typescript)

[![Fiverr: We make Chrome extensions](https://img.shields.io/badge/Fiverr%20-We%20make%20Chrome%20extensions-brightgreen.svg)](http://bit.ly/37mZsfA)
[![ko-fi](https://img.shields.io/badge/ko--fi-Buy%20me%20a%20coffee-ff5d5b)](http://bit.ly/2qmaQYB)

</div>

---

Manage Chrome Extension storage easily with `@bumble/storage`.

This is a wrapper for the Chrome Extension Storage API that adds
promises and functional set transactions similar to the React
`this.setState` API. Functional set transactions make it easy to
use the Chrome Storage API to share and manage state between
different contexts in a Chrome Extension.

> This library is in beta until version 1.0.0. The API may change
> between minor versions.

# Table of Contents

- [Getting Started](#getting_started)
- [Usage](#usage)
- [Features](#features)
- [API](#api)
  - [interface Bucket](#api-bucket)
    - [bucket.get()](#api-bucket-get)
    - [bucket.set()](#api-bucket-set)
    - [bucket.remove()](#api-bucket-remove)
    - [bucket.clear()](#api-bucket-clear)
    - [bucket.changeStream](#api-bucket-changeStream)
    - [bucket.valueStream](#api-bucket-valueStream)
  - [function getBucket()](#api-getBucket)

# Getting started <a name = "getting_started"></a>

You will need to use a bundler like
[Rollup](https://rollupjs.org/guide/en/), Parcel, or Webpack to
include this library in your Chrome extension.

See [`rollup-plugin-chrome-extension`](http://bit.ly/35hLMR8) for
an easy way to use Rollup to build your Chrome extension!

## Installation

```sh
npm i @bumble/storage
```

# Usage <a name = "usage"></a>

Add the `storage` permission to your `manifest.json` file.

```jsonc
// manifest.json
{
  "permissions": ["storage"]
}
```

Take your Chrome extension to another level! 🚀

```javascript
import { storage } from '@bumble/storage'

// Set storage using an object
storage.set({ friends: ['Jack'] })

// Set storage using a function
storage.set(({ friends }) => {
  // friends is ['Jack']
  return { friends: [...friends, 'Amy'] }
})

// Get storage value using a key
storage.get('friends').then(({ friends }) => {
  // friends is ['Jack', 'Amy']
})

// Get storage values using an object
storage
  .get({ friends: [], enemies: [] })
  .then(({ friends, enemies }) => {
    // friends is ['Jack', 'Amy']
    // enemies is the [] from the getter object
  })
```

# Features <a name = "features"></a>

## Promises and functional setters <a name = "features-async"></a>

The Chrome Storage API is asynchronous. This means synchronous
calls to `get` and `set` will not reflect pending changes. This
makes calls to `set` that depend on values held in storage
difficult.

While the Chrome Storage API is async, it uses callbacks. This
brings a whole world of difficulty into the developer experience
that have been solved with Promises.

`@bumble/storage` solves both of these problems. Every method
returns a Promise and both `get` and `set` can take a function
that provides current storage values, similar to React's
`this.setState`.

## Extensive TypeScript support <a name = "features-typescript"></a>

This library allows you to create a storage area and define the
type of data that area will manage.

<!-- TODO: Convert code block to GIF -->

```typescript
import { getBucket } from '@bumble/storage'

interface Store {
  a: string
  b: number
}

const store = getBucket<Store>('store')

store.set({ a: 'abc', b })
store.set(({ b = 0 }) => ({ b: b + 500 }))

store.set({ c: true }) // ts error
store.set(({ a }) => ({ d: 'invalid' })) // ts error
```

## Composed set operations <a name = "features-composed"></a>

The `set` method can be called with a function (setter) as well
as the normal types (a string, array of strings, or an object).

This setter will receive the entire contents of that storage area
as an argument. It must return an object which will be passed to
the native storage area `set` method.

Synchronous calls to `set` will be composed into one call to the
native `set`. The setters will be applied in order, but each call
will resolve with the final value passed to the storage area.

```javascript
bucket.set({ a: 123 })
bucket.set({ b: 456 })
bucket
  .set(({ a, b }) => {
    // a === 123
    // b === 456
    return { c: 789 }
  })
  .then(({ a, b, c }) => {
    // New values in bucket
    // a === 123
    // b === 456
    // c === 789
  })
```

An individual call to `set` will reject if the setter function
throws an error or returns an invalid type, but will not affect
other set operations.

# API <a name = "api"></a>

## interface `Bucket` <a name = "api-bucket"></a>

A synthetic storage area. It has the same methods as the native
Chrome API StorageArea, but `get` and `set` can take a function as an
argument. A `Bucket` can use
[either local or sync storage](https://developer.chrome.com/extensions/storage#using-sync).

Multiple synchronous calls to set are composed into one call to
the native Chrome API
[`StorageArea.set`](https://developer.chrome.com/extensions/storage#method-StorageArea-set).

Default storage areas are included, so you can just import
`storage` if you're don't care about types and only need one
storage area.

```javascript
import { storage } from '@bumble/storage'

storage.local.set({ a: 'abc' })
storage.sync.set({ b: 123 })
```

Create a bucket or two using [`getBucket`](#api-getBucket):

```javascript
import { getBucket } from '@bumble/storage'

// Buckets are isomorphic, so export and
// use them throughout your extension
export const bucket1 = getBucket('bucket1')
export const bucket2 = getBucket('bucket2')
```

Each bucket is separate, so values don't overlap.

```javascript
bucket1.set({ a: 123 })
bucket2.set({ a: 'abc' })

bucket1.get() // { a: 123 }
bucket2.get() // { a: 'abc' }
```

Buckets really shine if you're using TypeScript, because you can
define the types your bucket will contain.
[Click here for more details.](#features-typescript)

## async function `bucket.get` <a name = "api-bucket-get"></a>

Takes an optional getter. Resolves to an object with the
requested storage area values.

<details><summary>Parameters</summary>
<p>

```typescript
function get(getter?: string | object | Function) => Promise<{ [key: string]: any }>
```

**[getter]**\
Type: `null`, `string`, `string array`, or `function`\
Default: `null`\
Usage is the same as for the native Chrome API, except for the function
getter.

- Use `null` to get the entire bucket contents.
- Use a `string` as a storage area key to get an object with only
  that key/value pair.
- Use an `object` with property names for the storage keys you
  want.
  - The values for each property will be used if the key is
    undefined in storage.
- Use a `function` to map the contents of storage to any value.
  - The function will receive the entire contents of storage as
    the first argument.
  - The call to get will resolve to the function's return value.
- Calls to `get` after `set` will resolve to the new set values.

</p>
</details>

```typescript
bucket.get('a') // resolves to object as key/value pair
bucket.get({ a: 123 }) // same, but 123 is default value
bucket.get(({ a }) => a) // resolves to value of "a"
```

## async function `bucket.set` <a name = "api-bucket-set"></a>

Set a value or values in storage. Takes a setter `object` or
`function`. Resolves to the new bucket values.

<details><summary>Parameters</summary>
<p>

```typescript
function set(setter: object | Function) => Promise<{ [key: string]: any }>
```

**`setter`**\
Type: `object` or `Function`

- Use an `object` with key/value pairs to set those values to
  storage.
- Use a `Function` that returns an object with key/value pairs.
  - The setter function receives the results of previous
    synchronous set operations.
  - The setter function cannot be an async function.
- Returns a `Promise` that resolves to the new storage values.
- Calls to `get` after `set` will resolve with the new values.

```typescript
// Values in bucket: { a: 'abc' }

// First call to set
bucket.set({ b: 123 })

// Second synchronous call to set
bucket
  .set(({ a, b, c }) => {
    // Values composed from storage
    // and previous call to set:
    // a === 'abc'
    // b === 123
    // c === undefined
    return { c: true }
  })
  .then(({ a, b, c }) => {
    // New values in storage
    // a === 'abc'
    // b === 123
    // c === true
  })
```

</p>
</details>

```typescript
bucket.set({ a: 123 })
bucket
  .set(({ a }) => ({ b: true }))
  .then(({ a, b }) => {
    // Values were set
    // a === 123
    // b === true
  })
```

## async function `bucket.remove` <a name = "api-bucket-remove"></a>

Remove a value or values from storage. Resolves when the
operation is complete.

```typescript
bucket.remove('a')
bucket.remove(['a', 'b'])
```

## async function `bucket.clear` <a name = "api-bucket-clear"></a>

Empties only this bucket. Resolves when the operation is
complete. Other buckets are untouched.

```typescript
bucket.clear()
```

## async function `bucket.changeStream` <a name = "api-bucket-changeStream"></a>

An RxJs Observable that emits a
[StorageChange](https://developer.chrome.com/extensions/storage#type-StorageChange)
object when the Chrome Storage API `onChanged` event fires.

```typescript
bucket.changeStream
  .pipe(filter(({ a }) => !!a))
  .subscribe(({ a }) => {
    console.log('old value', a.oldValue)
    console.log('new value', a.newValue)
  })
```

## async function `bucket.valueStream` <a name = "api-bucket-valueStream"></a>

An Observable that emits all the values in storage immediately,
and when `onChanged` fires.

```typescript
bucket.valueStream.subscribe((values) => {
  console.log('Everything in this bucket', values)
})
```

## function `getBucket` <a name = "api-getBucket"></a>

Create a [bucket](#api-bucket) (a synthetic storage area). Takes
a string `bucketName` and an optional string `areaName`. Returns
a [`Bucket`](#api-bucket) synthetic storage area. Export this
bucket and use it throughout your Chrome extension. It will work
everywhere, including privileged pages and content scripts.

`getBucket` is a TypeScript Generic. Pass it an interface to
define the types to expect in your storage area.

<details><summary>Parameters</summary>
<p>

```typescript
function getBucket(bucketName: string, areaName?: 'local' | 'sync') => Bucket
```

**`bucketName`**\
Type: `string`\
A unique id for this bucket.

**`[areaName]`**\
Type: `"local"` or `"sync"`\
Default: `"local"`\
Choose which [native Chrome API storage area](https://developer.chrome.com/extensions/storage#using-sync)
to use.

</p>
</details>

```typescript
import { getBucket } from '@bumble/storage'

// JavaScript
export const localBucket = getBucket('bucket1')
export const syncBucket = getBucket('bucket2', 'sync')

// TypeScript
export const localBucket = getBucket<{ a: string }>('bucket1')
export const syncBucket = getBucket<{ b: number }>(
  'bucket2',
  'sync',
)
```
