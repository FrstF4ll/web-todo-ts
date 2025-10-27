# Web todo template

## Prerequisites

- [Node.js](https://nodejs.org) version 24. **Use [fnm](https://github.com/Schniz/fnm?tab=readme-ov-file#installation) to get the latest version**
- [Pnpm](https://pnpm.io/installation#on-posix-systems) version 10. **Use pnpm official script for posix systems**

## Setup

1. Fork and clone this repository.
2. From your CLI, move to the project repository with `cd`.
3. Install the dependencies with `pnpm i`.

That's all ! You are ready to go.

## How to develop with this template ?

This template is based on [vite](https://vite.dev/), with some additional
tooling. Here are the most important things :

- Use `pnpm dev` command to launch the development server on [localhost:5173](http://localhost:5173/).
- Use `pnpm check-types` to launch the [TypeScript](https://www.typescriptlang.org/) type checker. This will verify the project type correctness.
- Use `pnpm format` to format all project files correctly.
- Use `pnpm lint` to run the [biome](https://biomejs.dev/) linter, and catch some errors statically.

These commands allow you to create good quality commits. Don't forget to lint and format before your commits.

## Continuous integration

This repo includes three [GitHub actions](https://docs.github.com/en/actions) :

- One to automatically deploy the project to GitHub pages. This workflow executes on each commit in the main branch. **You must update the `base` field in the [vite.config.ts](./vite.config.ts) file to your repository name for this to work !!! And activate GitHub pages source to `GitHub Actions` in your repository settings**.
- One to check the code formatting, linting and types, this one executes on pull requests.
