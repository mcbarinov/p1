# CLAUDE.md

This file provides guidance to AI agents when working with code in this repository.

## Critical Guidelines

0. **Read README.md first** - Always start by reading the README.md file when beginning work on the repository to understand the project context and setup. Follow all code style conventions and recommendations documented in README.md.

1. **Always communicate in English** - Regardless of the language the user speaks, always respond in English. All code, comments, and documentation must be in English.

2. **Minimal documentation** - Only add comments/documentation when it simplifies understanding and isn't obvious from the code itself. Keep it strictly relevant and concise.

3. **Critical thinking** - Always critically evaluate user ideas. Users can make mistakes. Think first about whether the user's idea is good before implementing.

4. **Package manager** - Always use pnpm for all package management operations. Never use npm, yarn, or other package managers.

5. **Development server** - Use `pnpm run agent-dev` to start the development server for testing. The `pnpm dev` command is reserved for human developers.
