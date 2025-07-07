# Raj Swarnim Resume Portfolio

## Overview

This is a modern, responsive resume portfolio website built for Raj Swarnim, a Technical Architect specializing in AI Research. The application showcases professional experience, projects, skills, and achievements through an interactive web interface.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Routing**: Wouter for client-side routing
- **State Management**: React Query (TanStack Query) for server state management
- **Animations**: Custom intersection observer hooks for scroll-based animations

### Backend Architecture
- **Server**: Express.js with TypeScript
- **Build Tool**: Vite for frontend bundling and development
- **Runtime**: Node.js with ESM modules
- **Development**: Hot module replacement (HMR) with Vite middleware

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL (via Neon serverless)
- **Storage Interface**: Abstracted storage layer with in-memory implementation for development
- **Schema**: User management with extensible structure

## Key Components

### Frontend Components
1. **Navigation**: Sticky navigation with smooth scrolling and active section highlighting
2. **Hero Section**: Profile showcase with animated statistics
3. **Experience Timeline**: Interactive timeline with job history and achievements
4. **Projects Gallery**: Showcase of key AI/ML projects with icons and metrics
5. **Skills Visualization**: Animated skill bars with proficiency levels
6. **Education & Research**: Academic background and publications
7. **Contact Form**: Professional contact information and resume download

### Backend Components
1. **Express Server**: RESTful API endpoints with middleware
2. **Storage Layer**: Abstracted CRUD operations for user data
3. **Route Management**: Centralized route registration
4. **Error Handling**: Comprehensive error middleware

### UI System
- **Design System**: Custom CSS variables for consistent theming
- **Component Library**: 40+ reusable UI components from shadcn/ui
- **Responsive Design**: Mobile-first approach with breakpoint management
- **Dark Mode**: CSS variable-based theme switching support

## Data Flow

1. **Static Data**: Resume information stored in TypeScript constants
2. **Component Rendering**: React components consume data and render UI
3. **User Interactions**: Navigation, scrolling, and animations trigger state updates
4. **API Communication**: React Query manages server state and caching
5. **Storage Operations**: Backend handles data persistence through storage interface

## External Dependencies

### Core Frontend Dependencies
- React ecosystem (React, React DOM, React Router alternative)
- Radix UI primitives for accessible components
- Tailwind CSS for utility-first styling
- Lucide React for consistent iconography

### Backend Dependencies
- Express.js for server framework
- Drizzle ORM for database operations
- Neon serverless for PostgreSQL hosting
- ESBuild for production bundling

### Development Tools
- Vite for development server and building
- TypeScript for type safety
- TSX for TypeScript execution
- Replit-specific plugins for development environment

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite compiles React application to static assets
2. **Backend Build**: ESBuild bundles server code with external dependencies
3. **Asset Optimization**: Automatic code splitting and minification
4. **Type Checking**: TypeScript compilation verification

### Production Setup
- **Static Assets**: Served from `dist/public` directory
- **Server**: Node.js serving Express application
- **Database**: PostgreSQL connection via environment variables
- **Environment**: Production/development mode switching

### Development Workflow
- **Hot Reload**: Vite HMR for instant frontend updates
- **API Proxy**: Development server proxies API requests
- **TypeScript**: Real-time type checking and compilation
- **Database Migrations**: Drizzle Kit for schema management

## Changelog
- July 07, 2025. Initial setup  
- July 07, 2025. Enhanced visual design with modern color palette and improved UI components
- July 07, 2025. Added AI-themed animations and dark/light mode toggle

## Recent Changes
- Implemented comprehensive dark/light mode support with theme toggle
- Added AI-themed gradient text animations inspired by modern developer portfolios
- Created floating animations, pulse effects, and smooth slide-in transitions
- Enhanced hero section with animated gradient text and floating profile image
- Added scroll-reveal animations that trigger when elements come into view
- Updated all components with dark mode variants and smooth color transitions
- Implemented AI gradient text for names, titles, and key elements
- Added button hover effects with shimmer animations
- Created card hover animations with elevation effects
- Consolidated ixigo experiences and enhanced project descriptions with detailed technical content

## User Preferences

Preferred communication style: Simple, everyday language.
Design preferences: Modern, professional look with good color contrast and visual hierarchy.