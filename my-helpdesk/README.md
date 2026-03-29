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
- [Environment Variables](#environment-variables)
- [Extending the Project](#extending-the-project)
- [Tech Stack](#tech-stack)

---

## Prerequisites

Ensure the following are installed and configured before running the project locally:

| Requirement                    | Version | Notes                                                                      |
|--------------------------------|---------|----------------------------------------------------------------------------|
| [Node.js](https://nodejs.org/) | v18.17+ | LTS recommended                                                            |
| OpenAI API Key                 | -       | Check our telegram group for the .env.local and drop it in the root folder |

---

## Getting Started

### 1. Install dependencies & Setup Database

Go to the project root and execute:  

```bash
npm install
npx prisma generate
```

### 2. Configure environment variables

Create a `.env.local` file in the project root  
Or just copy & paste the one sent on telegram

.env.local is meant to NOT be pushed onto the repo. I have included in the .gitignore.

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
- Dark-themed UI with distinct bubbles for user (indigo) and assistant (gray/emerald) messages.

**To extend:**
- Add auto scroll to bottom when new messages arrive.
- Integrate a `useRef` on the message container to auto scroll.
- Do we want a message limit for each ticket?

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

**To extend:**
- Update the `system` prompt to specialise the assistant (e.g., describe your product, services?).
- Integrate with a database to log conversations and retrieve ticket-related context.

---

### Ticket Management View

**File:** [`components/TicketList.tsx`](components/TicketList.tsx)

A UI component that displays a table of support tickets. Currently uses mock data and is intended to be wired up to a real database.

**Key features:**
- Displays ticket ID, subject, status badge (`Open` / `Resolved`), and date created.
- Status badges use conditional colour coding (amber for Open, emerald for Resolved).
- Includes a search input and a filter button (UI only - not yet functional).
- A "New Ticket" button is present in the header (not yet functional).
- Fully dark-themed, consistent with the rest of the UI.

**To extend:**
- Replace `MOCK_TICKETS` with a `fetch` call to a REST API or a direct database query via a Server Component or Server Action.
- Implement client-side filtering or a debounced API call.
- Add a modal or separate page for creating new tickets.
- Connect to AWS RDS (PostgreSQL) via an ORM like [Prisma](https://www.prisma.io/) or [Drizzle](https://orm.drizzle.team/).

---

### Sidebar Navigation

**File:** [`components/Sidebar.tsx`](components/Sidebar.tsx)

A persistent navigation sidebar rendered on every page via the root layout.

**Key features:**
- Contains links to **AI Chat** (`/`) and **My Tickets** (`/tickets`) using Next.js `<Link>`.
- Fixed width (`w-64`) and full-height (`h-full sticky top-0`), always visible.
- Branding section at the top with a logo icon and app name.
- Footer with a copyright notice.

---

### Root Layout

**File:** [`app/layout.tsx`](app/layout.tsx)

Defines the persistent shell of the application, rendered once and shared across all pages.

**Key features:**
- Applies Geist Sans and Geist Mono fonts via `next/font/google`.
- Sets up a full-height flex layout with the `Sidebar` on the left and a `<main>` content area on the right.
- Dark background (`bg-gray-950`) applied at the body level for night mode aesthetics.

**To extend:**
- Update the `metadata` object (title, description) for proper SEO.

---

## Extending the Project

### 1. Connect a Database (AWS RDS / PostgreSQL)
- Provision an RDS PostgreSQL instance on AWS.
- Install an ORM: `npm install prisma @prisma/client` or `npm install drizzle-orm`.
- Create a `tickets` table schema and expose CRUD operations through API routes under `app/api/tickets/`.
- Replace `MOCK_TICKETS` in `TicketList.tsx` with real data fetched from the database.

### 2. Authentication
- Add user authentication with [NextAuth.js](https://next-auth.js.org/) (`npm install next-auth`).
- Protect API routes and pages with session checks.
- Associate tickets with specific users.

### 3. Chat-to-Ticket Integration
- Allow users to convert a chat conversation into a support ticket with one click.
- Pass the conversation summary to the ticket creation API.

### 4. Deploy to AWS
- Build the production bundle: `npm run build`.
- Deploy with [AWS Amplify](https://aws.amazon.com/amplify/) (easiest for Next.js) or containerise with Docker and deploy to ECS/EC2.
- Set environment variables (e.g., `OPENAI_API_KEY`) in the AWS console or via SSM Parameter Store.

### 5. Search & Filter Tickets
- Implement the existing search input in `TicketList.tsx` with client-side filtering or a server-side debounced API query.

---

## Tech Stack

| Technology                                                                   | Purpose                                   |
|------------------------------------------------------------------------------|-------------------------------------------|
| [Next.js 16](https://nextjs.org/)                                            | Full-stack React framework (App Router)   |
| [React 19](https://react.dev/)                                               | UI library                                |
| [TypeScript 5](https://www.typescriptlang.org/)                              | Type safety                               |
| [Vercel AI SDK (`ai`)](https://sdk.vercel.ai/)                               | AI streaming infrastructure               |
| [`@ai-sdk/openai`](https://sdk.vercel.ai/providers/ai-sdk-providers/openai)  | OpenAI provider for the AI SDK            |
| [`@ai-sdk/react`](https://sdk.vercel.ai/docs/ai-sdk-ui/overview)             | `useChat` hook for client-side chat state |
| [OpenAI GPT-4o-mini](https://platform.openai.com/docs/models)                | AI language model                         |
| [Tailwind CSS 4](https://tailwindcss.com/)                                   | Utility-first styling                     |
| [Lucide React](https://lucide.dev/)                                          | Icon library                              |
