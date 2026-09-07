# SIH26092 — AI-Driven Scheme Matching for Marginalized Entrepreneurs

A full-stack web application developed for Smart India Hackathon (SIH26092) to help marginalized entrepreneurs identify suitable financial schemes based on their requirements and eligibility.

## Live Application

### Frontend

https://sih26092-frontend.onrender.com

### Backend API

https://your-backend.onrender.com

## Overview

Finding the right government financial scheme can be difficult because of the large number of available schemes and different eligibility requirements.

This application provides a simple interface where users can enter their details and receive suitable scheme recommendations. It also provides scheme information, EMI calculations, and nearby channel partner details.

## Features

* Scheme recommendations based on user requirements
* Scheme eligibility and details
* EMI calculator
* Nearby channel partner information
* Frontend and backend API integration
* Responsive web interface

## Architecture

```text
                         User
                           |
                           v
                    React + Vite
                           |
                    HTTPS API Requests
                           |
                           v
                    FastAPI Backend
                           |
                           v
                  Scheme Matching Logic
                           |
                           v
                        Results
```

The frontend is built using React and Vite and deployed as a Render Static Site.

Vite builds the frontend into static HTML, CSS, JavaScript, and asset files. The application remains dynamic because the frontend communicates with the FastAPI backend through API requests.

The backend is deployed separately as a Render Web Service.

## Technology Stack

### Frontend

* React
* Vite
* JavaScript
* CSS
* React Router

### Backend

* Python
* FastAPI
* Uvicorn
* Pydantic

### DevOps and Deployment

* Docker
* Docker Compose
* Render
* GitHub
* Environment Variables
* CORS

## Project Structure

```text
SIH26092/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .dockerignore
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── docker-compose.yaml
└── .gitignore
```

## Running Locally

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

The backend will be available at:

```text
http://127.0.0.1:8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

## Running with Docker

Build and start the application:

```bash
docker compose up --build
```

To stop the containers:

```bash
docker compose down
```

## Deployment

The frontend and backend are deployed separately on Render.

### Frontend Deployment

```text
Service: Static Site
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: dist
```

Environment variable:

```env
VITE_API_BASE_URL=https://your-backend.onrender.com
```

### Backend Deployment

```text
Service: Web Service
Root Directory: backend
Runtime: Docker
```

This architecture allows the frontend to be served as static files while the backend handles API requests and application logic.

## Application Flow

```text
User Input
    |
    v
React Frontend
    |
    v
FastAPI API
    |
    v
Scheme Matching Logic
    |
    v
JSON Response
    |
    v
Results displayed to User
```

## DevOps Implementation

The project includes the following deployment and DevOps practices:

* Dockerized FastAPI backend
* Docker Compose for local development
* Separate frontend and backend deployments
* Environment-based API configuration
* CORS configuration
* Backend health-check endpoint
* Render-based production deployment
* GitHub-based source code management

## Project Status

This project was developed as a Smart India Hackathon prototype and demonstrates a complete full-stack workflow from user input and scheme matching to API integration and cloud deployment.

## Disclaimer

This project is a hackathon prototype. Scheme and channel partner information used in the application may contain demonstration data and should not be considered official or authoritative government information.
