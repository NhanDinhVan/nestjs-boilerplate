---
description: 'TypeScript coding standards: strict mode rules, naming conventions, interface vs type, enums, function parameter and return type rules, and utility type usage.'
applyTo: '**/*.ts'
---

# TypeScript Conventions

## Strict Mode Rules

The project enables `noImplicitAny` and `strictNullChecks`. Follow them rigorously.

**No implicit `any`.** Every variable, parameter, and return value must be explicitly typed when TypeScript cannot infer a precise type.

```typescript
// ✗ Implicit any — compile error
function process(data) { return data }

// ✓ Explicit
function process(data: CreateTaskInput): TaskEntity { ... }
```

**No non-null assertion (`!`).** Use guard clauses or optional chaining instead.

```typescript
// ✗ Unsafe assertion
const name = user!.name

// ✓ Safe guard
if (!user) throw new Error('User not found')
const name = user.name

// ✓ Optional chaining when undefined is acceptable
const name = user?.name
```

**`as` casts are allowed only when TypeScript cannot infer the type.** Valid cases include untyped third-party library returns, request objects shaped by middleware, and raw environment values. A short inline comment explaining why the cast is safe is required.

```typescript
// ✗ Silencing a real type error
const id = (req as any).user.id

// ✓ Justified cast — AuthGuard validates the payload shape upstream
const userId = (req.user as JwtPayload).sub

// ✓ Justified cast — process.env is always string; parseInt handles NaN
const port = parseInt(process.env.PORT as string, 10)
```

**Floating promises must be handled.** `@typescript-eslint/no-floating-promises` is set to `warn`. Always `await` async calls or explicitly `.catch()` them.

```typescript
// ✗ Floating promise
this.mailerService.send(email)

// ✓ Awaited
await this.mailerService.send(email)
```

## Naming Conventions

| Kind                | Convention                            | Example                     |
| ------------------- | ------------------------------------- | --------------------------- |
| Interface           | `I` prefix, PascalCase                | `ICreateUserInput`          |
| Type alias          | PascalCase, no prefix                 | `UserSortField`             |
| Enum                | PascalCase                            | `UserRole`                  |
| Enum member         | UPPER_SNAKE_CASE                      | `UserRole.SUPER_ADMIN`      |
| Generic param       | Single uppercase or short descriptive | `T`, `TValue`, `TEntity`    |
| Private class field | `_` prefix                            | `_cacheKey`                 |
| Boolean variable    | `is` / `has` / `can` prefix           | `isActive`, `hasPermission` |
| Constant object     | UPPER_SNAKE_CASE                      | `APP_ENV`                   |
| Constant object key | UPPER_SNAKE_CASE                      | `APP_ENV.LOCAL`             |

### Constant Naming

Top-level exported constant objects must use UPPER_SNAKE_CASE for both the object name and all keys. camelCase must not be used for exported constant identifiers.

```typescript
// ✓ Correct — UPPER_SNAKE_CASE object and keys
export const APP_ENV = {
    LOCAL: 'local',
    STAGING: 'staging',
    RELEASE: 'release',
}

// ✗ Avoid — camelCase object name
export const appEnv = { local: 'local' }

// ✗ Avoid — flat SCREAMING_SNAKE_CASE constants instead of grouped objects
export const APP_ENV_LOCAL = 'local'
export const APP_ENV_RELEASE = 'release'
```

Use `APP_ENV.LOCAL`, not a raw string `'local'`, whenever comparing against environment values.

## Destructuring Typing

When destructuring function parameters or variables, TypeScript must be able to infer every destructured binding precisely. If inference produces `any` or an overly broad type, the source must be typed explicitly before destructuring.

```typescript
// ✗ Implicit any from untyped source
const { id, name } = req.body

// ✓ Typed before destructuring
const body = req.body as CreateUserRequestDto
const { id, name } = body

// ✓ Typed parameter — destructuring is safe
function render({ title, content }: PageDto): string { ... }
```

Destructuring inside function bodies (from a typed input object) is encouraged for readability:

```typescript
async createTask(input: ICreateTaskInput): Promise<TaskEntity> {
    const { title, workspaceId, assigneeId, dueDate } = input
    ...
}
```

## `interface` vs `type`

Use **`interface`** for:

