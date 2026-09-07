/**
 * API Service for SchemeSaathi (SIH26092)
 * Centralized API client connecting to FastAPI Backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

class ApiError extends Error {
  constructor(message, status = null, details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

/**
 * Generic request helper with error handling
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    let data = null;

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = text ? { message: text } : null;
    }

    if (!response.ok) {
      // Format backend error detail
      let errorMessage = 'An unexpected error occurred while processing your request.';

      if (data && data.detail) {
        if (Array.isArray(data.detail)) {
          // FastAPI 422 validation errors array
          errorMessage = data.detail
            .map((err) => {
              const field = err.loc ? err.loc[err.loc.length - 1] : 'Field';
              return `${field}: ${err.msg}`;
            })
            .join(', ');
        } else if (typeof data.detail === 'string') {
          errorMessage = data.detail;
        }
      } else if (data && data.message) {
        errorMessage = data.message;
      }

      throw new ApiError(errorMessage, response.status, data);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Network / server connection error
    if (error.name === 'TypeError' || error.message.includes('Failed to fetch')) {
      throw new ApiError(
        'Unable to connect to the backend. Please make sure the FastAPI server is running at http://127.0.0.1:8000.',
        0,
        { original: error.message }
      );
    }

    throw new ApiError(error.message || 'Network request failed', 0, { original: error.message });
  }
}

/**
 * Health check
 */
export async function checkHealth() {
  return request('/health');
}

/**
 * Fetch all available schemes
 */
export async function getSchemes() {
  const data = await request('/schemes');
  return data.schemes || [];
}

/**
 * Fetch a single scheme by ID
 */
export async function getScheme(id) {
  return request(`/schemes/${id}`);
}

/**
 * Get rule-based scheme recommendation
 * @param {Object} data { income, project_cost, project_type, education_status }
 */
export async function recommendScheme(data) {
  const payload = {
    income: Number(data.income),
    project_cost: Number(data.project_cost),
    project_type: data.project_type,
    education_status: data.education_status,
  };
  return request('/recommend', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Calculate reducing balance EMI
 * @param {Object} data { principal, annual_interest_rate, tenure_months, moratorium_months }
 */
export async function calculateEMI(data) {
  const payload = {
    principal: Number(data.principal),
    annual_interest_rate: Number(data.annual_interest_rate),
    tenure_months: Number(data.tenure_months),
    moratorium_months: Number(data.moratorium_months),
  };
  return request('/calculate-emi', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Fetch all channel partners
 */
export async function getPartners() {
  const data = await request('/partners');
  return data.partners || [];
}

/**
 * Find nearby channel partners by lat/lon & radius
 * @param {Object} data { latitude, longitude, radius_km }
 */
export async function findNearbyPartners(data) {
  const payload = {
    latitude: Number(data.latitude),
    longitude: Number(data.longitude),
    radius_km: Number(data.radius_km),
  };
  return request('/partners/nearby', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export { API_BASE_URL };
