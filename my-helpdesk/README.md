# AI HelpDesk

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Implementations](#implementations)
  - [AI Chat Assistant](#ai-chat-assistant)
  - [API Route - Chat Endpoint](#api-route--chat-endpoint)
  - [Ticket Management View](#ticket-management-view)
  - [Sidebar Navigation](#sidebar-navigation)
  - [Root Layout](#root-layout)

---

## Prerequisites

Ensure the following are installed and configured before running the project locally:

| Requirement                    | Version | Notes                                                                      |
|--------------------------------|---------|----------------------------------------------------------------------------|
| [Node.js](https://nodejs.org/) | v18.17+ | LTS recommended                                                            |
| OpenAI API Key                 | -       | Located in the .env and .env.local                                         |
| DATABASE URL                   | -       | Located in the .env and .env.local                                         |

---

## Getting Started

### 1. Install dependencies & Setup Database

Go to the project root and execute:  

```bash
npm install
npx prisma generate (This line should automatically execute after npm install)
```

### 2. Configure environment variables

Ensure you have the updated .env and .env.local in the root.

Environment variables are meant to NOT be pushed onto the github repo. I have included in the .gitignore.

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app will hot-reload as you edit source files.

### Other useful commands

```bash
npm run build   # Create a production build
npm run start   # Start the production server (requires build first)
npm run lint    # Run ESLint checks
```

---

## Implementations

### AI Chat Assistant

**File:** [`components/ChatWindow.tsx`](components/ChatWindow.tsx)

A fully client-side React component (`"use client"`) that provides a real-time chat interface powered by the Vercel AI SDK.

**Key features:**
- Uses the `useChat` hook from `@ai-sdk/react` to manage message state and stream AI responses.
- Sends messages via `sendMessage({ text: input })` to the `/api/chat` backend route.
- Tracks the `status` field (`submitted` | `streaming` | `ready`) to disable the send button while the AI is responding.
- Renders messages using the `UIMessage` type, iterating over `m.parts` to reconstruct text content.
- Pre-loads a welcome message from the assistant on initial render.

---

### API Route - Chat Endpoint

**File:** [`app/api/chat/route.ts`](app/api/chat/route.ts)

A Next.js App Router API Route that handles all AI inference. This is the backend entry point for the chat feature.

**Key features:**
- Accepts `POST` requests with a `messages` array in the request body.
- Uses `streamText` from the `ai` package with `openai('gpt-4o-mini')` as the model.
- Converts incoming UI messages to model-compatible format using `convertToModelMessages`.
- Streams the response back to the client using `result.toUIMessageStreamResponse()`.
- Includes a temporary system prompt that sets the AI's persona as a professional IT assistant.
- `maxDuration = 30` allows streaming responses up to 30 seconds (required for Vercel deployments).
- Integrated with a database to log conversations and retrieve ticket-related context.

---

### Ticket Management View

**File:** [`components/TicketList.tsx`](components/TicketList.tsx)

A UI component that displays a table of support tickets. Currently uses mock data and is intended to be wired up to a real database.

**Key features:**
- Displays ticket ID, subject, status badge (`Open` / `Resolved`), and date created.
- Status badges use conditional colour coding.
- Includes a search input and a filter button.
- A "New Ticket" button is present in the header.
- Connected to AWS RDS (PostgreSQL) via an ORM [Prisma](https://www.prisma.io/)

---

### Sidebar Navigation

**File:** [`components/Sidebar.tsx`](components/Sidebar.tsx)

A persistent navigation sidebar rendered on every page via the root layout.

**Key features:**
- Contains links to **AI Chat** (`/`) and **My Tickets** (`/tickets`) using Next.js `<Link>`.
- Fixed width (`w-64`) and full-height (`h-full sticky top-0`), always visible.

---

### Root Layout

**File:** [`app/layout.tsx`](app/layout.tsx)

Defines the persistent shell of the application, rendered once and shared across all pages.

**Key features:**
- Applies Geist Sans and Geist Mono fonts via `next/font/google`.
- Sets up a full-height flex layout with the `Sidebar` on the left and a `<main>` content area on the right.
- Dark background (`bg-gray-950`) applied at the body level for night mode aesthetics.

---
