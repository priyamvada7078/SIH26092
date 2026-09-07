"""
SIH26092 - AI-Driven Scheme Matching for Marginalized Entrepreneurs
Ministry of Social Justice and Empowerment (MoSJE)

Backend MVP built with FastAPI.

IMPORTANT (Prototype Notice):
All scheme data and channel partner data in this file are DEMO /
PROTOTYPE data created for the Smart India Hackathon 2026 submission.
They are NOT verified against official government documents and must
NOT be presented as live, authoritative, or currently-in-force data.

This backend intentionally avoids a database, authentication, and any
external AI API. Recommendations are produced using a transparent,
rule-based scoring engine so that every decision can be explained in
plain language (no machine learning / no LLM is used here).
"""

import math
from typing import List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator

# --------------------------------------------------------------------------
# FASTAPI APP SETUP
# --------------------------------------------------------------------------

app = FastAPI(
    title="SIH26092 - Smart Scheme Matching Backend",
    description=(
        "Prototype backend for AI-Driven Scheme Matching for Marginalized "
        "Entrepreneurs (Ministry of Social Justice and Empowerment). "
        "Provides a rule-based scheme recommender, an EMI calculator, and "
        "a geo-spatial channel partner locator. All scheme and partner "
        "data are DEMO data for hackathon purposes only."
    ),
    version="1.0.0",
)

# Allow the local React dev server to call this API during development.
# NOTE: allow_origins is kept broad-but-reasonable for hackathon/dev use.
# Tighten this list before any production deployment.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://sih26092-frontend.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------------------------------
# DEMO DATA: SCHEMES
# --------------------------------------------------------------------------
# These figures are approximate and based on the general structure
# described in problem statement SIH26092. They are DEMO values for the
# prototype only and must be replaced with verified figures from official
# scheme documentation before any real-world use.

SCHEMES = [
    {
        "id": 1,
        "name": "Micro Finance Scheme",
        "description": (
            "Small-ticket loans intended for micro-entrepreneurs and "
            "small business/self-employment projects run by individuals "
            "from marginalized communities."
        ),
        "max_amount": 140000,
        "interest_rate": 6.5,
        "moratorium_months": 3,
        "income_limit": 500000,
        "project_types": ["business", "other"],
        "education_required": None,
    },
    {
        "id": 2,
        "name": "Term Loan",
        "description": (
            "Larger loans for setting up or expanding a business/"
            "self-employment project that needs more capital than the "
            "Micro Finance Scheme allows."
        ),
        "max_amount": 5000000,
        "interest_rate": 7.0,
        "moratorium_months": 6,
        "income_limit": 500000,
        "project_types": ["business", "other"],
        "education_required": None,
    },
    {
        "id": 3,
        "name": "Educational Loan",
        "description": (
            "Concessional loan to support education-related expenses "
            "(tuition, books, and related costs) for students or those "
            "who have recently completed a course."
        ),
        "max_amount": 2000000,
        "interest_rate": 4.0,
        "moratorium_months": 12,
        "income_limit": 500000,
        "project_types": ["education"],
        "education_required": ["student", "completed"],
    },
]


# --------------------------------------------------------------------------
# DEMO DATA: CHANNEL PARTNERS
# --------------------------------------------------------------------------
# These are fictional DEMO partners spread across Indian cities, created
# only to demonstrate the geo-spatial locator feature. They are NOT a
# real or currently-authorized list of channel partners.

