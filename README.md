# EcoSpark

A modern web application built with React, TypeScript, and Express that promotes environmental awareness and sustainability.

## About This Project

This project was developed with a focus on rapid prototyping and intuitive development practices. The approach prioritized getting a working solution quickly rather than extensive planning phases, allowing for organic evolution of the codebase based on real-world needs and user feedback.

## Features

- Responsive web interface with modern React components
- Full-stack application with Express backend
- PostgreSQL database integration with Drizzle ORM
- Admin dashboard functionality
- Multi-language support
- Contact form and user interaction features
- Docker deployment support

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js
- **Deployment**: Docker, Docker Compose
- **Development**: Vite, ESBuild

## Getting Started

### Prerequisites

- Node.js (18+)
- PostgreSQL
- Docker (optional)

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your database and environment variables

3. Run database migrations:
   ```bash
   npm run db:push
   npm run seed
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Docker Deployment

1. Build and run with Docker Compose:
   ```bash
   docker-compose up -d
   ```

2. For production deployment:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Type checking
- `npm run db:push` - Push database schema
- `npm run seed` - Seed database with initial data

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.