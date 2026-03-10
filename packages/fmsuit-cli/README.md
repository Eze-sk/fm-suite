# @fmsuit/cli

A command-line interface (CLI) to streamline the development workflow for Frontend Mentor challenges. This tool simplifies the process of starting and managing challenges, allowing developers to focus more on coding and less on setup.

## Features

-   **Effortless Challenge Setup**: Quickly initialize new Frontend Mentor challenges with predefined structures.
-   **Seamless Integration**: Designed to work smoothly with your existing development environment.
-   **Configuration via `fm-cli.config.json`**: Customize your challenge workspace by specifying the base path where challenges will be added.

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

*(Installation instructions are currently omitted as the package is not yet published.)*

Once configured, you can use the CLI to:

-   Start a new challenge: `fm challenge start [challenge-name]`
-   Manage existing challenges: `fm challenge list`, `fm challenge open [challenge-name]`

More detailed usage instructions will be provided upon package publication.
