# Book Club - Full Stack (Prisma + Fastify + React + Tailwind)

This is a minimal but polished Book Club app with:
- Postgres (Docker)
- Backend: Fastify + TypeScript + Prisma (migrations + seed)
- Frontend: Vite + React + TypeScript + Tailwind (slightly nicer UI)

## Quick (Docker) — recommended
```bash
# build & run DB + backend + frontend
docker compose up --build
```
- Frontend: http://localhost:5173
- Backend: http://localhost:4000
- Postgres: localhost:5432 (user: bookclub, pass: bookclubpass, db: bookclub)

Migrations and seed run automatically when backend container starts (Prisma migrate deploy + seed).

## Local dev (optional)
Start DB only:
```bash
docker compose up db
```

Backend:
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run seed
npm run dev
# server: http://localhost:4000
```

Frontend:
```bash
cd frontend
npm install
echo "VITE_API_BASE=http://localhost:4000" > .env
npm run dev
# open http://localhost:5173
```

## Notes
- Backend auto-applies migrations in Docker via `prisma migrate deploy` and runs `prisma db seed`.
- For production you may want to use a managed Postgres and run migrations separately.
