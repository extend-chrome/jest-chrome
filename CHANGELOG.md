# **Change Log** 📜📝

All notable changes to "**jest-chrome**" library will be
documented in this file.

The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and this
project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [**0.7.0**] - 2020-07-27

### Added

- Events now have the method `getListeners`, which returns a
  shallow copy of the internal listeners set

### Changed

- This repo was migrated to a new organization: `@extend-chrome`

### Removed

- The runtime argument type checks were removed

## [**0.5.3**] - 2020-05-29

### Fixed

- Fixed build output

## [**0.4.0**] - 2020-03-09

### Improved

- Move from jest.Mock to jest.MockedFunction
- Update README.md

### Added

- Add lastError example to demo test and README.md

## [**0.3.0**] - 2020-02-13

### Added

- Added `chrome.runtime.lastError` support

## [**0.2.0**] - 2020-02-10

### Added

- The `chrome.storage` API has been added.
