# Changelog

## [Unreleased]

### Removed

- `useBucket`: This export will be removed in version 1.0.0.

## [0.5.0] - 2020-01-15

### Added

- `getBucket`: The arguments are reversed from `useBucket`. The
  bucket name is the first argument, and the native storage area
  name is the second optional argument. If no second argument is
  provided, the default is "local", the local Chrome API storage.

### Changed

- Updated `README.md` with Features and API sections.
- Tests were converted to TypeScript.
- Various bugfixes during test conversion.

### Deprecated

- `useBucket`: This name is misleading by implying that it is a
  React hook, which is not true. `useBucket` will be removed in
  version 1.0.0.
