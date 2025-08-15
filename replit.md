# Overview

This is a full-stack web application for GreenTech Energy, a renewable energy company. The application features a modern React frontend with a Node.js/Express backend, designed to showcase the company's sustainable energy solutions and capture customer inquiries through a contact form. The application uses a clean, professional design with shadcn/ui components and integrates with a PostgreSQL database for data persistence.

# User Preferences

Preferred communication style: Simple, everyday language.
Languages: Russian, English, French - User requested multi-language support with language switching functionality.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **Internationalization**: Custom React Context-based translation system supporting Russian, English, and French languages with localStorage persistence and language selector component

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API endpoints with JSON responses
- **Database Integration**: Drizzle ORM for type-safe database operations
- **Validation**: Zod schemas for runtime type validation
- **Error Handling**: Centralized error handling middleware with structured error responses

## Data Storage
- **Database**: PostgreSQL with Neon serverless database provider
- **ORM**: Drizzle ORM with connection pooling
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Database Tables**: 
  - `users` table for user authentication (username/password)
  - `contacts` table for storing contact form submissions with fields for name, email, company, message, and timestamps

## Authentication & Authorization
- **Session Management**: Express sessions with PostgreSQL session store (connect-pg-simple)
- **User Storage**: Database-backed user management with password storage
- **API Security**: Session-based authentication for protected routes

## Development & Build Process
- **Development Server**: Vite dev server with HMR for frontend, tsx for backend development
- **Build Process**: Vite for frontend bundling, esbuild for backend compilation
- **Type Safety**: Shared TypeScript types between frontend and backend via shared schema definitions
- **Development Tools**: Replit-specific plugins for enhanced development experience

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL database hosting
- **Connection Pooling**: @neondatabase/serverless for optimized database connections

## UI & Design System
- **Radix UI**: Comprehensive set of low-level UI primitives for accessibility
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Lucide React**: Icon library for consistent iconography
- **Google Fonts**: External font loading (DM Sans, Fira Code, Geist Mono, Architects Daughter)

## Backend Services
- **Session Storage**: PostgreSQL-backed session management
- **WebSocket Support**: ws library for WebSocket connections with Neon database

## Development Tools
- **Replit Integration**: Custom Vite plugins for Replit-specific development features
- **Development Banner**: Replit development environment indicator

## Build & Deployment
- **Vite**: Frontend build tool with React plugin support
- **esbuild**: Fast JavaScript/TypeScript bundler for backend compilation
- **PostCSS**: CSS processing with Tailwind CSS and Autoprefixer

## Type Safety & Validation
- **Zod**: Runtime schema validation and type inference
- **Drizzle Zod**: Integration between Drizzle ORM and Zod for schema validation
- **TypeScript**: End-to-end type safety across the application stack