PARTNERS = [
    {
        "id": 1,
        "name": "Delhi Public Sector Bank Branch",
        "type": "PSB",
        "latitude": 28.6139,
        "longitude": 77.2090,
        "city": "Delhi",
        "state": "Delhi",
        "supported_schemes": ["Micro Finance Scheme", "Term Loan"],
        "active": True,
    },
    {
        "id": 2,
        "name": "Ghaziabad Regional Rural Bank",
        "type": "RRB",
        "latitude": 28.6692,
        "longitude": 77.4538,
        "city": "Ghaziabad",
        "state": "Uttar Pradesh",
        "supported_schemes": ["Micro Finance Scheme", "Educational Loan"],
        "active": True,
    },
    {
        "id": 3,
        "name": "Mumbai State Channelising Agency",
        "type": "SCA",
        "latitude": 19.0760,
        "longitude": 72.8777,
        "city": "Mumbai",
        "state": "Maharashtra",
        "supported_schemes": ["Term Loan", "Educational Loan"],
        "active": True,
    },
    {
        "id": 4,
        "name": "Bengaluru NBFC-MFI Partner",
        "type": "NBFC-MFI",
        "latitude": 12.9716,
        "longitude": 77.5946,
        "city": "Bengaluru",
        "state": "Karnataka",
        "supported_schemes": ["Micro Finance Scheme"],
        "active": True,
    },
    {
        "id": 5,
        "name": "Chennai Public Sector Bank Branch",
        "type": "PSB",
        "latitude": 13.0827,
        "longitude": 80.2707,
        "city": "Chennai",
        "state": "Tamil Nadu",
        "supported_schemes": ["Micro Finance Scheme", "Term Loan", "Educational Loan"],
        "active": True,
    },
    {
        "id": 6,
        "name": "Kolkata Regional Rural Bank",
        "type": "RRB",
        "latitude": 22.5726,
        "longitude": 88.3639,
        "city": "Kolkata",
        "state": "West Bengal",
        "supported_schemes": ["Micro Finance Scheme", "Educational Loan"],
        "active": True,
    },
    {
        "id": 7,
        "name": "Jaipur State Channelising Agency",
        "type": "SCA",
        "latitude": 26.9124,
        "longitude": 75.7873,
        "city": "Jaipur",
        "state": "Rajasthan",
        "supported_schemes": ["Term Loan"],
        "active": True,
    },
    {
        "id": 8,
        "name": "Lucknow NBFC-MFI Partner",
        "type": "NBFC-MFI",
        "latitude": 26.8467,
        "longitude": 80.9462,
        "city": "Lucknow",
        "state": "Uttar Pradesh",
        "supported_schemes": ["Micro Finance Scheme", "Term Loan"],
        "active": True,
    },
    {
        "id": 9,
        "name": "Noida Public Sector Bank Branch (Inactive Demo)",
        "type": "PSB",
        "latitude": 28.5355,
        "longitude": 77.3910,
        "city": "Noida",
        "state": "Uttar Pradesh",
        "supported_schemes": ["Micro Finance Scheme"],
        # Intentionally inactive so the /partners/nearby test can verify
        # that inactive partners are excluded from results.
        "active": False,
    },
]


# --------------------------------------------------------------------------
# PYDANTIC MODELS
# --------------------------------------------------------------------------

class SchemeResponse(BaseModel):
    id: int
    name: str
    description: str
    max_amount: float
    interest_rate: float
    moratorium_months: int
    income_limit: float
    project_types: List[str]
    education_required: Optional[List[str]] = None


class SchemesListResponse(BaseModel):
    schemes: List[SchemeResponse]


class PartnerResponse(BaseModel):
    id: int
    name: str
    type: str
    latitude: float
    longitude: float
    city: str
    state: str
    supported_schemes: List[str]
    active: bool


class PartnersListResponse(BaseModel):
    partners: List[PartnerResponse]


class RecommendationRequest(BaseModel):
    income: float = Field(..., gt=0, description="Applicant's annual family income in INR")
    project_cost: float = Field(..., gt=0, description="Estimated cost of the project/loan requirement in INR")
    project_type: str = Field(..., description="One of: business, education, other")
    education_status: str = Field(..., description="One of: student, completed, not_applicable")

    @field_validator("project_type")
    @classmethod
    def validate_project_type(cls, value: str) -> str:
        allowed = {"business", "education", "other"}
        if value not in allowed:
            raise ValueError(f"project_type must be one of {sorted(allowed)}")
        return value

    @field_validator("education_status")
    @classmethod
    def validate_education_status(cls, value: str) -> str:
        allowed = {"student", "completed", "not_applicable"}
        if value not in allowed:
            raise ValueError(f"education_status must be one of {sorted(allowed)}")
        return value


class AlternativeScheme(BaseModel):
    scheme_name: str
    interest_rate: float
    maximum_amount: float
    moratorium_months: int
    reason: str


class RecommendationResponse(BaseModel):
    eligible: bool
    scheme_name: Optional[str] = None
    reason: str
    interest_rate: Optional[float] = None
    maximum_amount: Optional[float] = None
    moratorium_months: Optional[int] = None
    confidence: Optional[float] = None
    alternatives: List[AlternativeScheme] = []


