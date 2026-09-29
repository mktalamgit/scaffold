# scaffold
Task manager scaffold using a pnpm monorepo, a Node API, a static web client,
Postgres for local development, and optional Python seed/report utilities.

```sh
cp .env.example .env
pnpm install
pnpm db:up
pnpm dev        # web on :5173, API on :3001
pnpm seed       # optional, requires uv
pnpm report     # optional, requires uv
```

The API stores tasks in memory until the database layer is connected. This
keeps the development server usable without requiring Docker, while
`pnpm db:up` starts the Postgres service for local integrations.
