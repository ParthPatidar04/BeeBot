# BeeBot — MERN AI Chatbot

Minimalist AI chatbot built to match the provided UI reference exactly.
Stack: MongoDB, Express, React (Vite + Tailwind), Node.js, Google Gemini.

## Folder structure

```
beebot/
├── backend/     Express API, MongoDB models, JWT auth, Gemini integration
└── frontend/    React app (Vite + Tailwind)
```

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `.env`:
- `MONGO_URI` — your MongoDB connection string (local or Atlas)
- `JWT_SECRET` — any long random string
- `GEMINI_API_KEY` — get one free at https://aistudio.google.com/app/apikey
- `PORT` — defaults to 5000

If your ISP blocks MongoDB Atlas SRV DNS lookups (common issue), `config/db.js`
already sets DNS servers to Google/Cloudflare automatically, so you shouldn't
need to do anything extra.

```bash
npm run dev
```

## 2. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

App runs at `http://localhost:5173`, API at `http://localhost:5000`.

## Features

- Sign up / Log in with JWT auth, random DiceBear avatar assigned on signup
- New chat sessions, auto-titled from the first message (like ChatGPT)
- Chat history in the sidebar grouped by date, with inline rename + delete
- Messages persisted per chat session in MongoDB
- Gemini AI replies with conversation context maintained per chat session

## API endpoints

| Method | Route                     | Description                       |
|--------|----------------------------|------------------------------------|
| POST   | /api/auth/signup           | Create account, get random avatar |
| POST   | /api/auth/login            | Log in, get JWT                   |
| GET    | /api/chats                 | List chat sessions                |
| POST   | /api/chats                 | Create new chat session           |
| GET    | /api/chats/:id             | Get chat with full messages       |
| PUT    | /api/chats/:id             | Rename chat title                 |
| DELETE | /api/chats/:id             | Delete chat session               |
| POST   | /api/chats/:id/message     | Send prompt, get Gemini reply     |

All `/api/chats*` routes require `Authorization: Bearer <token>`.


//