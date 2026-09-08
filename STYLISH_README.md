# SIH26092

## AI-Driven Scheme Matching for Marginalized Entrepreneurs

Welcome to **SIH26092**, a full-stack Smart India Hackathon prototype that helps users discover suitable financial schemes, calculate EMI estimates, and find nearby channel partners.

This README is written in a beginner-friendly way so anyone can understand how the project works, how to run it locally, how Docker is used, and how the app is deployed on Render.

---

## Live Project Links

```

> Replace the backend URL with your actual Render backend URL after deployment.

---

## What This Project Does

This project provides a simple platform where users can:

- Find a suitable financial scheme based on income, project cost, project type, and education status.
- Calculate EMI using loan amount, interest rate, tenure, and moratorium period.
- Locate nearby channel partners using latitude, longitude, and radius.
- View available schemes and scheme details.

The backend uses a transparent rule-based logic. No external AI API or machine learning model is required for the current prototype.

---

## Latest Changes: Before vs After

The latest update focused on making the prototype closer to the SIH26092 requirements while keeping the architecture lightweight.

| Area | Before | After |
| ---- | ------ | ----- |
| Partner locator | Nearby partners were filtered mainly by location radius and active status. | Nearby partners can now be filtered by location, scheme compatibility, eligibility status, and availability status. |
| Partner data | Partner records only had a basic `active` field. | Partner records now include prototype fields: `eligibility_status` and `availability_status`. |
| Scheme-to-partner flow | After getting a recommended scheme, the partner locator opened without carrying the selected scheme. | The recommended scheme is passed to the partner locator so results can be filtered for compatible partners. |
| Partner UI | Some labels implied real authorization or live partner status. | Labels now clearly say demo/prototype partner data and show eligibility/availability status. |
| Multilingual support | No centralized language structure existed in `frontend/src/i18n`. | Added local English/Hindi translation files and a `LanguageContext` provider. |
| Language switch | The UI did not expose a language selector. | Navbar now has an English/Hindi selector using local translations. |
| Home page copy | Some text said “AI-driven” in a way that could imply ML/LLM usage. | Copy now says explainable rule-based assistance, matching the actual implementation. |
| EMI calculator copy | Some text claimed “exact government methodology.” | Copy now says backend reducing-balance calculations for the prototype and documents moratorium assumptions. |
| Scheme copy | Some screens used wording like “official demo” or “verified.” | Copy now consistently says demo/prototype unless real official data is actually used. |
| External dependencies | No new external API was needed. | Still no Google Maps API, ML model, LLM, database, or translation API was added. |

Files changed in this update:

```text
backend/main.py
frontend/src/i18n/en.js
frontend/src/i18n/hi.js
frontend/src/i18n/LanguageContext.jsx
frontend/src/main.jsx
frontend/src/components/Navbar.jsx
frontend/src/components/PartnerCard.jsx
frontend/src/components/RecommendationCard.jsx
frontend/src/components/Footer.jsx
frontend/src/components/SchemeDetailsModal.jsx
frontend/src/pages/Home.jsx
frontend/src/pages/PartnerLocator.jsx
frontend/src/pages/EMICalculator.jsx
frontend/src/pages/Schemes.jsx
frontend/src/services/api.js
frontend/src/styles/index.css
```

Verification performed:

```bash
python -m py_compile backend\main.py
cmd /c npm run build
```

Both checks passed.

---

## Component-Wise SIH Explanation

Use this section to explain the project clearly during SIH evaluation.

### 1. Frontend Application

What it does:

```text
The frontend is the user-facing part of SchemeSaathi.
It provides pages, forms, buttons, cards, navigation, language selection,
and result displays for all three core modules.
```

What it uses:

```text
React
Vite
JavaScript
CSS
React Router
Lucide React icons
```

How it works:

```text
User opens the React app
  |
  v
User enters details in forms
  |
  v
Frontend validates basic input
  |
  v
Frontend sends HTTP/JSON request to FastAPI backend
  |
  v
Frontend receives JSON response
  |
  v
Frontend displays recommendation, EMI, or partner results
```

How to explain in SIH:

```text
The frontend is built with React and Vite. It handles only the user
interface and basic validation. Important decisions like eligibility,
scheme scoring, EMI calculation, and partner filtering are handled by
the backend so that the business logic remains reliable and centralized.
```

---

### 2. Backend Application

What it does:

```text
The backend is the main decision-making layer.
It exposes APIs for scheme recommendation, EMI calculation,
scheme browsing, and partner location.
```

What it uses:

```text
Python
FastAPI
Uvicorn
Pydantic
In-memory demo data
```

How it works:

```text
Frontend sends request
  |
  v
