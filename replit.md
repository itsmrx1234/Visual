# VisualMatch - AI-Powered Visual Product Search

## Overview

VisualMatch is a modern web application that enables users to find visually similar products using AI-powered image analysis. Users can upload product images and discover matching items from a curated database through advanced machine learning techniques. The application combines computer vision, vector similarity search, and a sleek user interface to deliver an intuitive product discovery experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side is built with **React 18** using **TypeScript** and **Vite** as the build tool. The UI leverages **shadcn/ui** components built on top of **Radix UI** primitives, providing a modern and accessible design system. **TailwindCSS** handles styling with a dark theme configuration and custom color variables. State management utilizes **TanStack Query** for server state and caching, while **Wouter** provides lightweight client-side routing.

### Backend Architecture
The server implements a **REST API** using **Express.js** with TypeScript. The architecture follows a layered approach with separate modules for routing, storage, and ML services. The storage layer uses an abstraction pattern (`IStorage` interface) with both in-memory and database implementations, allowing for flexible data persistence strategies. The ML service integrates **TensorFlow.js** for image feature extraction and similarity computation.

### Data Storage Solutions
The application uses **Drizzle ORM** with **PostgreSQL** as the primary database, configured for the Neon serverless platform. The schema includes tables for users, products, and search history with support for vector embeddings stored as arrays. A fallback in-memory storage implementation provides development flexibility and testing capabilities.

### Image Processing and ML Pipeline
**TensorFlow.js Node** powers the computer vision capabilities, extracting high-dimensional feature vectors from uploaded images. The system preprocesses images to a standard 224x224 resolution and normalizes pixel values. Feature vectors are compared using cosine similarity to find visually similar products. The ML service includes fallback mechanisms for graceful degradation when models fail to load.

### API Design
The REST API follows RESTful conventions with endpoints for product management (`/api/products`), search functionality (`/api/search`), and file uploads. The search system supports both URL-based and file upload image inputs, with configurable similarity thresholds and result limits. Multer middleware handles multipart file uploads with validation for image types and size limits.

### Authentication and Sessions
The application uses **express-session** with **connect-pg-simple** for PostgreSQL-backed session storage. This provides persistent user sessions across server restarts while maintaining scalability for production deployments.

### Development Workflow
The development setup uses **Vite** with hot module replacement for rapid frontend iteration. **ESBuild** handles production builds for both client and server code. The TypeScript configuration includes path mapping for clean imports and shared type definitions between frontend and backend.

## External Dependencies

### Core Frameworks
- **React 18** - Frontend framework with hooks and modern patterns
- **Express.js** - Web server framework for REST API
- **TypeScript** - Type safety across the entire stack
- **Vite** - Frontend build tool and development server

### Database and ORM
- **PostgreSQL** - Primary relational database
- **Drizzle ORM** - Type-safe database toolkit
- **@neondatabase/serverless** - Serverless PostgreSQL connection
- **connect-pg-simple** - PostgreSQL session store

### Machine Learning
- **@tensorflow/tfjs-node** - Server-side TensorFlow for image processing
- Computer vision models for feature extraction
- Vector similarity algorithms for product matching

### UI and Styling
- **@radix-ui/react-*** - Accessible UI component primitives
- **TailwindCSS** - Utility-first CSS framework
- **class-variance-authority** - Component variant management
- **lucide-react** - Modern icon library

### State Management and Data Fetching
- **@tanstack/react-query** - Server state management and caching
- **react-hook-form** - Form state and validation
- **@hookform/resolvers** - Form validation resolvers

### File Processing
- **multer** - Multipart form data handling
- **react-dropzone** - Drag and drop file upload interface
- Client-side image resizing and optimization

### Development Tools
- **@replit/vite-plugin-runtime-error-modal** - Development error overlay
- **@replit/vite-plugin-cartographer** - Replit-specific development tools
- Various TypeScript and build configuration utilities