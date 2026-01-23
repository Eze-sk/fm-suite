# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.0] - 2026-01-23

### Added

- Full search implementation with Title and Tag filtering capabilities
- `CardSearch` component for challenge card filtering
- `SearchSection` component for search interface
- `Difficulty`, `Languages`, and `Plan` tag filter components
- ASCII logo integration with `Logo` component and `ASCIILogo.json` assets
- New CLI startup flow in `index.tsx`
- Auxiliary UI kit components: `AlertAuth`, `Center`, `Loaders`, and `TextInput`

### Changed

- Centralized color palette management via `colorPalette.ts`
- Established `MainSection` component architecture for layout organization

### Internal

- UI component structure reorganization for improved maintainability

## [0.3.0] - 2026-01-18

### Added

- `scraping` function to scrape data from the Frontend Mentor website
- `getChallenges` function to manage the scraping function and local data
- `getValidCache` utility function to validate cache files
- `waitUntil` utility function to manage code flow
- Types for challenges in the `challengeData` file in the typings folder
- `useInitialization` custom React hook to cascade startup functions

### Changed

- Refactored cookie logic in the `login` function in `auth.ts`
- Refactored `auth.ts` by moving constants to `env.ts` and removing unused imports
- Renamed `src/consts/safeRoutes.ts` to `src/consts/env.ts` with added constants

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

[Unreleased]: https://github.com/eze-sk/fm-suite/compare/v0.4.0...HEAD
[0.4.0]: https://github.com/eze-sk/fm-suite/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/eze-sk/fm-suite/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/eze-sk/fm-suite/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/eze-sk/fm-suite/releases/tag/v0.1.0
