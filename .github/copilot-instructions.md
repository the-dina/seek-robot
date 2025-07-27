## Project Architecture & File Structure

### Key Design Principles

- **Domain Layer**: Pure business logic, no external dependencies
- **Application Layer**: Orchestrates domain objects, implements command pattern
- **Infrastructure Layer**: Handles I/O, external dependencies
- **Command Pattern**: Makes adding new commands easy without modifying existing code
- **Dependency Inversion**: Infrastructure depends on abstractions
- **Single Responsibility**: Each class has one clear purpose
- **Open/Closed**: Open for extension, closed for modification

### AI Coding Guidelines

When working with this codebase:

1. Maintain the 3-layer architecture separation
2. New commands should implement the Command interface
3. Domain objects should remain pure (no I/O dependencies)
4. Use dependency injection for testability
5. Follow TypeScript best practices and strict typing
6. Write comprehensive unit and integration tests
7. Ensure error handling doesn't expose stack traces to end users
8. Keep performance in mind for large input processing

## Testing

- Use `npm run test` for single test runs that exit cleanly (don't block terminal)
- Use `npm run test:watch` only when you want watch mode for development
- Always run tests after making changes to verify functionality

## comments

- Do not add comments to the code unless they are necessary for understanding complex logic.
- Comments should be concise and relevant to the code they describe.

## import statements

- Use absolute imports from the `src` directory for clarity.

## Naming Conventions

- interface names should start with "I"

## General Guidelines

- only create files and methods that are necessary for the functionality
- after implementing a feature, remove any unused code