class EMIRequest(BaseModel):
    principal: float = Field(..., gt=0, description="Loan principal amount in INR")
    annual_interest_rate: float = Field(..., ge=0, description="Annual interest rate in percent, e.g. 6.5")
    tenure_months: int = Field(..., gt=0, description="Total loan tenure in months")
    moratorium_months: int = Field(..., ge=0, description="Number of months with no repayment at the start of the loan")

    @field_validator("moratorium_months")
    @classmethod
    def moratorium_not_exceeding_tenure(cls, value: int, info):
        tenure = info.data.get("tenure_months")
        if tenure is not None and value >= tenure:
            raise ValueError("moratorium_months must be less than tenure_months")
        return value


class EMIResponse(BaseModel):
    principal: float
    annual_interest_rate: float
    tenure_months: int
    moratorium_months: int
    repayment_months: int
    monthly_emi: float
    total_payment: float
    total_interest: float
    moratorium_note: str


class NearbyPartnerRequest(BaseModel):
    latitude: float = Field(..., ge=-90, le=90, description="User's latitude")
    longitude: float = Field(..., ge=-180, le=180, description="User's longitude")
    radius_km: float = Field(..., gt=0, description="Search radius in kilometers")


class NearbyPartnerResult(BaseModel):
    id: int
    name: str
    type: str
    city: str
    state: str
    distance_km: float
    supported_schemes: List[str]
    active: bool


class UserLocation(BaseModel):
    latitude: float
    longitude: float


class NearbyPartnerResponse(BaseModel):
    user_location: UserLocation
    radius_km: float
    partners: List[NearbyPartnerResult]


# --------------------------------------------------------------------------
# ROOT / HEALTH
# --------------------------------------------------------------------------

@app.get("/", summary="Root health message", description="Basic check that confirms the backend is running.")
def read_root():
    return {"message": "SIH26092 Backend is running"}


@app.get("/health", summary="Health check", description="Simple health check endpoint for monitoring/uptime checks.")
def health_check():
    return {"status": "healthy"}


# --------------------------------------------------------------------------
# SCHEMES
# --------------------------------------------------------------------------

@app.get(
    "/schemes",
    response_model=SchemesListResponse,
    summary="List all schemes",
    description="Returns all DEMO/PROTOTYPE schemes available in this backend.",
)
def get_schemes():
    return {"schemes": SCHEMES}


@app.get(
    "/schemes/{scheme_id}",
    response_model=SchemeResponse,
    summary="Get a single scheme by ID",
    description="Returns one DEMO/PROTOTYPE scheme. Returns 404 if the scheme id does not exist.",
)
def get_scheme(scheme_id: int):
    for scheme in SCHEMES:
        if scheme["id"] == scheme_id:
            return scheme
    raise HTTPException(status_code=404, detail=f"Scheme with id {scheme_id} not found")


# --------------------------------------------------------------------------
# RECOMMENDATION ENGINE (RULE-BASED, EXPLAINABLE)
# --------------------------------------------------------------------------

def check_eligibility(scheme: dict, request: RecommendationRequest) -> Optional[str]:
    """
    Checks whether a single scheme is eligible for the given request.
    Returns None if eligible, or a short string explaining why it is
    NOT eligible.
    """
    if request.income > scheme["income_limit"]:
        return (
            f"Your annual income (Rs. {request.income:,.0f}) exceeds the "
            f"income limit of Rs. {scheme['income_limit']:,.0f} for this scheme."
        )

    if request.project_type not in scheme["project_types"]:
        return (
            f"This scheme does not support project type '{request.project_type}'."
        )

    if request.project_cost > scheme["max_amount"]:
        return (
            f"Your project cost (Rs. {request.project_cost:,.0f}) exceeds the "
            f"maximum amount of Rs. {scheme['max_amount']:,.0f} supported by this scheme."
        )

    if scheme["education_required"] is not None:
        if request.education_status not in scheme["education_required"]:
            allowed = " or ".join(scheme["education_required"])
            return (
                f"This scheme requires education status to be '{allowed}', "
                f"but '{request.education_status}' was provided."
            )

    return None  # eligible


