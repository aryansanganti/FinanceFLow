# Personal Finance Visualizer

## Overview

This is a full-stack personal finance application built with React, Express, and PostgreSQL. The application allows users to track income and expenses, set budgets, and visualize their financial data through interactive charts and summaries.

## System Architecture

The application follows a modern full-stack architecture with clear separation between frontend and backend:

- **Frontend**: React with TypeScript, using Vite for development and build tooling
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **UI Framework**: shadcn/ui components built on Radix UI and Tailwind CSS
- **State Management**: TanStack Query for server state management

## Key Components

### Database Schema
- **Transactions Table**: Stores financial transactions with fields for description, amount, category, type (income/expense), and date
- **Budgets Table**: Stores budget limits per category
- **Drizzle ORM**: Provides type-safe database operations and schema validation

### Backend Architecture
- **Express Server**: RESTful API with middleware for logging and error handling
- **Storage Layer**: Abstracted storage interface with in-memory implementation for development
- **Route Handlers**: CRUD operations for transactions and budgets with proper validation
- **Database Integration**: Uses Neon Database (PostgreSQL) for production

### Frontend Architecture
- **Component Structure**: Modular React components following single responsibility principle
- **UI Components**: Comprehensive shadcn/ui component library for consistent design
- **Form Management**: React Hook Form with Zod validation schemas
- **Data Visualization**: Recharts for interactive charts (pie charts, bar charts)
- **Routing**: Wouter for lightweight client-side routing

### Key Features
- **Transaction Management**: Add, edit, delete, and categorize financial transactions
- **Budget Tracking**: Set category-based budgets and monitor spending against limits
- **Data Visualization**: Monthly expense trends and category breakdowns
- **Analytics**: Financial summaries and spending insights
- **Responsive Design**: Mobile-first design with Tailwind CSS

## Data Flow

1. **User Input**: Forms capture transaction and budget data with client-side validation
2. **API Requests**: TanStack Query manages server communication and caching
3. **Server Processing**: Express routes handle business logic and data validation
4. **Database Operations**: Drizzle ORM performs type-safe database queries
5. **Response Handling**: Data is returned to frontend and cached for optimal UX
6. **UI Updates**: React components re-render with updated data automatically

## External Dependencies

### Core Technologies
- **Database**: Neon Database (PostgreSQL serverless)
- **ORM**: Drizzle with Zod schemas for validation
- **UI Library**: Radix UI primitives with shadcn/ui components
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form with Zod resolvers

### Development Tools
- **Build Tool**: Vite with React plugin
- **TypeScript**: Full type safety across frontend and backend
- **Tailwind CSS**: Utility-first styling with custom design system
- **ESBuild**: Backend bundling for production


- **Development**: Uses Vite dev server with HMR and Express backend
- **Production Build**: Frontend built to static assets, backend bundled with ESBuild
- **Environment Variables**: Database URL and other config via environment variables
- **Asset Serving**: Express serves static frontend assets in production
- **Database Migrations**: Drizzle handles schema migrations

## Changelog

- July 05, 2025. Initial setup
