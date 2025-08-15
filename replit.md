# Overview

This is a full-stack web application for GreenTech Energy, a renewable energy company. The application features a modern React frontend with a Node.js/Express backend, designed to showcase the company's sustainable energy solutions and capture customer inquiries through a contact form. The application uses a clean, professional design with shadcn/ui components and integrates with a PostgreSQL database for data persistence.

# User Preferences

Preferred communication style: Simple, everyday language.
Languages: Russian, English, French - User requested multi-language support with language switching functionality.
Admin System Requirements: Full admin dashboard with authentication, role-based permissions, form viewing capabilities, and user management interface.

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
  - `users` table for user authentication with role association
  - `contacts` table for storing contact form submissions with fields for name, email, company, message, and timestamps
  - `roles` table for user role definitions (admin, etc.)
  - `permissions` table for granular permission control
  - `role_permissions` table for role-permission mapping

## Authentication & Authorization
- **Session Management**: Express sessions with PostgreSQL session store (connect-pg-simple)
- **User Storage**: Database-backed user management with password hashing using scrypt
- **API Security**: Session-based authentication for protected routes
- **Role-Based Access Control**: Users assigned to roles with specific permissions
- **Admin System**: Complete admin dashboard at `/admin` with login at `/admin/login`
- **Default Admin User**: Username: `admin`, Password: `admin` (created via seeding script)

## Development & Build Process
- **Development Server**: Vite dev server with HMR for frontend, tsx for backend development
- **Build Process**: Vite for frontend bundling, esbuild for backend compilation
- **Type Safety**: Shared TypeScript types between frontend and backend via shared schema definitions
- **Development Tools**: Replit-specific plugins for enhanced development experience

# Docker Deployment

## Production Deployment
- **Docker Support**: Complete Docker Compose setup for server deployment
- **Multi-container Architecture**: Separate containers for application and PostgreSQL database
- **Health Checks**: Docker health monitoring for both application and database containers
- **Production Configuration**: Optimized Docker Compose with security considerations
- **Auto-restart**: Containers automatically restart on failure
- **Volume Persistence**: Database data persisted in Docker volumes

## Docker Files
- `Dockerfile`: Multi-stage build with Node.js Alpine image, security hardening with non-root user
- `docker-compose.yml`: Development Docker setup with exposed database port
- `docker-compose.prod.yml`: Production-ready configuration with health checks and secure defaults
- `init.sql`: Database initialization script for session table and extensions
- `.env.example`: Template for environment variables with security guidelines
- `start.sh`: Automated deployment script with database initialization and admin user creation

## Deployment Process
1. Environment configuration with secure passwords and session secrets
2. Docker container build and startup with dependency management
3. Database migration execution and schema setup
4. Admin user creation with default credentials
5. Health check verification and service monitoring

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