# DemoForums

A reference implementation of a React SPA with REST API backend, demonstrating modern patterns for building scalable web applications.

## Purpose

This project serves as an architectural template for developers and AI agents building React applications with REST APIs. It showcases production-ready patterns for state management, caching, error handling, and component organization.

## Architecture

### Project Structure

```
src/
├── components/
│   ├── pages/                 # Page components
│   │   ├── post-list/         # Complex page with sub-components
│   │   │   ├── PostListPage.tsx
│   │   │   └── -components/   # Internal components (- prefix)
│   │   │       └── Paginator.tsx
│   │   ├── post-view/         # Another complex page
│   │   │   ├── PostViewPage.tsx
│   │   │   └── -components/
│   │   │       ├── PostDetail.tsx
│   │   │       ├── CommentForm.tsx
│   │   │       └── CommentList.tsx
│   │   └── LoginPage.tsx      # Simple page without sub-components
│   ├── layouts/               # Layout components
│   │   ├── Layout.tsx
│   │   └── -components/       # Layout sub-components
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   ├── ui/                    # UI components (shadcn/ui)
│   ├── shared/                # Reusable components
│   │   └── Username.tsx
│   └── errors/                # Error handling components
│       ├── ErrorBoundary.tsx
│       └── ErrorDisplay.tsx
├── lib/                       # Core utilities
│   ├── api.ts                # API client and cache configuration
│   ├── errors.ts             # Error handling system
│   ├── auth-storage.ts       # Authentication management
│   ├── formatters.ts         # Data formatting utilities
│   └── utils.ts              # UI utility functions (shadcn/ui)
├── hooks/                     # Custom React hooks
│   └── useCache.ts           # Cache access hooks
├── mocks/                     # MSW mock server
│   ├── data.ts               # Mock data generation
│   ├── handlers.ts           # API request handlers
│   └── browser.ts            # Browser service worker setup
├── types.ts                   # TypeScript type definitions
├── router.ts                  # Route configuration
└── main.tsx                   # Application entry point
```

### API Layer and State Management

The API layer follows a clear separation of concerns:

#### `lib/api.ts` - Centralized API Client

This file is the heart of all server communication:

**HTTP Client Configuration:**

- Configures `ky` HTTP client with base URL and interceptors
- Automatically attaches auth tokens to all requests
- Handles 401 errors with redirect to login
- Transforms HTTP errors into standardized `AppError` instances

**Query & Mutation Definitions:**

- Defines all TanStack Query queries and mutations
- Sets intelligent cache strategies based on data volatility
- Manages query keys for cache invalidation
- Provides type-safe API methods

**Key Responsibilities:**

- HTTP request/response processing
- Error transformation and standardization
- Authentication token injection
- Cache configuration (staleTime, gcTime)
- Query key management

**What it DOESN'T do:**

- UI updates or navigation (handled by components)\*
- Business logic (handled by components)
- Direct error display (components show toasts/errors)

\*Exception: 401 authentication errors trigger automatic redirect to `/login` at the API layer to ensure consistent auth handling across the entire application

```typescript
// Example: Complete API configuration with auth, error handling, and caching
const httpClient = ky.create({
  hooks: {
    beforeRequest: [(request) => {
      const token = authStorage.getAuthToken()
      if (token) request.headers.set("Authorization", `Bearer ${token}`)
    }],
    afterResponse: [async (request, options, response) => {
      if (response.status === 401) {
        authStorage.clearAuthData()
        window.location.href = "/login"
      }
      if (!response.ok) {
        throw new AppError(...)
      }
    }]
  }
})

// Query with intelligent caching
queries: {
  forums: () =>
    queryOptions({
      queryKey: ["forums"],
      queryFn: () => httpClient.get("api/forums").json<Forum[]>(),
      staleTime: Infinity,  // Static data - never refetch
      gcTime: Infinity,     // Keep in cache forever
    }),
}
```

#### Components - UI Logic and Navigation

- Handle error states and display
- Manage navigation after mutations
- Show loading states via Suspense
- Display toast notifications

```typescript
// Example: Component handles navigation after success
const mutation = api.mutations.useCreatePost()
mutation.mutate(data, {
  onSuccess: (post) => {
    navigate(`/forums/${post.forumSlug}/${post.number}`)
  },
  onError: (error) => {
    toast.error(AppError.fromUnknown(error).message)
  },
})
```

### Page Component Organization

#### Naming Conventions

- Page components: `[PageName]Page.tsx` (e.g., `LoginPage.tsx`, `PostListPage.tsx`)
- Sub-components: Stored in `-components/` folder with `-` prefix
- File structure mirrors component complexity

#### Page Types

1. **Simple Pages** - Single file

   ```
   components/pages/LoginPage.tsx
   ```

2. **Complex Pages** - Folder with sub-components
   ```
   components/pages/post-list/
   ├── PostListPage.tsx
   └── -components/
       └── Paginator.tsx
   ```

