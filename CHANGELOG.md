# Changelog

All notable changes to this project are documented in this file.

This project follows Semantic Versioning.

## [0.1.6] - 2026-02-16

### Added

- Added viewport-based start with `startOnView` using `IntersectionObserver`.
- Added observer options: `once`, `root`, `rootMargin`, and `threshold`.

## [0.1.4] - 2026-02-16

### Fixed

- Fixed paused animation behavior when calling `start()` again. It now resumes from the paused point instead of jumping directly to the final value.

## [0.1.2] - 2026-02-16

### Changed

- Package name migrated to scoped npm package: `@nullsablex/counter-up`.
- README updated for scoped installation/import and npm badges.
- Release workflow updated with npm scope configuration for `@nullsablex`.

## [0.1.1] - 2026-02-16

### Added

- GitHub Actions workflows for CI, release to npm, dependency review, CodeQL, and first-interaction welcome messages.
- Project governance files: `LICENSE`, `CONTRIBUTING.md`, and `CODE_OF_CONDUCT.md`.
- README badges and GitHub Pages demo link.

### Changed

- README structure and wording for a cleaner, more professional presentation.
- Build banner generation now reads metadata (including version) from `package.json`.

## [0.1.0] - 2026-02-16

### Added

- Initial public version of the counter animation library.
- ESM and UMD outputs, including minified bundles.
- Single and multi-element targeting (`id`, `class`, `NodeList`, array of elements).
- Instance controls: `start`, `pause`, `resume`, `stop`, `reset`, `set`, `update`, `destroy`.