FastAPI receives request
  |
  v
Pydantic validates request data
  |
  v
Backend runs rule-based logic
  |
  v
Backend returns structured JSON response
```

How to explain in SIH:

```text
Our backend is built with FastAPI. It keeps all important logic on the
server side, including eligibility checking, recommendation scoring,
EMI calculation, and Haversine distance calculation. This prevents the
frontend from becoming the source of financial or eligibility decisions.
```

---

### 3. Scheme Matcher Component

Main files:

```text
frontend/src/pages/SchemeMatcher.jsx
frontend/src/components/RecommendationCard.jsx
backend/main.py
```

What it does:

```text
It helps a beneficiary find the most suitable scheme based on:

- Annual income
- Project cost
- Project type
- Education status
```

What it uses:

```text
Rule-based eligibility checking
Rule-based scoring
FastAPI /recommend endpoint
React form and result card
```

How it works:

```text
User enters beneficiary details
  |
  v
Frontend sends data to POST /recommend
  |
  v
Backend checks eligibility for each scheme
  |
  v
Backend scores only eligible schemes
  |
  v
Best scheme is selected
  |
  v
Alternatives are also returned
  |
  v
Frontend displays the result with explanation
```

Scoring logic:

```text
40% - Project cost fit
30% - Lower interest rate
20% - Longer moratorium
10% - Income headroom
```

How to explain in SIH:

```text
The scheme matcher is an explainable rule-based recommendation engine.
First, it checks whether the applicant is eligible for each scheme.
Then it scores only the eligible schemes using transparent factors like
project-cost fit, interest rate, moratorium period, and income headroom.
It is not machine learning; it is intentionally transparent and easy to audit.
```

---

### 4. Eligibility Engine

Main file:

```text
backend/main.py
```

What it checks:

```text
Income limit
Project type
Project cost
Education status
Scheme-specific restrictions
```

How it works:

```text
For each scheme:
  |
  |-- Is income within limit?
  |-- Is project type supported?
  |-- Is project cost within maximum funding?
  |-- Is education status valid for education scheme?
  |
  v
If all checks pass, scheme is eligible.
If any check fails, scheme is rejected with a reason.
```

How to explain in SIH:

```text
Eligibility and ranking are separated. Eligibility answers whether the
beneficiary can use a scheme. Scoring answers which eligible scheme is
the best fit. This makes the recommendation easier to explain.
```

---

### 5. Recommendation Explanation Component

Main files:

```text
backend/main.py
frontend/src/components/RecommendationCard.jsx
```

What it does:

```text
It explains why a scheme was selected instead of only showing the name.
```

What it uses:

```text
Backend-generated recommendation reason
Interest rate
Maximum funding amount
Moratorium period
Alternative scheme list
```

How it works:

```text
Backend builds a reason using actual user inputs
  |
  v
Frontend displays:
  |
  |-- Recommended scheme
  |-- Interest rate
  |-- Maximum amount
  |-- Moratorium
  |-- Match confidence
  |-- Explanation
  |-- Alternative eligible schemes
```

How to explain in SIH:

```text
The recommendation is explainable. The user can see why they are eligible,
how their project cost fits the scheme limit, and what financial parameters
made the scheme a good match.
```

---

### 6. EMI Calculator Component

Main files:

```text
frontend/src/pages/EMICalculator.jsx
frontend/src/components/EMIResult.jsx
backend/main.py
```

What it does:

```text
It calculates estimated monthly EMI, total repayment,
total interest, and active repayment months.
```

What it uses:

```text
Loan amount
Annual interest rate
Tenure in months
Moratorium months
FastAPI /calculate-emi endpoint
Reducing-balance EMI formula
```

How it works:

```text
User enters loan details
  |
  v
Frontend sends data to POST /calculate-emi
  |
  v
Backend validates values
  |
  v
Backend calculates repayment months:
tenure_months - moratorium_months
  |
  v
Backend calculates EMI
  |
  v
