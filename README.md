# lmars111-creator-hub

A comprehensive Creator Hub dashboard built with Next.js, featuring earnings tracking, content management, and AI persona configuration.

## Features

- **Earnings Dashboard**: Track daily, weekly, and monthly earnings
- **Content Management**: Create, edit, and delete locked content
- **Unlock History**: View recent content unlocks and transactions
- **AI Persona Configuration**: Customize AI personality, tone, topics, and creativity

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

- `app/` - Next.js app directory with pages and API routes
- `components/` - React components
- `lib/` - Utility functions and types
- `docs/` - Documentation

## API Endpoints

All creator endpoints are protected and located under `/api/creator/`:

- `GET /api/creator/earnings` - Earnings summary
- `GET /api/creator/unlocks` - Recent unlocks
- `GET /api/creator/content` - Content list
- `POST /api/creator/content` - Create content
- `PUT /api/creator/content/[id]` - Update content
- `DELETE /api/creator/content/[id]` - Delete content
- `GET /api/creator/aiconfig` - AI configuration
- `PUT /api/creator/aiconfig` - Update AI configuration

## Demo

The application uses demo authentication with "jess" as the default creator for testing purposes.