def score_scheme(scheme: dict, request: RecommendationRequest) -> float:
    """
    Produces a simple, explainable 0-1 score for an ELIGIBLE scheme.
    Higher is better. The scoring logic is intentionally transparent
    (no ML/LLM):

      - 40%: how comfortably the project cost fits under the scheme's
             max amount (closer utilisation without exceeding it is
             considered a stronger fit, but leaving some headroom is
             also rewarded slightly)
      - 30%: lower interest rate is better (relative to the schemes in
             the dataset)
      - 20%: longer moratorium is better (more breathing room before
             repayment starts)
      - 10%: income headroom under the income limit
    """
    all_rates = [s["interest_rate"] for s in SCHEMES]
    all_moratoriums = [s["moratorium_months"] for s in SCHEMES]

    # Cost-fit: how much of the scheme's capacity is used (0-1), reward
    # requests that comfortably fit (not right at the very edge).
    utilisation = request.project_cost / scheme["max_amount"]
    cost_fit_score = max(0.0, 1.0 - abs(utilisation - 0.5))  # best around 50% utilisation

    # Interest rate score: lower rate relative to min/max in dataset = better
    min_rate, max_rate = min(all_rates), max(all_rates)
    if max_rate == min_rate:
        rate_score = 1.0
    else:
        rate_score = 1.0 - ((scheme["interest_rate"] - min_rate) / (max_rate - min_rate))

    # Moratorium score: longer relative to dataset = better
    min_mor, max_mor = min(all_moratoriums), max(all_moratoriums)
    if max_mor == min_mor:
        moratorium_score = 1.0
    else:
        moratorium_score = (scheme["moratorium_months"] - min_mor) / (max_mor - min_mor)

    # Income headroom score
    income_score = max(0.0, 1.0 - (request.income / scheme["income_limit"]))

    total_score = (
        0.40 * cost_fit_score
        + 0.30 * rate_score
        + 0.20 * moratorium_score
        + 0.10 * income_score
    )
    return round(total_score, 4)


def build_reason(scheme: dict, request: RecommendationRequest) -> str:
    return (
        f"Your annual income (Rs. {request.income:,.0f}) is within the income limit "
        f"of Rs. {scheme['income_limit']:,.0f}, and your {request.project_type} project cost "
        f"(Rs. {request.project_cost:,.0f}) falls within the maximum amount of "
        f"Rs. {scheme['max_amount']:,.0f} supported by the {scheme['name']}."
    )


@app.post(
    "/recommend",
    response_model=RecommendationResponse,
    summary="Get a rule-based scheme recommendation",
    description=(
        "Runs a transparent, rule-based (non-ML) engine over the DEMO scheme "
        "dataset and returns the best-fit eligible scheme with an explainable "
        "reason, plus any eligible alternatives."
    ),
)
def recommend_scheme(request: RecommendationRequest):
    eligible_schemes = []
    ineligibility_reasons = []

    for scheme in SCHEMES:
        reason = check_eligibility(scheme, request)
        if reason is None:
            score = score_scheme(scheme, request)
            eligible_schemes.append((scheme, score))
        else:
            ineligibility_reasons.append(f"{scheme['name']}: {reason}")

    if not eligible_schemes:
        return RecommendationResponse(
            eligible=False,
            reason=(
                "No scheme currently matches your inputs. "
                + " ".join(ineligibility_reasons)
            ),
            alternatives=[],
        )

    # Sort by score descending; the best scheme is the top pick.
    eligible_schemes.sort(key=lambda pair: pair[1], reverse=True)
    best_scheme, best_score = eligible_schemes[0]

    alternatives = [
        AlternativeScheme(
            scheme_name=scheme["name"],
            interest_rate=scheme["interest_rate"],
            maximum_amount=scheme["max_amount"],
            moratorium_months=scheme["moratorium_months"],
            reason=build_reason(scheme, request),
        )
        for scheme, _score in eligible_schemes[1:]
    ]

    return RecommendationResponse(
        eligible=True,
        scheme_name=best_scheme["name"],
        reason=build_reason(best_scheme, request),
        interest_rate=best_scheme["interest_rate"],
        maximum_amount=best_scheme["max_amount"],
        moratorium_months=best_scheme["moratorium_months"],
        confidence=round(min(0.99, 0.5 + best_score / 2), 2),
        alternatives=alternatives,
    )


# --------------------------------------------------------------------------
# EMI CALCULATOR
# --------------------------------------------------------------------------
# MORATORIUM HANDLING (MVP / simplified, documented clearly):
# During the moratorium period, the borrower makes NO repayments and, for
# this simplified prototype, NO additional interest is added to the
# principal during that period (i.e. moratorium is treated as a pure
# repayment holiday, not as interest capitalisation). The EMI itself is
# then calculated using the standard reducing-balance formula over the
# REMAINING months only (tenure_months - moratorium_months). This is a
# deliberate simplification for the hackathon MVP and does not reflect
# real bank capitalisation rules, which typically add accrued interest
# to the principal at the end of the moratorium.