Frontend displays repayment summary
```

Formula concept:

```text
Monthly interest rate = annual_interest_rate / 12 / 100
```

Moratorium assumption:

```text
No repayment during moratorium.
No interest capitalization during moratorium in this prototype.
EMI is calculated over the remaining repayment months.
```

How to explain in SIH:

```text
The EMI calculator is backend-driven. The frontend only collects inputs.
The backend calculates EMI using reducing-balance math and returns the
monthly EMI, total payment, total interest, and a note explaining the
prototype moratorium assumption.
```

---

### 7. Partner Locator Component

Main files:

```text
frontend/src/pages/PartnerLocator.jsx
frontend/src/components/PartnerCard.jsx
backend/main.py
```

What it does:

```text
It finds nearby demo channel partners based on:

- User latitude
- User longitude
- Search radius
- Scheme compatibility
- Partner eligibility status
- Partner availability status
```

What it uses:

```text
FastAPI /partners/nearby endpoint
Haversine formula
In-memory demo partner data
React city presets
Browser geolocation option
```

How it works:

```text
User enters location or selects demo city
  |
  v
User optionally selects scheme compatibility
  |
  v
Frontend sends data to POST /partners/nearby
  |
  v
Backend filters inactive / ineligible / unavailable partners
  |
  v
Backend filters partners that support selected scheme
  |
  v
Backend calculates distance using Haversine
  |
  v
Backend sorts partners by nearest distance
  |
  v
Frontend displays partner list
```

How to explain in SIH:

```text
The partner locator does not use Google Maps or any external map API.
It uses latitude and longitude with the Haversine formula to calculate
approximate straight-line distance. This keeps the prototype lightweight
while still satisfying the geo-spatial locator requirement.
```

Important note:

```text
The distance shown is straight-line geographical distance,
not road distance or driving time.
```

---

### 8. Haversine Distance Logic

Main file:

```text
backend/main.py
```

What it does:

```text
Calculates approximate distance between the user's coordinates
and each partner's coordinates.
```

What it uses:

```text
Latitude
Longitude
Earth radius = 6371 km
Python math module
```

How it works:

```text
User latitude + longitude
  |
  v
Partner latitude + longitude
  |
  v
Convert degrees to radians
  |
  v
Apply Haversine formula
  |
  v
Return distance in kilometers
```

How to explain in SIH:

```text
We use Haversine because the current requirement is to identify nearby
partners. It is simple, fast, and does not require an external routing API.
If production requires driving distance, a routing service can be added later.
```

---

### 9. Translator / Multilingual Component

Main files:

```text
frontend/src/i18n/en.js
frontend/src/i18n/hi.js
frontend/src/i18n/LanguageContext.jsx
frontend/src/components/Navbar.jsx
frontend/src/pages/Home.jsx
```

What it does:

```text
It allows the frontend UI to switch between English and Hindi.
```

What it uses:

```text
Local translation files
React Context API
Language selector in Navbar
No Google Translation API at runtime
No external translation service
```

How it works:

```text
English strings are stored in en.js
Hindi strings are stored in hi.js
  |
  v
LanguageContext stores selected language
  |
  v
Navbar language dropdown updates selected language
  |
  v
Components call t("translation.key")
  |
  v
Correct English or Hindi text is displayed
```

Example:

```javascript
t("home.actions.matcher")
```

This displays:

```text
English: Find My Scheme
Hindi: मेरी योजना खोजें
```

How to explain in SIH:

```text
The multilingual feature uses local translation files and React Context.
We do not call Google Translation API during runtime. This makes the app
faster, cheaper, more reliable, and safer because no translation credentials
are exposed in the frontend.
```

Why this approach is good:

```text
Works offline after app load
No API cost
No runtime dependency
No secret keys in frontend
Consistent reviewed translations
Easy to add more languages later
```

---

### 10. API Service Layer

Main file:

```text
frontend/src/services/api.js
```

What it does:

```text
It centralizes all frontend-to-backend API calls.
```

What it uses:

```text
fetch()
VITE_API_BASE_URL
Reusable request helper
Centralized error handling
```

How it works:

```text
Component calls helper function
  |
  v
api.js builds request
  |
  v
Request goes to FastAPI backend
  |
  v
api.js handles JSON response or error
  |
  v
