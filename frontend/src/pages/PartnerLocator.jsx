import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Navigation,
  Compass,
  Building,
  AlertCircle,
  HelpCircle,
  Sparkles,
  RefreshCw,
  Search,
  Filter,
} from 'lucide-react';
import { findNearbyPartners, getPartners } from '../services/api';
import PartnerCard from '../components/PartnerCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const CITY_PRESETS = [
  { name: 'New Delhi (NCR)', lat: 28.6139, lon: 77.209, radius: 50 },
  { name: 'Mumbai (MH)', lat: 19.076, lon: 72.8777, radius: 100 },
  { name: 'Bengaluru (KA)', lat: 12.9716, lon: 77.5946, radius: 100 },
  { name: 'Chennai (TN)', lat: 13.0827, lon: 80.2707, radius: 100 },
  { name: 'Kolkata (WB)', lat: 22.5726, lon: 88.3639, radius: 100 },
  { name: 'Jaipur (RJ)', lat: 26.9124, lon: 75.7873, radius: 100 },
  { name: 'Lucknow (UP)', lat: 26.8467, lon: 80.9462, radius: 100 },
];

export default function PartnerLocator() {
  const [coords, setCoords] = useState({
    latitude: '28.6139',
    longitude: '77.2090',
    radius_km: '50',
  });

  const [geoLocating, setGeoLocating] = useState(false);
  const [geoMsg, setGeoMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [nearbyResults, setNearbyResults] = useState(null);
  const [allPartners, setAllPartners] = useState([]);
  const [viewAllMode, setViewAllMode] = useState(false);

  // Handle Search
  const handleSearch = async (e) => {
    if (e) e.preventDefault();

    const lat = Number(coords.latitude);
    const lon = Number(coords.longitude);
    const rad = Number(coords.radius_km);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      setApiError('Latitude must be between -90 and 90 degrees.');
      return;
    }
    if (isNaN(lon) || lon < -180 || lon > 180) {
      setApiError('Longitude must be between -180 and 180 degrees.');
      return;
    }
    if (isNaN(rad) || rad <= 0) {
      setApiError('Search radius must be greater than 0 km.');
      return;
    }

    try {
      setLoading(true);
      setApiError(null);
      setViewAllMode(false);
      const res = await findNearbyPartners({
        latitude: lat,
        longitude: lon,
        radius_km: rad,
      });
      setNearbyResults(res);
    } catch (err) {
      setApiError(err.message || 'Failed to locate nearby partners.');
    } finally {
      setLoading(false);
    }
  };

  // Browser Geolocation
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setGeoMsg({ type: 'warning', text: 'Geolocation is not supported by your browser. Please enter coordinates manually.' });
      return;
    }

    setGeoLocating(true);
    setGeoMsg(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(4),
          longitude: position.coords.longitude.toFixed(4),
        }));
        setGeoLocating(false);
        setGeoMsg({ type: 'success', text: 'Location detected successfully!' });
      },
      (error) => {
        setGeoLocating(false);
        let msg = 'Unable to retrieve your location. You can enter latitude/longitude manually.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location access was denied. Please enter coordinates manually or choose a city preset below.';
        }
        setGeoMsg({ type: 'warning', text: msg });
      },
      { timeout: 8000, enableHighAccuracy: false }
    );
  };

  // Preset Selector
  const applyCityPreset = (city) => {
    setCoords({
      latitude: String(city.lat),
      longitude: String(city.lon),
      radius_km: String(city.radius),
    });
    setGeoMsg(null);
    setApiError(null);
  };

  // Fetch all partners
  const handleViewAll = async () => {
    try {
      setLoading(true);
      setApiError(null);
      setViewAllMode(true);
      const data = await getPartners();
      setAllPartners(data);
    } catch (err) {
      setApiError(err.message || 'Unable to fetch partners list.');
    } finally {
      setLoading(false);
    }
  };

  // Search on initial mount
  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <span className="badge badge-teal" style={{ marginBottom: '0.5rem' }}>
            Geo-Spatial Haversine Locator
          </span>
          <h1 className="page-header-title">Find a Channel Partner</h1>
          <p className="page-header-subtitle">
            Locate authorized Public Sector Banks, Regional Rural Banks, and State Channelising Agencies near you to submit your loan application.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="container" style={{ paddingBottom: '4rem' }}>
        {/* City Presets Bar */}
        <div
          style={{
            backgroundColor: 'var(--white)',
            border: '1px solid var(--slate-200)',
            borderRadius: 'var(--radius-lg)',
            padding: '1rem 1.25rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--slate-700)', fontWeight: 600 }}>
            <MapPin size={16} color="var(--primary-600)" />
            <span>Select Demo City Coordinates:</span>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {CITY_PRESETS.map((city) => (
              <button
                key={city.name}
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => applyCityPreset(city)}
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>

        {/* Layout */}
        <div className="partner-locator-layout">
          {/* Search Form Sidebar */}
          <div className="card">
            <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <Compass size={20} color="var(--primary-700)" /> Search Location
            </h2>

            {/* Geolocation Button */}
            <button
              type="button"
              className="btn btn-secondary btn-block"
              onClick={handleUseMyLocation}
              disabled={geoLocating}
              style={{ marginBottom: '1rem' }}
            >
              <Navigation size={16} color="var(--primary-600)" />
              {geoLocating ? 'Detecting Location...' : 'Use My Current Location'}
            </button>

            {geoMsg && (
              <div
                className={`alert alert-${geoMsg.type}`}
                style={{ padding: '0.65rem 0.85rem', fontSize: '0.8125rem', marginBottom: '1.25rem' }}
              >
                {geoMsg.text}
              </div>
            )}

            <form onSubmit={handleSearch}>
              {/* Latitude */}
              <div className="form-group">
                <label className="form-label" htmlFor="latitude">
                  Latitude
                </label>
                <input
                  type="number"
                  id="latitude"
                  name="latitude"
                  className="form-control"
                  placeholder="e.g. 28.6139"
                  value={coords.latitude}
                  onChange={(e) => setCoords({ ...coords, latitude: e.target.value })}
                  step="0.0001"
                  required
                />
                <div className="form-hint">Decimal degrees (-90 to 90)</div>
              </div>

              {/* Longitude */}
              <div className="form-group">
                <label className="form-label" htmlFor="longitude">
                  Longitude
                </label>
                <input
                  type="number"
                  id="longitude"
                  name="longitude"
                  className="form-control"
                  placeholder="e.g. 77.2090"
                  value={coords.longitude}
                  onChange={(e) => setCoords({ ...coords, longitude: e.target.value })}
                  step="0.0001"
                  required
                />
                <div className="form-hint">Decimal degrees (-180 to 180)</div>
              </div>

              {/* Radius */}
              <div className="form-group">
                <label className="form-label" htmlFor="radius_km">
                  Search Radius (km)
                </label>
                <select
                  id="radius_km"
                  name="radius_km"
                  className="form-control"
                  value={coords.radius_km}
                  onChange={(e) => setCoords({ ...coords, radius_km: e.target.value })}
                >
                  <option value="25">Within 25 km</option>
                  <option value="50">Within 50 km</option>
                  <option value="100">Within 100 km</option>
                  <option value="250">Within 250 km</option>
                  <option value="500">Within 500 km</option>
                  <option value="1500">Within 1500 km (Pan-India)</option>
                </select>
              </div>

              {/* Submit Buttons */}
              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading}
                style={{ marginTop: '0.5rem' }}
              >
                {loading ? <LoadingSpinner size="sm" /> : <Search size={16} />} Find Nearby Partners
              </button>

              <button
                type="button"
                className="btn btn-outline btn-block btn-sm"
                onClick={handleViewAll}
                style={{ marginTop: '0.75rem' }}
              >
                <Building size={14} /> View All Partners ({allPartners.length || 'All'})
              </button>
            </form>
          </div>

          {/* Results Side */}
          <div className="partners-results-container">
            {apiError && <ErrorMessage message={apiError} onRetry={handleSearch} />}

            {loading && <LoadingSpinner message="Calculating nearest partner branches via Haversine distance..." />}

            {/* Nearby Mode Results */}
            {!loading && !viewAllMode && nearbyResults && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--slate-900)' }}>
                    Nearby Partners Found ({nearbyResults.partners.length})
                  </h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
                    Within {nearbyResults.radius_km} km of ({nearbyResults.user_location.latitude}, {nearbyResults.user_location.longitude})
                  </span>
                </div>

                {nearbyResults.partners.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {nearbyResults.partners.map((partner) => (
                      <PartnerCard key={partner.id} partner={partner} />
                    ))}
                  </div>
                ) : (
                  <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                    <MapPin size={40} color="var(--slate-400)" style={{ margin: '0 auto 1rem' }} />
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--slate-800)', marginBottom: '0.5rem' }}>
                      No Partners Found Within {coords.radius_km} km
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)', maxWidth: '420px', margin: '0 auto 1.25rem' }}>
                      Try expanding your search radius (e.g. 250 km or 500 km) or selecting one of the demo city coordinates above.
                    </p>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setCoords((prev) => ({ ...prev, radius_km: '500' }));
                        handleSearch();
                      }}
                    >
                      Expand Radius to 500 km
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* View All Mode Results */}
            {!loading && viewAllMode && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--slate-900)' }}>
                    All Authorized Channel Partners ({allPartners.length})
                  </h3>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleSearch()}
                  >
                    Back to Nearby Filter
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {allPartners.map((partner) => (
                    <PartnerCard key={partner.id} partner={partner} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
