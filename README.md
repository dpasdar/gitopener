# GitOpener

A Visual Studio Code extension that allows you to quickly open the Git repository URL in your default web browser.

## Features

- Open the current repository's remote URL in your default browser with a single command
- Supports multiple remote configurations (origin, upstream, etc.)
- Works with both HTTPS and SSH repository URLs
- Simple and intuitive command palette integration

## Usage

1. Open a Git repository in VS Code
2. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac) to open the command palette
3. Type "Open Git Repository" and select the command
4. The repository URL will open in your default web browser

## Extension Settings

This extension contributes the following settings:

* `gitopener.defaultRemote`: Set the default remote to use when opening the repository URL (default: "origin")

## Known Issues

- Currently only supports GitHub, GitLab, and Bitbucket repository URLs
- SSH URLs are converted to HTTPS format for browser compatibility
