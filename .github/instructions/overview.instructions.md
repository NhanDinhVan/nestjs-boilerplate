---
description: 'Project-wide conventions: tech stack, folder structure, naming conventions, ESLint/Prettier style, module boundaries, and step-by-step guides for creating features and providers.'
applyTo: '**'
---

# Project Overview & Conventions

## Tech Stack & Versions

| Tool            | Version                                       |
| --------------- | --------------------------------------------- |
| NestJS          | ^11                                           |
| TypeScript      | ^5.7, target ES2023                           |
| Node.js         | module: nodenext                              |
| GraphQL         | Apollo Server v4 + @nestjs/apollo v13         |
| ORM             | TypeORM ^0.3.28                               |
| Database        | PostgreSQL (pg ^8.20)                         |
| Naming strategy | typeorm-naming-strategies SnakeNamingStrategy |
| Package manager | pnpm@10.28.1                                  |
| Linter          | ESLint v9 + typescript-eslint v8              |
| Formatter       | Prettier v3                                   |

## Project Folder Structure

```
src/
  app.module.ts            # Root module — imports domain modules only
  main.ts                  # Bootstrap entry point

  commons/                 # Shared, framework-agnostic utilities
    constants/             # APP_ENV, route paths, etc.
    enums/
    guards/
    interceptors/
    utils/
    validators/

  configs/                 # Config factory functions, one file per concern
    app.config.ts          # Central config object (reads process.env)
    database.config.ts     # getPostgresDatabaseConfig()
    graphql.config.ts      # getGraphqlConfig()
    index.ts               # Re-exports all configs

  databases/
    postgres/
      datasource.module.ts # TypeORM module wrapper
      datasource.ts        # DataSource for CLI (migrations)
      entities/{feature}/  # One folder per entity
      migrations/          # TypeORM migration files

  modules/
    client/                # "client" domain — all client-facing features
      client.module.ts     # Domain root module
      {feature}/           # One folder per feature
        {feature}.module.ts
        {feature}.resolver.ts
        {feature}.service.ts
        interfaces/
        dtos/requests/
        dtos/responses/
    shared/                # Cross-domain shared providers/services

  providers/               # Infrastructure providers (Redis, BullMQ, etc.)
    redis/index.ts
    bull-queue/index.ts
```

## Naming Conventions

### Files

| Artifact  | File pattern                                                      |
| --------- | ----------------------------------------------------------------- |
| Module    | `{feature}.module.ts`                                             |
| Service   | `{feature}.service.ts`                                            |
| Resolver  | `{feature}.resolver.ts`                                           |
| Entity    | `{feature}.entity.ts`                                             |
| Config fn | `{name}.config.ts`                                                |
| DTO       | `{action}-{feature}.request.dto.ts` / `{feature}.response.dto.ts` |
| Util      | `{name}.util.ts`                                                  |
| Constant  | `{name}.constant.ts`                                              |

### Classes

- **Modules, Services, Resolvers** must be **domain-prefixed** to prevent naming conflicts across domains.

```typescript
// ✓ Domain-prefixed
export class ClientUserModule {}
export class ClientUserService {}
export class ClientUserResolver {}

// ✗ Not allowed — ambiguous across domains
export class UserService {}
```

- **Entities**: no domain prefix — `UserEntity`, `TaskEntity`.
- **DTOs**: describe the action — `CreateUserRequestDto`, `UserResponseDto`.
- **Interfaces**: `I`-prefixed — `ICreateUserInput`.
- **Enums**: PascalCase — `UserRole`, `TaskStatus`.

### Variables & Constants

- camelCase for variables and function parameters.
- SCREAMING_SNAKE_CASE is **not** used; exported constants use plain `const` objects:

```typescript
// ✓ Correct
export const APP_ENV = { LOCAL: 'local', RELEASE: 'release' }

// ✗ Avoid
export const APP_ENV_LOCAL = 'local'
```

### Database

- Table names: plural snake_case — `task_recurrence_rules`, `workspace_members`.
- Column names: snake_case (handled automatically by `SnakeNamingStrategy`).
- Constraint names follow the pattern in `migration.instructions.md`.

## ESLint Rules & Code Style

**Prettier settings** (enforced as ESLint errors):

| Setting         | Value                   |
| --------------- | ----------------------- |
| Semicolons      | `false` (no semicolons) |
| Quotes          | single                  |
| Trailing commas | `all`                   |
| Print width     | 100                     |
| Tab width       | 4 spaces                |
| Arrow parens    | `always`                |

**Key ESLint rules:**

- `no-duplicate-imports: error` — merge all imports from the same module into one statement.
- `object-shorthand: always` — use `{ foo }` not `{ foo: foo }`.
- `max-depth: 4` — maximum nesting depth of 4 in any function/block.
- `unused-imports/no-unused-imports: error` — no unused imports allowed. Prefix unused variables with `_` to suppress warnings.
- `@typescript-eslint/no-floating-promises: warn` — always `await` or `.catch()` a promise.

**Prettier import order** (`@ianvs/prettier-plugin-sort-imports` is installed — configure order if needed in prettier config).

## Module Scope & Boundaries

