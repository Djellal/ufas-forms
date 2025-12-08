# ufas-forms Project Documentation

## Project Overview

ufas-forms is a SvelteKit-based web application designed for form management. Built with modern web technologies, this project provides a foundation for creating, managing, and processing forms with a complete authentication system and database integration.

### Key Technologies

- **SvelteKit v2**: The core framework providing the application structure, routing, and SSR capabilities
- **Svelte 5**: Next-generation component framework with reactive programming
- **TypeScript**: Strong typing for enhanced development experience
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Drizzle ORM**: Type-safe database toolkit for PostgreSQL
- **PostgreSQL**: Relational database management system
- **Vitest**: Testing framework for unit and integration tests
- **ESLint & Prettier**: Code linting and formatting tools
- **Lucia**: Authentication library for secure session management

### Architecture

The project follows the SvelteKit project structure with the following key components:

- `src/routes/`: Contains SvelteKit page and layout components with file-based routing
- `src/lib/`: Shared libraries and reusable components
- `src/lib/server/`: Server-side logic including authentication and database operations
- `src/lib/server/db/`: Database schema and ORM configuration
- `src/app.html`: Main HTML template
- `src/app.d.ts`: TypeScript type declarations for SvelteKit

## Database Schema

The application uses PostgreSQL with Drizzle ORM and includes two main tables:

1. **users**: Stores user information
2. **sessions**: Handles user authentication sessions

The schema is defined in `src/lib/server/db/schema.ts` with proper relationships and type safety.

## Authentication System

The project implements a secure authentication system using:
- Session-based authentication with tokens
- SHA-256 hashing for session IDs
- Automatic session renewal
- Proper cookie management with expiration

The authentication logic is contained in `src/lib/server/auth.ts` and integrated via hooks in `src/hooks.server.ts`.

## Environment Variables

The application requires the following environment variable:
- `DATABASE_URL`: PostgreSQL database connection string

Example in `.env.example`:
```
DATABASE_URL="postgres://user:password@host:port/db-name"
```

## Development Commands

### Install Dependencies:
```bash
npm install
```

### Development Server:
```bash
# Start development server
npm run dev

# Start with auto-open in browser
npm run dev -- --open
```

### Building for Production:
```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

### Database Management:
```bash
# Push schema changes to database
npm run db:push

# Generate migration files
npm run db:generate

# Run database migrations
npm run db:migrate

# Open Drizzle Studio for database management
npm run db:studio
```

### Code Quality:
```bash
# Run type checking
npm run check

# Run continuous type checking
npm run check:watch

# Lint code
npm run lint

# Format code
npm run format
```

### Testing:
```bash
# Run unit tests
npm run test

# Run specific tests
npm run test:unit
```

## Development Conventions

1. **Code Style**: The project uses Prettier and ESLint for consistent code formatting
2. **Type Safety**: All code should be properly typed with TypeScript
3. **Component Structure**: Svelte components follow the Svelte 5 syntax with reactive declarations
4. **Server-Side Logic**: Server-side code is placed in `src/lib/server/` to ensure it's not included in client bundles
5. **Testing**: Unit tests are written using Vitest and should be placed alongside the code they test

## Testing Setup

The project includes both client and server-side testing:
- Client tests run in a browser environment using Playwright
- Server tests run in Node.js environment
- Test files follow the pattern `*.spec.ts` or `*.test.ts`

## Deployment

The project uses SvelteKit's adapter system for deployment. The current configuration uses `@sveltejs/adapter-auto` which automatically selects the appropriate adapter based on the deployment target. For specific environments, you may need to switch to a specific adapter as noted in the `svelte.config.js` file.

## Folder Structure

```
.
├── src/
│   ├── lib/                 # Shared libraries and components
│   │   ├── assets/          # Static assets like images and icons
│   │   └── server/          # Server-side code
│   │       └── db/          # Database schema and ORM
│   ├── routes/              # Page routes and layouts
│   ├── app.d.ts             # TypeScript declarations
│   └── app.html             # Main app template
├── static/                  # Static assets
├── drizzle.config.ts        # Drizzle ORM configuration
├── svelte.config.js         # SvelteKit configuration
├── vite.config.ts           # Vite configuration with testing setup
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
```

## Database Operations

The project uses Drizzle ORM for database interactions, providing type-safe queries and migrations. Schema changes should be made in `src/lib/server/db/schema.ts` and then either pushed directly to the database using `npm run db:push` or generated as migration files using `npm run db:generate`.

## Authentication Flow

1. User credentials are validated
2. Session token is generated and stored in database
3. Session cookie is set in the user's browser
4. Subsequent requests validate the session token
5. Sessions are automatically renewed before expiration
6. Sessions are invalidated when users log out

This approach provides security while maintaining a good user experience with persistent login sessions.