- Object shapes passed as function parameters (especially inputs with 4+ fields).
- Service method input contracts in `interfaces/{feature}.interface.ts`.
- Anything that may be extended or merged.

```typescript
// interfaces/task.interface.ts
export interface ICreateTaskInput {
    title: string
    workspaceId: string
    assigneeId?: string
    dueDate?: Date
}
```

Use **`type`** for:

- Union types, intersection types, or conditional types.
- Simple aliases that will never be extended.
- Mapped/computed types using utility types.

```typescript
// ✓ Type alias — union
type SortDirection = 'ASC' | 'DESC'

// ✓ Type alias — utility-derived
type PartialUserUpdate = Partial<Pick<UserEntity, 'displayName' | 'avatarUrl'>>
```

**Never use `interface` to describe unions or primitives.** Only use `type` there.

## Enums

Define enums as TypeScript `enum` (not plain object constants) when the value set is fixed and domain-significant.

```typescript
// ✓ Proper enum
export enum UserRole {
    SUPER_ADMIN = 'SUPER_ADMIN',
    MEMBER = 'MEMBER',
    GUEST = 'GUEST',
}

// ✗ Avoid plain objects for enum-like values
export const UserRole = { SUPER_ADMIN: 'SUPER_ADMIN' }
```

- Always use **string enums** — numeric enums are fragile when serialized.
- Place enums in `src/commons/enums/` if shared across domains, or in the feature's `interfaces/` file if local.
- Re-export from the nearest `index.ts` barrel.

## Function Parameter Rules

Functions and methods with **3 or fewer** parameters may use positional arguments.

Functions and methods with **more than 3 parameters** must accept a **single named input object** typed via an interface.

```typescript
// ✗ Too many positional parameters
async createTask(title: string, workspaceId: string, assigneeId: string, dueDate: Date) {}

// ✓ Grouped into an interface
// interfaces/task.interface.ts
export interface ICreateTaskInput {
    title: string
    workspaceId: string
    assigneeId: string
    dueDate: Date
}

// tasks.service.ts
async createTask(input: ICreateTaskInput): Promise<TaskEntity> {}
```

**Optional parameters** must come after required ones. Prefer `field?: T` over `field: T | undefined`.

## Return Type Rules

**Always declare explicit return types** on public class methods (services, resolvers). TypeScript inference is allowed only for private helpers and one-liners.

**All async functions must explicitly declare `Promise<T>`.** Do not rely on TypeScript inferring the `Promise` wrapper.

```typescript
// ✓ Explicit Promise return type
async findById(id: string): Promise<UserEntity | null> { ... }
async sendWelcomeEmail(userId: string): Promise<void> { ... }

// ✗ Missing explicit return type — inferred Promise is not acceptable on public methods
async findById(id: string) { ... }

// ✓ Inference acceptable for private helper
private buildWhereClause(filter: UserFilter) { ... }
```

**Nullable returns** use `T | null`, not `T | undefined`, for values that represent "not found":

```typescript
// ✓ Null for "not found"
async findUser(id: string): Promise<UserEntity | null> { ... }

// ✗ Avoid undefined for optional domain values
async findUser(id: string): Promise<UserEntity | undefined> { ... }
```

**Never return `any`.** If you cannot type a return value, use `unknown` and narrow it before use.

## Utility Types

Use built-in utility types instead of duplicating type definitions.

| Utility          | When to use                                                   |
| ---------------- | ------------------------------------------------------------- |
| `Partial<T>`     | All fields optional (e.g., PATCH/update inputs)               |
| `Required<T>`    | Force all optional fields to be present                       |
| `Pick<T, K>`     | Select a subset of fields                                     |
| `Omit<T, K>`     | Exclude specific fields (e.g., strip `id` from create inputs) |
| `Record<K, V>`   | Typed key-value maps (e.g., `LOGGING_MAP`)                    |
| `Readonly<T>`    | Prevent mutation of a config or constant shape                |
| `NonNullable<T>` | Strip `null \| undefined` after a null-check                  |

```typescript
// ✓ Derive update DTO from entity type
type UpdateUserInput = Partial<Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt'>>

// ✓ Typed lookup map
const LOGGING_MAP: Record<string, LoggerOptions> = {
    local: ['query', 'error'],
    release: ['error'],
}
```

Do not redefine types that can be derived — keep types DRY and close to their source.
