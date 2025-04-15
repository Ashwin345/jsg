# JetSetGO Flight Booking Platform

A full-stack application that allows users to search for real-time flight data via Amadeus API, with secure user authentication and personalized booking management.

## Project Structure

The project is divided into two main parts:

- **Frontend**: React application with Vite
- **Backend**: Express.js API server

## Features

- Interactive flight search interface with filters for dates, destinations, and preferences
- User authentication system with secure JWT implementation and profile management
- Real-time flight results display with sorting and filtering capabilities
- Booking management dashboard for users to view, save, and manage selected flights
- Responsive design with intuitive navigation between search, results, and user account pages

## Getting Started

### Backend

```bash
cd JetSetGo/backend
npm install
npm run dev
```

### Frontend

```bash
cd JetSetGo/frontend
npm install
npm run dev
```

## API Keys

This application uses the Amadeus API for flight data. You'll need to set up your API keys in the backend .env file.

```
AMADEUS_API_KEY=your_api_key
AMADEUS_API_SECRET=your_api_secret
```
