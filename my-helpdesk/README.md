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
- [Deployment](#deployment)

---

## Prerequisites

Ensure the following are installed and configured before running the project locally:

| Requirement                    | Version | Notes                                                                      |
|--------------------------------|---------|----------------------------------------------------------------------------|
| [Node.js](https://nodejs.org/) | v18.17+ | LTS recommended                                                            |
| `OPENAI_API_KEY`               | -       | Required for AI Chat (stored in `.env.local`)                              |
| `DATABASE_URL`                 | -       | AWS RDS (PostgreSQL) connection string (stored in `.env.local`)            |

---

## Getting Started

### 1. Install dependencies & Setup Database

Go to the project root and execute:  

```bash
npm install
npx prisma generate  # Runs automatically post-install
npx prisma db push   # Sync local schema with database
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

A UI component that displays a table of support tickets. Fully integrated with **AWS RDS (PostgreSQL)** via **Prisma ORM**.

**Key features:**
- **Real-time CRUD**: Connects to `/api/tickets` for fetching, creating, and updating tickets.
- **Status Management**: Support for `Open` and `Resolved` states with conditional color-coding.
- **Context Menu Interaction**: Right-click any ticket row to permanently delete it from the system.
- **Search & Filtering**: Real-time client-side search and status-based filtering.
- **Ticket IDs**: Automated ticket ID generation (e.g., `TKT-123`) using PostgreSQL autoincrement.

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

## Deployment

### Vercel

The project has been deployed on [Vercel](https://team13-cloud-computing-proj.vercel.app/).

**Configuration Notes:**
- **Database Connection**: Ensure the `DATABASE_URL` is configured in Vercel's Environment Variables.
- **AI Integration**: Ensure the `OPENAI_API_KEY` is configured.
- **Serverless Compatibility**: The Prisma configuration uses `previewFeatures = ["driverAdapters"]` and `rhel-openssl-3.0.x` as a binary target for compatibility with Vercel's RHEL-based serverless environments.
- **Max Duration**: API routes are configured with `maxDuration = 30` to support streaming AI responses.
