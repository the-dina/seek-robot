# Robot Challenge

A TypeScript application simulating a toy robot moving on a 5x5 tabletop.

For detailed requirements, see [requirements.md](requirements.md).

## Requirements

This application requires **Node.js v20** or higher. Install using nvm:

```bash
nvm use
```

## Getting Started

```bash
# Install dependencies
npm install

# Run the application interactively
npm run dev

# Run with example files
npm run dev test-data/example1.txt
npm run dev test-data/example2.txt
npm run dev test-data/example3.txt

# Run tests
npm run test

# View test coverage
npm run test:coverage

# Access test UI
npm run test:ui
```

## Architecture

The application follows a clean 3-layer architecture:

- **Domain Layer**: Pure business logic with no external dependencies
- **Application Layer**: Orchestrates domain objects using the command pattern
- **Infrastructure Layer**: Handles I/O and external dependencies

> **Note**: As requested, the application may seem slightly overengineered. I didn't get the chance to implement an IoC (Inversion of Control) pattern throughout. So, some dependencies are currently instantiated directly in the constructors. If I had more time, I would have preferred to use an IoC container, especially for a production-grade application.

## Functional Testing


https://github.com/user-attachments/assets/dbd3e08f-aae9-4631-873b-6ba79540dc90

