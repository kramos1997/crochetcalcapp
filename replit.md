# Crochet Pricing Calculator

## Overview

CrochetCraft Pro is a full-stack web application designed to help crochet artisans calculate fair prices for their handmade items. The application provides comprehensive pricing calculations that factor in materials, labor, business expenses, and profit margins to ensure creators can price their work appropriately and build sustainable businesses.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom crochet-themed color palette
- **State Management**: TanStack Query for server state, React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL storage
- **API Design**: RESTful endpoints with standardized error handling

### Database Architecture
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM with Drizzle Kit for migrations
- **Schema**: Centralized schema definitions in shared directory
- **Connection**: Connection pooling with @neondatabase/serverless

## Key Components

### Authentication System
- **Provider**: Replit Auth integration for seamless user authentication
- **Session Storage**: PostgreSQL-backed sessions with configurable TTL
- **User Management**: Automatic user creation and profile management
- **Authorization**: Route-level protection with middleware

### Pricing Calculator Engine
- **Materials Tracking**: Dynamic material cost calculation with quantity and unit pricing
- **Labor Calculations**: Hourly rate with complexity factors and time tracking
- **Business Expenses**: Overhead cost distribution across projects
- **Profit Margins**: Configurable wholesale and retail pricing calculations
- **Template System**: Reusable pricing templates for common project types

### Project Management
- **CRUD Operations**: Full project lifecycle management
- **Categorization**: Project categories for organization and analytics
- **Status Tracking**: Project status progression (quoted, in-progress, completed)
- **Template Integration**: Create projects from predefined templates

### Analytics Dashboard
- **Revenue Tracking**: Total and monthly revenue calculations
- **Performance Metrics**: Project completion rates and profit margins
- **Business Insights**: Category-wise performance analysis
- **Time Analytics**: Labor hour tracking and efficiency metrics

## Data Flow

1. **User Authentication**: Users authenticate via Replit Auth, creating or retrieving user profiles
2. **Project Creation**: Users input project details, materials, and labor requirements
3. **Pricing Calculation**: System calculates costs using configurable business rules
4. **Data Persistence**: Projects and calculations stored in PostgreSQL database
5. **Analytics Generation**: Aggregated data powers dashboard insights
6. **Template Management**: Successful projects can be saved as reusable templates

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection handling
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/***: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework

### Authentication
- **openid-client**: OpenID Connect authentication flow
- **passport**: Authentication middleware
- **connect-pg-simple**: PostgreSQL session store

### Development Tools
- **vite**: Build tool and development server
- **typescript**: Type safety and developer experience
- **drizzle-kit**: Database migration management

## Deployment Strategy

### Development Environment
- **Hot Reloading**: Vite HMR for frontend, tsx for backend auto-restart
- **Database**: Neon serverless PostgreSQL with development connection
- **Session Management**: In-memory sessions for development speed

### Production Build
- **Frontend**: Vite production build with asset optimization
- **Backend**: ESBuild bundling for Node.js deployment
- **Static Assets**: Served directly by Express in production
- **Database**: Production PostgreSQL with connection pooling

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **SESSION_SECRET**: Secure session encryption key
- **REPL_ID**: Replit environment identifier for auth
- **NODE_ENV**: Environment mode (development/production)

## Changelog

```
Changelog:
- July 01, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```