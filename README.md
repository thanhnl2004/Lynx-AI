# AI Agent Chat App

A full-stack AI chat assistant built with the Vercel AI SDK, allowing authenticated users to hold streaming conversations, persist chat history, and manage conversations (create, rename, delete). The project is split into a Next.js client and an Express + Prisma server backed by Supabase Auth and a Postgres database.

## Features

- **Streaming AI conversations** powered by the Vercel AI SDK with Google Gemini 2.0 Flash.
- **Conversation management** create new chats, rename existing ones inline, and delete conversations safely.
- **Persistent history** via Prisma models stored in Postgres.
- **Supabase authentication** so each user only sees their own chats.
- **Polished UI** using the Vercel UI primitives (sidebar, popovers, buttons, etc.).

## Project Structure

```
AI-Agent/
├── client/   # Next.js 15 app with React components and hooks
└── server/   # Express API, Prisma services, AI service
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm / npm / yarn (project uses npm scripts)
- Postgres database (Supabase recommended)
- Supabase project for auth
- API keys:
  - `SUPABASE_URL` / `SUPABASE_ANON_KEY`
  - `DATABASE_URL` (Prisma)
  - `GEMINI_API_KEY` (Google AI Studio)

### Environment Variables

Create `.env` files in both `client` and `server` directories.

**server/.env**
```
PORT=4000
DATABASE_URL=postgresql://...
SUPABASE_SERVICE_ROLE_KEY=...
GEMINI_API_KEY=...
```

**client/.env.local**
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Install Dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### Database Setup

```bash
cd server
npx prisma migrate dev
npx prisma generate
```

### Run the Apps

Server:
```bash
cd server
npm run dev
```

Client:
```bash
cd client
npm run dev
```

The client will be available at `http://localhost:3000`, and the server at `http://localhost:4000`.

## Key Commands

| Command | Description |
| ------- | ----------- |
| `npm run dev` (client) | Start Next.js in development |
| `npm run dev` (server) | Start Express API with ts-node + nodemon |
| `npm run build` (client) | Production build for the client |
| `npm run start` (server) | Start API without nodemon |