### Caching Strategy

The application implements intelligent caching based on data volatility:

#### Static Data (Cached Indefinitely)

- **Forums list** - Rarely changes
- **Users list** - Stable reference data
- Strategy: `staleTime: Infinity, gcTime: Infinity`
- Loaded once at app start, never refetched

#### Dynamic Data (Time-based Cache)

- **Posts** - Moderate update frequency
  - `staleTime: 1 minute, gcTime: 5 minutes`
- **Comments** - High update frequency
  - `staleTime: 30 seconds, gcTime: 2 minutes`

#### Cache Access Pattern

Custom hooks in `hooks/useCache.ts` provide typed access to cached data:

```typescript
// Access cached forums without network request
const forum = useForum(slug) // Throws if not found
const forums = useForums() // Returns all forums
```

### Error Handling

#### Centralized Error System

- `AppError` class standardizes error handling
- Automatic HTTP error transformation
- Type-safe error codes

#### Error Flow

1. API errors caught in `api.ts` afterResponse hook
2. Transformed to `AppError` with appropriate code
3. Components handle via:
   - Error boundaries for render errors
   - Toast notifications for mutations
   - Error displays for query failures

#### Authentication Errors

- 401 responses trigger automatic redirect to `/login`
- Auth token cleared from localStorage
- Query cache cleared to prevent stale data

### Authentication

#### Token Management

- Stored in localStorage via `authStorage`
- Automatically added to request headers
- Cleared on logout or 401 response

#### Auth Flow

1. Login stores token and user data
2. Token attached to all API requests
3. 401 response clears auth and redirects
4. Protected routes check auth state

## Key Development Principles

### 1. Minimize Network Requests

- Aggressive caching for static data
- Strategic cache invalidation
- Prefetch critical data on app start

### 2. Clear Separation of Concerns

- API layer: Cache management only
- Components: UI logic and user interaction
- Hooks: Reusable data access patterns
- Lib: Core utilities and configuration

### 3. Type Safety

- Full TypeScript coverage
- Typed route parameters: `as { slug: string }`
- Type-safe API responses
- Zod validation for forms

### 4. Error Resilience

- Graceful error handling at all levels
- User-friendly error messages
- Automatic recovery mechanisms
- Comprehensive error logging

### 5. Developer Experience

- MSW for offline development
- Separate dev commands for humans vs AI agents
- Clear file organization
- Consistent naming patterns

## Development

### Prerequisites

- Node.js 18+
- pnpm package manager

### Setup

```bash
# Install dependencies
pnpm install

# Start development server (for developers)
pnpm dev

# Start development server (for AI agents)
pnpm agent-dev
```

### Key Technologies

- **React 19** - UI framework
- **React Query (TanStack Query)** - Server state management
- **React Router** - Client-side routing
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **MSW** - API mocking for development
- **Ky** - HTTP client
- **Zod** - Schema validation
- **React Hook Form** - Form management

### Development Features

- **Mock API** - MSW provides a fully functional mock backend
- **Hot Reload** - Instant feedback during development
- **Type Checking** - Catch errors at compile time
- **Error Boundaries** - Graceful error recovery

## Best Practices

### When Building New Features

1. **Check Existing Patterns** - Look at similar features first
2. **Use Cached Data** - Prefer `useCache` hooks over new queries
3. **Handle Errors Properly** - Use `AppError.fromUnknown()`
4. **Follow Naming Conventions** - Consistent file and component names
5. **Minimize Comments** - Code should be self-documenting
6. **Test Cache Behavior** - Verify invalidation logic

### Common Patterns

#### Creating a New Page

1. Add route in `router.ts`
2. Create page component in `components/pages/`
3. Use `-components/` folder for sub-components
4. Implement error handling with Suspense/ErrorBoundary

#### Adding API Endpoint

1. Define types in `types.ts`
2. Add query/mutation in `api.ts`
3. Set appropriate cache strategy
4. Handle errors in component

#### Accessing Cached Data

1. Use existing `useCache` hooks when possible
2. Create new cache hooks for repeated patterns
3. Throw `AppError` for missing data
4. Let ErrorBoundary handle failures

## Architecture Decisions

### Why This Structure?

1. **Pages in components/** - Pages are components, keeping all UI code together
2. **-components folders** - Clear distinction between public and internal components
3. **Cache-first approach** - Reduces server load and improves performance
4. **Separation of API and UI** - Enables easy testing and refactoring
5. **MSW for development** - Consistent development environment without backend

### Trade-offs

- **Infinite caching** - Works well for stable data, requires manual invalidation
- **Suspense everywhere** - Simpler code but requires error boundaries
- **TypeScript strictness** - More verbose but catches errors early
- **Minimal abstractions** - Direct use of React Query instead of custom wrappers

## License

MIT
