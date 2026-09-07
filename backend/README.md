# SIH26092 — Smart Scheme Matching Backend

## 1. Project Purpose

This is the backend for **SIH26092 — AI-Driven Scheme Matching for
Marginalized Entrepreneurs**, built for the Ministry of Social Justice
and Empowerment (MoSJE) as part of Smart India Hackathon 2026.

It provides three core features:

1. **Smart Scheme Recommender** — a transparent, rule-based engine
   (no ML/LLM) that matches an applicant to the best-fit scheme.
2. **Financial / EMI Calculator** — reducing-balance EMI calculation
   with moratorium support.
3. **Geo-Spatial Channel Partner Locator** — finds nearby active
   channel partners using the Haversine formula.

> **DEMO / PROTOTYPE DATA NOTICE**
> All scheme data (`/schemes`) and channel partner data (`/partners`)
> in this backend are **DEMO data created for the hackathon
> prototype**. They are **not verified against official government
> scheme documentation** and must not be presented as live, official,
> or currently-authorized data. Replace with verified data before any
> real-world deployment.

## 2. Backend Technology

- Python 3
- FastAPI
- Uvicorn (ASGI server)
- Pydantic (validation)
- In-memory Python data (no database — intentional for MVP simplicity)

No authentication, database, external AI API, or message queue is used
in this MVP, by design.

## 3. Project Structure

```
backend/
├── main.py            # entire backend implementation
├── requirements.txt   # dependencies
└── README.md
```

## 4. Setup

### 4.1 Create and activate a virtual environment (Windows)

```powershell
python -m venv venv
venv\Scripts\activate
```

On macOS/Linux:

```bash
python3 -m venv venv
source venv/bin/activate
```

### 4.2 Install dependencies

```bash
pip install -r requirements.txt
```

## 5. Running the Server

```bash
uvicorn main:app --reload
```

The backend will be available at:

- API root: http://127.0.0.1:8000
- Swagger UI (interactive docs): **http://127.0.0.1:8000/docs**
- ReDoc: http://127.0.0.1:8000/redoc

## 6. CORS

CORS is configured to allow a local React dev server to call this API
during development, including:

- `http://localhost:5173` / `http://127.0.0.1:5173` (Vite default)
- `http://localhost:3000` / `http://127.0.0.1:3000` (CRA default)

Adjust `allow_origins` in `main.py` before deploying anywhere else.

## 7. API Endpoints

| Method | Path                  | Purpose                                   |
|--------|-----------------------|--------------------------------------------|
| GET    | `/`                    | Root health message                       |
| GET    | `/health`              | Health check                              |
| GET    | `/schemes`             | List all demo schemes                     |
| GET    | `/schemes/{scheme_id}` | Get a single scheme (404 if not found)    |
| POST   | `/recommend`           | Get a rule-based scheme recommendation    |
| POST   | `/calculate-emi`       | Calculate EMI (reducing balance method)   |
| GET    | `/partners`            | List all demo channel partners            |
| POST   | `/partners/nearby`     | Find nearby active partners (Haversine)   |

## 8. Example Requests & Responses

### 8.1 `POST /recommend`

Request:

```json
{
    "income": 300000,
    "project_cost": 100000,
    "project_type": "business",
    "education_status": "not_applicable"
}
```

Response (200):

```json
{
    "eligible": true,
    "scheme_name": "Micro Finance Scheme",
    "reason": "Your annual income (Rs. 300,000) is within the income limit of Rs. 500,000, and your business project cost (Rs. 100,000) falls within the maximum amount of Rs. 140,000 supported by the Micro Finance Scheme.",
    "interest_rate": 6.5,
    "maximum_amount": 140000.0,
    "moratorium_months": 3,
    "confidence": 0.7,
    "alternatives": [
        {
            "scheme_name": "Term Loan",
            "interest_rate": 7.0,
            "maximum_amount": 5000000.0,
            "moratorium_months": 6,
            "reason": "..."
        }
    ]
}
```

`project_type` must be one of: `business`, `education`, `other`.
`education_status` must be one of: `student`, `completed`,
`not_applicable`. Invalid values return **422** with a clear message.

### 8.2 `POST /calculate-emi`

Request:

```json
{
    "principal": 100000,
    "annual_interest_rate": 6.5,
    "tenure_months": 60,
    "moratorium_months": 3
}
```

Response (200):

```json
{
    "principal": 100000.0,
    "annual_interest_rate": 6.5,
    "tenure_months": 60,
    "moratorium_months": 3,
    "repayment_months": 57,
    "monthly_emi": 2043.84,
    "total_payment": 116499.08,
    "total_interest": 16499.08,
    "moratorium_note": "No repayments are made during the first 3 month(s) (moratorium period). No interest is capitalised onto the principal during this period in this simplified MVP model. EMI is calculated over the remaining 57 repayment month(s)."
}
```

**Moratorium handling (MVP simplification):** during the moratorium
period, no repayments are made and no interest is capitalised onto the
principal. The EMI is then calculated over the remaining
`tenure_months - moratorium_months` using the standard reducing-balance
formula. This is a deliberate simplification for the prototype and does
not represent real bank capitalisation rules.

`moratorium_months` must be strictly less than `tenure_months`,
otherwise a **422** validation error is returned.

### 8.3 `POST /partners/nearby`

Request:

```json
{
    "latitude": 28.6139,
    "longitude": 77.2090,
    "radius_km": 50
}
```

Response (200):

```json
{
    "user_location": { "latitude": 28.6139, "longitude": 77.209 },
    "radius_km": 50.0,
    "partners": [
        {
            "id": 1,
            "name": "Delhi Public Sector Bank Branch",
            "type": "PSB",
            "city": "Delhi",
            "state": "Delhi",
            "distance_km": 0.0,
            "supported_schemes": ["Micro Finance Scheme", "Term Loan"],
            "active": true
        }
    ]
}
```

Only **active** partners are returned, sorted by ascending distance.
`latitude` must be in `[-90, 90]`, `longitude` in `[-180, 180]`, and
`radius_km` must be greater than 0 — otherwise a **422** is returned.

## 9. Error Handling

- `404` — scheme not found (`GET /schemes/{scheme_id}`)
- `422` — Pydantic validation errors (invalid/missing fields, out-of-range values)
- `400` — used where a request is structurally valid but logically
  impossible to compute (e.g. an EMI request that leaves 0 repayment months)

No internal stack traces are exposed to API clients.

## 10. Known Limitations (MVP)

- Scheme and partner data are **in-memory demo data**, not connected to
  a database or any official government data source.
- The recommendation engine is fully **rule-based**; no ML/LLM is used.
- The EMI moratorium model is a simplified "repayment holiday, no
  capitalisation" approach, not a real banking calculation.
- No authentication or authorization is implemented (out of scope for
  this MVP per project requirements).
- Data resets every time the server restarts (nothing is persisted).