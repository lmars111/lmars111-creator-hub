# lmars111-creator-hub

A comprehensive creator management platform built with Next.js and TypeScript.

## Features

- **Admin Dashboard**: Complete administrative interface for managing users and content
- **User Management**: Role-based access control and user administration
- **Content Oversight**: Content moderation and review system
- **Analytics**: Platform usage and performance metrics

## Getting Started

### Development
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production
```bash
npm run build
npm start
```

## Admin Dashboard

Access the admin dashboard at `/admin/dashboard`. The dashboard includes:

- Analytics overview with user counts, revenue, and content statistics
- User management with search, filtering, and role management
- Content oversight with moderation capabilities

See [docs/admin-dashboard.md](docs/admin-dashboard.md) for detailed documentation.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── admin/dashboard/    # Admin dashboard page
│   ├── api/admin/         # Admin API routes
│   └── ...
├── components/            # React components
│   ├── AdminDashboard.tsx
│   ├── UserManagement.tsx
│   └── ContentOversight.tsx
├── lib/                   # Utility functions
│   └── auth.ts           # Authentication utilities
└── docs/                 # Documentation
    └── admin-dashboard.md
```