Component receives clean data
```

API helper examples:

```text
getSchemes()
getScheme()
recommendScheme()
calculateEMI()
getPartners()
findNearbyPartners()
checkHealth()
```

How to explain in SIH:

```text
We use a centralized API service layer so raw fetch calls are not scattered
across components. This makes the frontend easier to maintain and improves
error handling.
```

---

### 11. Error Handling

Main files:

```text
frontend/src/services/api.js
frontend/src/components/ErrorMessage.jsx
Backend Pydantic validation in backend/main.py
```

What it handles:

```text
Invalid form inputs
Backend validation errors
HTTP errors
Network errors
Backend unavailable state
```

How it works:

```text
Frontend performs basic validation
  |
  v
Backend performs strict validation using Pydantic
  |
  v
api.js converts backend errors into readable messages
  |
  v
ErrorMessage component displays the error to the user
```

How to explain in SIH:

```text
The app validates inputs both on the frontend and backend. Backend validation
is the final authority. This prevents invalid income, project cost, EMI, or
location values from being processed silently.
```

---

### 12. Docker Component

Main files:

```text
backend/Dockerfile
docker-compose.yaml
```

What it does:

```text
Docker packages the backend and allows the project to run consistently
across different machines and deployment environments.
```

What it uses:

```text
Docker
Docker Compose
Python image
Backend requirements.txt
Uvicorn startup command
```

How it works:

```text
Dockerfile installs Python dependencies
  |
  v
Copies backend code
  |
  v
Starts FastAPI using Uvicorn
```

How to explain in SIH:

```text
Docker makes the backend reproducible. Instead of depending on each
machine's Python setup, Docker creates a consistent backend environment
with FastAPI, Uvicorn, dependencies, and application code.
```

---

### 13. Render Deployment Component

What it does:

```text
Render is used to deploy the frontend and backend separately.
```

What it uses:

```text
Render Static Site for frontend
Render Web Service for backend
Environment variables
Dockerized backend
```

How it works:

```text
Frontend is built into static files
  |
  v
Render Static Site hosts frontend

Backend runs as a web service
  |
  v
Render Web Service hosts FastAPI API

Frontend uses VITE_API_BASE_URL
  |
  v
Frontend sends requests to deployed backend
```

How to explain in SIH:

```text
The frontend and backend are deployed separately because they have different
hosting needs. React/Vite becomes static files, while FastAPI must run as a
server. The frontend connects to the backend using an environment variable.
```

---

### 14. Complete End-to-End Flow

```text
User opens SchemeSaathi
  |
  v
Selects English or Hindi
  |
  v
Enters income, project cost, project type, education status
  |
  v
Gets recommended scheme with explanation
  |
  v
Calculates EMI for that scheme
  |
  v
Finds nearby compatible demo channel partners
  |
  v
Receives sorted partner list with distance and status
```

30-second explanation:

```text
SchemeSaathi is a lightweight multilingual platform for marginalized
entrepreneurs. It helps users answer three questions: which scheme is suitable,
how much EMI they may need to pay, and where they can apply. The backend uses
transparent rule-based eligibility and scoring, reducing-balance EMI logic,
and Haversine distance for partner location. The frontend provides a simple
React interface with English and Hindi support.
```

---

## Project Architecture

```text
User
  |
  v
Frontend on Render
React + Vite
  |
  | HTTPS API Requests
  v
Backend on Render
FastAPI + Uvicorn
  |
  v
Python Rule-Based Logic
```

Production deployment:

```text
Frontend:
Render Static Site

Backend:
Render Web Service

Backend Containerization:
Docker
```

Local DevOps setup:

```text
Docker Compose
  |
  |-- Frontend service
  |-- Backend service
```

---

## Tech Stack

### Frontend

```text
React
Vite
JavaScript
CSS
React Router
Lucide React
```

### Backend

```text
Python
FastAPI
Uvicorn
Pydantic
```

### DevOps

```text
Docker
Docker Compose
Render
GitHub
Environment Variables
CORS
Health Check Endpoint
```

---

## Folder Structure

```text
SIH26092-main/
  |
  |-- backend/
  |   |-- main.py
  |   |-- requirements.txt
  |   |-- Dockerfile
  |   |-- .dockerignore
  |   |-- README.md
  |
  |-- frontend/
  |   |-- public/
  |   |-- src/
  |   |   |-- assets/
  |   |   |-- components/
  |   |   |-- pages/
  |   |   |-- services/
  |   |   |-- styles/
  |   |   |-- utils/
  |   |   |-- App.jsx
  |   |   |-- main.jsx
  |   |-- package.json
  |   |-- package-lock.json
  |   |-- vite.config.js
  |   |-- README.md
  |
  |-- docker-compose.yaml
  |-- .gitignore
  |-- README.md