@app.post(
    "/calculate-emi",
    response_model=EMIResponse,
    summary="Calculate EMI using the reducing balance method",
    description=(
        "Calculates monthly EMI, total payment, and total interest using the "
        "standard reducing-balance formula. Moratorium months are treated as "
        "a repayment holiday with no interest capitalisation (see moratorium_note "
        "in the response for details)."
    ),
)
def calculate_emi(request: EMIRequest):
    principal = request.principal
    annual_rate = request.annual_interest_rate
    tenure_months = request.tenure_months
    moratorium_months = request.moratorium_months

    repayment_months = tenure_months - moratorium_months
    if repayment_months <= 0:
        raise HTTPException(
            status_code=400,
            detail="moratorium_months must be less than tenure_months so that at least one repayment month remains.",
        )

    monthly_rate = annual_rate / 12 / 100

    if monthly_rate == 0:
        # Zero-interest case: simple equal division of principal.
        monthly_emi = principal / repayment_months
    else:
        n = repayment_months
        r = monthly_rate
        monthly_emi = principal * r * ((1 + r) ** n) / (((1 + r) ** n) - 1)

    total_payment = monthly_emi * repayment_months
    total_interest = total_payment - principal

    moratorium_note = (
        f"No repayments are made during the first {moratorium_months} month(s) "
        f"(moratorium period). No interest is capitalised onto the principal during "
        f"this period in this simplified MVP model. EMI is calculated over the "
        f"remaining {repayment_months} repayment month(s)."
        if moratorium_months > 0
        else "No moratorium was applied; EMI is calculated over the full tenure."
    )

    return EMIResponse(
        principal=round(principal, 2),
        annual_interest_rate=annual_rate,
        tenure_months=tenure_months,
        moratorium_months=moratorium_months,
        repayment_months=repayment_months,
        monthly_emi=round(monthly_emi, 2),
        total_payment=round(total_payment, 2),
        total_interest=round(total_interest, 2),
        moratorium_note=moratorium_note,
    )


# --------------------------------------------------------------------------
# CHANNEL PARTNERS
# --------------------------------------------------------------------------

@app.get(
    "/partners",
    response_model=PartnersListResponse,
    summary="List all channel partners",
    description="Returns all DEMO/PROTOTYPE channel partners (not verified real-world data).",
)
def get_partners():
    return {"partners": PARTNERS}


def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculates the great-circle distance between two points on Earth
    (specified in decimal degrees) using the Haversine formula.
    """
    earth_radius_km = 6371.0

    lat1_rad, lon1_rad = math.radians(lat1), math.radians(lon1)
    lat2_rad, lon2_rad = math.radians(lat2), math.radians(lon2)

    delta_lat = lat2_rad - lat1_rad
    delta_lon = lon2_rad - lon1_rad

    a = (
        math.sin(delta_lat / 2) ** 2
        + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lon / 2) ** 2
    )
    c = 2 * math.asin(math.sqrt(a))

    return earth_radius_km * c


@app.post(
    "/partners/nearby",
    response_model=NearbyPartnerResponse,
    summary="Find nearby active channel partners",
    description=(
        "Uses the Haversine formula (calculated locally, no external maps API) "
        "to find active DEMO channel partners within the given radius, sorted "
        "by nearest distance first."
    ),
)
def find_nearby_partners(request: NearbyPartnerRequest):
    results = []

    for partner in PARTNERS:
        if not partner["active"]:
            continue

        distance = haversine_distance_km(
            request.latitude, request.longitude,
            partner["latitude"], partner["longitude"],
        )

        if distance <= request.radius_km:
            results.append(
                NearbyPartnerResult(
                    id=partner["id"],
                    name=partner["name"],
                    type=partner["type"],
                    city=partner["city"],
                    state=partner["state"],
                    distance_km=round(distance, 2),
                    supported_schemes=partner["supported_schemes"],
                    active=partner["active"],
                )
            )

    results.sort(key=lambda p: p.distance_km)

    return NearbyPartnerResponse(
        user_location=UserLocation(latitude=request.latitude, longitude=request.longitude),
        radius_km=request.radius_km,
        partners=results,
    )
