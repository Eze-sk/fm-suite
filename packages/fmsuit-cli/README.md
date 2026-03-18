# @fmsuit/cli

A command-line interface (CLI) to streamline the development workflow for Frontend Mentor challenges. This tool simplifies the process of starting and managing challenges, allowing developers to focus more on coding and less on setup.

## Features

- **Effortless Challenge Setup**: Quickly initialize new Frontend Mentor challenges with predefined structures.
- **Seamless Integration**: Designed to work smoothly with your existing development environment.
- **Configuration via `fm-cli.config.json`**: Customize your challenge workspace by specifying the base path where challenges will be added.

## Configuration

The `@fmsuit/cli` uses a configuration file named `fm-cli.config.json` to manage various settings, most notably the `challengesPath`. This path specifies the directory where new challenges will be created and managed.

Example `fm-cli.config.json`:

```json
{
  "challengesPath": "./frontend-mentor-challenges"
}
```

Ensure this file is present in your project's root directory or a location accessible by the CLI to properly manage your Frontend Mentor challenges.

## Usage

## Installation

You can install `@fmsuit/cli` using npm:

```bash
npm install @fmsuit/cli
```

## Usage

Once installed, you can use the `fm` command directly. you can use `npx`.

- **Start CLI**: `npm run fm`