```

---

## Beginner Explanation

Think of this project as two parts:

### 1. Frontend

The frontend is what the user sees in the browser.

It is built with:

```text
React + Vite
```

It contains pages, buttons, forms, cards, and the user interface.

### 2. Backend

The backend does the main processing.

It is built with:

```text
FastAPI + Python
```

It receives requests from the frontend, runs the logic, and sends results back.

Example:

```text
User fills scheme matcher form
  |
  v
Frontend sends data to backend
  |
  v
Backend checks rules
  |
  v
Backend returns best scheme
  |
  v
Frontend displays result
```

---

## Backend API Endpoints

```text
GET  /
GET  /health
GET  /schemes
GET  /schemes/{scheme_id}
POST /recommend
POST /calculate-emi
GET  /partners
POST /partners/nearby
```

Useful URLs during local development:

```text
http://127.0.0.1:8000/docs
http://127.0.0.1:8000/health
```

Useful URLs during Docker testing:

```text
http://localhost:10000/docs
http://localhost:10000/health
```

---

## Prerequisites

Install these tools before running the project:

- Git
- Node.js
- npm
- Python
- pip
- Docker
- Docker Compose

To check if they are installed:

```bash
git --version
node --version
npm --version
python --version
docker --version
docker compose version
```

---

## Run Backend Locally

Go to the backend folder:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment.

Windows:

```bash
venv\Scripts\activate
```

Linux/macOS:

```bash
source venv/bin/activate
```

Install backend dependencies:

```bash
pip install -r requirements.txt
```

Start the backend:

```bash
uvicorn main:app --reload
```

Backend runs at:

```text
http://127.0.0.1:8000
```

Open API docs:

```text
http://127.0.0.1:8000/docs
```

Open health check:

```text
http://127.0.0.1:8000/health
```

Expected response:

```json
{
  "status": "healthy"
}
```

---

## Run Frontend Locally

Open a new terminal and go to the frontend folder:

```bash
cd frontend
```

Install frontend dependencies:

```bash
npm install
```

Create a `.env` file inside the `frontend` folder:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

---

## Environment Variable Explained

The frontend needs to know where the backend is running.

That is why this variable is used:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

For local development:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

For Docker Compose:

```env
VITE_API_BASE_URL=http://localhost:10000
```

For production:

```env
VITE_API_BASE_URL=https://your-backend.onrender.com
```

If this variable is not added, the frontend uses its default fallback:

```text
http://127.0.0.1:8000
```

---

## Docker Backend Setup

The backend has a Dockerfile:

```text
backend/Dockerfile
```

Go to the backend folder:

```bash
cd backend
```

Build the Docker image:

```bash
docker build -t sih26092-backend .
```

Run the Docker container:

```bash
docker run -p 10000:10000 sih26092-backend
```

Dockerized backend runs at:

```text
http://localhost:10000
```

Test docs:

```text
http://localhost:10000/docs
```

Test health:

```text
http://localhost:10000/health
```

---

## Docker Compose Setup

Docker Compose runs both frontend and backend together.

From the project root folder:

```bash
docker compose up --build
```

After it starts:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:10000
Docs:     http://localhost:10000/docs
Health:   http://localhost:10000/health
```

To stop everything:

```bash
docker compose down
```

---

## Render Deployment

The project uses two Render services:

```text
Frontend: Render Static Site
Backend: Render Web Service
```

---

## Deploy Backend On Render

Create a new Render Web Service.

Use these settings:

```text
Root Directory: backend
Runtime: Docker
Dockerfile Path: Dockerfile
```

The backend starts with:

```bash
uvicorn main:app --host 0.0.0.0 --port 10000
```

After deployment, verify:

```text
https://your-backend.onrender.com/health
https://your-backend.onrender.com/docs
```

Expected health response:

```json
{
  "status": "healthy"
}
```

---

## Deploy Frontend On Render

Create a new Render Static Site.

Use these settings:

```text
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: dist
```

Set this environment variable in Render:

```env
VITE_API_BASE_URL=https://your-backend.onrender.com
```

After deployment, open:

```text
https://sih26092-frontend.onrender.com/matcher
```

---

## CORS Configuration

The backend uses CORS to allow the frontend to call the API.

Allowed local frontend URLs:

```text
http://localhost:5173
http://127.0.0.1:5173
http://localhost:3000
http://127.0.0.1:3000
```

