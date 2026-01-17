# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2026-01-16

### Added
- `login` function to `auth.ts` for authenticating users through the browser
- `verifySession` function to `auth.ts` for validating user session status
- `findChromiumBasedBrowser` utility function to locate Chromium-based browser executables across Windows, macOS, and Linux
- Support for Chrome, Edge, and Brave browsers in `findChromiumBasedBrowser`
- Constant definitions to `safeRoutes.ts` for application paths and configuration

### Changed
- Enhanced browser detection capabilities for cross-platform compatibility

## [0.1.0] - 2026-01-16

### Added
- Initial project setup and scaffolding
- TypeScript configuration and build tooling
- ESLint configuration for code quality
- Development environment initialization
- Core project structure with src, utils, and consts directories
- Base dependencies and package configuration

[Unreleased]: https://github.com/eze-sk/fm-suite/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/eze-sk/fm-suite/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/eze-sk/fm-suite/releases/tag/v0.1.0