- Each domain (`client`, `shared`) owns its own NestJS module tree. Do not import a feature module from another domain directly.
- Cross-domain shared logic lives in `src/modules/shared/` and is exported from `SharedModule`.
- Infrastructure (Redis, BullMQ) is provided via `src/providers/` and imported into the domain module that needs them.
- Direct repository access is **not allowed** in resolvers or controllers — use the feature service.
- Config factory functions must not be called inline inside module files — pass them via `useFactory`.

### TypeORM Entity Registration

**Do NOT manually import or register each entity using `TypeOrmModule.forFeature([...])` if a global configuration already loads all entities** (e.g., via an entities folder pattern). The `PostgresDatasourceModule` automatically discovers and loads all `*.entity.ts` files from the `src/databases/postgres/entities/**` glob pattern.

- Entities are automatically discovered and injected.
- When creating a new entity, do not modify module imports — TypeORM will find it automatically.
- Use `@InjectRepository(EntityClass)` in services to inject the repository; the entity itself does not need to be registered per-module.

## Step-by-Step: Create a New Feature Module

Example: adding `tasks` to the `client` domain.

**1. Create the folder structure:**

```
src/modules/client/tasks/
  tasks.module.ts
  tasks.resolver.ts
  tasks.service.ts
  interfaces/
    index.ts
    task.interface.ts
  dtos/
    requests/
      index.ts
    responses/
      index.ts
```

**2. Scaffold the module:**

```typescript
// tasks.module.ts
import { Module } from '@nestjs/common'
import { ClientTasksResolver } from './tasks.resolver'
import { ClientTasksService } from './tasks.service'

@Module({
    providers: [ClientTasksResolver, ClientTasksService],
})
export class ClientTasksModule {}
```

**3. Scaffold the service:**

```typescript
// tasks.service.ts
import { Injectable } from '@nestjs/common'

@Injectable()
export class ClientTasksService {}
```

**4. Scaffold the resolver:**

```typescript
// tasks.resolver.ts
import { Query, Resolver } from '@nestjs/graphql'
import { ClientTasksService } from './tasks.service'

@Resolver()
export class ClientTasksResolver {
    constructor(private readonly tasksService: ClientTasksService) {}

    @Query(() => String)
    ping(): string {
        return 'ok'
    }
}
```

### GraphQL Resolver Naming Rules

All `@Query` and `@Mutation` method names must be **action-oriented** using a consistent verb prefix. Never use bare nouns.

| Operation  | Verb prefix | Example                      |
| ---------- | ----------- | ---------------------------- |
| Fetch list | `getAll`    | `getAllUsers`, `getAllTasks` |
| Fetch one  | `get`       | `getUser`, `getTask`         |
| Create     | `create`    | `createUser`, `createTask`   |
| Update     | `update`    | `updateUser`, `updateTask`   |
| Delete     | `delete`    | `deleteUser`, `deleteTask`   |

```typescript
// ✓ Correct — action-oriented names
@Query(() => [UserResponseDto])
async getAllUsers(): Promise<UserResponseDto[]> { ... }

@Query(() => UserResponseDto)
async getUser(@Args('id', { type: () => ID }) id: string): Promise<UserResponseDto> { ... }

@Mutation(() => UserResponseDto)
async createUser(@Args('input') input: CreateUserRequestDto): Promise<UserResponseDto> { ... }

// ✗ Not allowed — bare nouns with no action verb
@Query(() => [UserResponseDto])
async users(): Promise<UserResponseDto[]> { ... }

@Query(() => UserResponseDto)
async user(@Args('id') id: string): Promise<UserResponseDto> { ... }
```

**5. If the feature needs a TypeORM entity:**

- Create `src/databases/postgres/entities/task/task.entity.ts`.
- No module registration needed — `database.config.ts` loads all `*.entity.ts` files via a glob pattern automatically.

**6. Register in the domain root module:**

```typescript
// client.module.ts
import { ClientTasksModule } from './tasks/tasks.module'

@Module({ imports: [ClientUserModule, ClientTasksModule] })
export class ClientModule {}
```

**7. Add barrel exports** to every `interfaces/index.ts`, `dtos/requests/index.ts`, and `dtos/responses/index.ts`:

```typescript
export * from './task.interface'
```

**8. Write and run a migration** if a new table is needed (see `migration.instructions.md`).

## Step-by-Step: Configure a New Provider or Config Section

**Adding a config section (e.g., caching):**

1. Create `src/configs/cache.config.ts`:

```typescript
import { config } from './app.config'

export function getCacheConfig() {
    return {
        ttl: Number(process.env.CACHE_TTL) || 300,
        host: config.redis.host,
    }
}
```

2. Re-export from `src/configs/index.ts`:

```typescript
export * from './cache.config'
```

3. Add the raw env values to `src/configs/app.config.ts` under the `config` object if they are reused.

4. Always provide a sensible default — never let config values be `undefined`.

**Adding an infrastructure provider (e.g., BullMQ queue):**

1. Create `src/providers/bull-queue/index.ts` exporting a NestJS `DynamicModule` or provider array.
2. Import it into the domain module that needs it — not into `AppModule`.
3. Never instantiate Redis/BullMQ clients directly inside feature services; always inject via the provider.
