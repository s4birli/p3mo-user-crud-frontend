# P3MO - User CRUD Frontend

This is a frontend application developed for the P3MO developer evaluation test. The application provides a user management system with CRUD operations, statistics visualization, and PDF generation capabilities.

## Project Overview

This project is built as a user management system with the following features:
- User listing and detailed view
- User creation, update, and deletion
- Role management
- Statistics visualization with interactive charts
- PDF generation for reports

## Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router for routing and server components
- **TailwindCSS** - Utility-first CSS framework for styling
- **ShadCN UI** - Component library built on Radix UI primitives
- **React Hook Form** - Form management with validation
- **Zod** - Schema validation for forms and API requests
- **Highcharts** - Interactive charts for data visualization
- **Axios** - HTTP client for API requests

### Backend for Frontend (BFF)
- **Next.js Route Handlers** - Server-side API endpoints that proxy requests to the .NET backend
- **Server-side services** - Centralized API services for server components

## Architecture

The application follows a clean architecture with:
- **BFF Pattern** - Frontend never calls .NET backend directly; all calls are routed through Next.js route handlers
- **SSR Support** - Server-side rendering where possible
- **Responsive Design** - Mobile and desktop friendly layouts
- **Type Safety** - TypeScript throughout with strictly typed API interfaces

## Directory Structure

- `/src/app` - Next.js app router pages and API routes
- `/src/components` - Reusable UI components
  - `/charts` - Highcharts implementations
  - `/forms` - Form components with validation
  - `/ui` - Base UI components
- `/src/services` - API services and utilities
- `/src/lib` - Utility functions and validation schemas
- `/src/types` - TypeScript type definitions

## Features

### User Management
- Complete CRUD operations for user records
- Form validation using React Hook Form and Zod
- Role assignment and management

### Dashboard & Statistics
- Active/Inactive user counts
- Role distribution chart
- Monthly registration statistics

### PDF Generation
- Generate PDF reports of user data
- PDF generation handled by backend service using Playwright

## Getting Started

1. First, clone the repository:
```bash
git clone https://github.com/your-username/p3mo-user-crud-frontend.git
cd p3mo-user-crud-frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn
# or
pnpm install
```

3. Create a `.env.local` file with the following environment variables:
```
BACKEND_API_URL=http://localhost:5000/api
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Backend Integration

This frontend works with a .NET 9.0 backend that provides:
- REST API endpoints for CRUD operations
- Entity Framework Core with code-first database approach
- PDF generation capability using Playwright

Backend repository: [p3mo-user-crud-backend](https://github.com/s4birli/p3mo-user-crud-backend)

## Deployment

For production deployment:

```bash
npm run build
npm run start
# or
yarn build
yarn start
```

## Implementation Notes

- Server-side rendering is used where possible for improved performance and SEO
- Client-side components are used for interactive elements
- PDF generation calls go through the BFF to the backend service
- Environmental configuration separates development and production settings