Allowed production frontend URL:

```text
https://sih26092-frontend.onrender.com
```

If the production frontend is not added to CORS, the browser may block API requests.

---

## Testing Checklist

### Frontend

```text
[ ] Website opens
[ ] Navigation works
[ ] Scheme matcher page opens
[ ] Forms accept input
[ ] Buttons work
[ ] Results display correctly
```

### Backend

```text
[ ] /health works
[ ] /docs works
[ ] /schemes works
[ ] /recommend works
[ ] /calculate-emi works
[ ] /partners works
[ ] /partners/nearby works
```

### Integration

```text
[ ] Frontend sends request to backend
[ ] Backend returns JSON response
[ ] Frontend displays the result
[ ] No CORS errors
[ ] No failed API requests
```

### Device Testing

```text
[ ] Desktop
[ ] Tablet
[ ] Mobile
```

---

## DevOps Contribution

The DevOps contribution in this project includes:

```text
Dockerized the FastAPI backend
Added backend .dockerignore
Added health check endpoint
Configured production-ready Uvicorn command
Configured frontend API URL using environment variables
Added Docker Compose for local full-stack execution
Prepared Render deployment flow
Configured CORS for frontend/backend communication
Documented local setup, Docker setup, and production deployment
```

---

## Why Docker Is Used

Docker packages the backend with everything it needs:

```text
Python
FastAPI
Uvicorn
Dependencies
Application code
```

This makes the backend easier to run on different machines and deployment platforms.

---

## Why The Frontend Is Hosted Separately

The frontend is built with React and Vite.

When this command runs:

```bash
npm run build
```

Vite creates static production files:

```text
HTML
CSS
JavaScript
Assets
```

These files can be hosted efficiently on Render Static Site.

---

## Why The Backend Is Dockerized

The backend is a running Python API server.

It needs:

```text
Python runtime
Installed dependencies
Uvicorn server
FastAPI app
```

Docker makes this environment consistent and deployment-ready.

---

## Why Two Render Services Are Used

The frontend and backend have different hosting needs.

```text
Frontend:
Static files served by Render Static Site

Backend:
Running Python API served by Render Web Service
```

This separation is clean, scalable, and easy to explain during a demo.

---

## Demo Flow

```text
User opens frontend URL
  |
  v
React app loads in browser
  |
  v
User submits a form
  |
  v
Frontend sends HTTPS request
  |
  v
FastAPI backend receives request
  |
  v
Python logic processes data
  |
  v
Backend returns JSON response
  |
  v
Frontend displays result
```

---

## Demo Explanation

You can explain the DevOps work like this:

```text
My contribution was to make the project deployment-ready and reproducible.
I Dockerized the FastAPI backend, added a health check endpoint, configured environment-based API URLs, added Docker Compose for local full-stack execution, configured CORS, and prepared the app for Render deployment.
```

---

## Final Definition Of Done

```text
[ ] Frontend deployed on Render
[ ] Backend deployed on Render
[ ] Backend running inside Docker
[ ] Frontend uses backend URL through environment variable
[ ] Backend allows frontend through CORS
[ ] /health endpoint works
[ ] /docs endpoint works
[ ] Scheme recommendation works
[ ] EMI calculator works
[ ] Partner locator works
[ ] No local services needed for production use
[ ] README explains setup and deployment
```

---

## Prototype Notice

This project is a hackathon prototype.

Scheme data and channel partner data used in the backend are demo data. They are not verified official government records and should not be treated as live, authoritative, or currently valid scheme information.

---

## Future DevOps Improvements

Possible improvements after the prototype:

```text
GitHub Actions CI/CD pipeline
Automated Docker image build
Automated deployment workflow
Cloud monitoring
Structured logging
Secrets management
Database integration
AWS ECS/Fargate deployment
Terraform infrastructure as code
Prometheus and Grafana monitoring
```

---

## Quick Commands Summary

Run backend locally:

```bash
cd backend
uvicorn main:app --reload
```

Run frontend locally:

```bash
cd frontend
npm install
npm run dev
```

Build backend Docker image:

```bash
cd backend
docker build -t sih26092-backend .
```

Run backend Docker container:

```bash
docker run -p 10000:10000 sih26092-backend
```

Run full app with Docker Compose:

```bash
docker compose up --build
```

Stop Docker Compose:

```bash
docker compose down
```
