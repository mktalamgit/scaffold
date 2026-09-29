# scaffold
I've built the scaffold as a pnpm monorepo, zipped above. It's a task manager with full CRUD across all the pieces of your stack. I only syntax-checked the Node and Python files. I haven't run it, and no .env is included.  
Layout

apps/api is a Fastify REST API with JSON-schema validation and a pg connection pool. It has GET, POST, PATCH and DELETE routes on /api/tasks.
apps/web is a React and Vite UI where you can add, toggle, edit inline and delete tasks. Vite proxies /api to the API on port 3001, so no CORS setup is needed.
python/ is a uv project using psycopg. seed.py inserts sample rows and report.py prints task stats.
db/init.sql and docker-compose.yml start Postgres 16 and create the tasks table automatically.

Run it

bash
unzip scaffold.zip && cd scaffold
cp .env.example .env
pnpm install
pnpm db:up
pnpm dev        # web on :5173, API on :3001
pnpm seed       # optional, via uv
pnpm report     # optional, via uv

You'll need Node 20.6 or later (the API reads .env through node --env-file), pnpm, Docker and uv.

To add a new resource, copy apps/api/src/routes/tasks.js, add a table to db/init.sql, and register the route in server.js.

I can add extras if you want, such as TypeScript, a migration tool (node-pg-migrate or Alembic), tests, or a Dockerfile for the API.
