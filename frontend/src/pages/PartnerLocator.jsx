/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  MapPin,
  Navigation,
  Compass,
  Building,
  Search,
} from 'lucide-react';
import { findNearbyPartners, getPartners, getSchemes } from '../services/api';
import PartnerCard from '../components/PartnerCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useLanguage } from '../i18n/LanguageContext';

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
  const location = useLocation();
  const { t } = useLanguage();
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
  const [schemes, setSchemes] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState(location.state?.scheme_name || '');
  const [viewAllMode, setViewAllMode] = useState(false);

  // Handle Search
  const handleSearch = async (e) => {
    if (e) e.preventDefault();

    const lat = Number(coords.latitude);
    const lon = Number(coords.longitude);
    const rad = Number(coords.radius_km);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      setApiError(t('partners.errors.latitude'));
      return;
    }
    if (isNaN(lon) || lon < -180 || lon > 180) {
      setApiError(t('partners.errors.longitude'));
      return;
    }
    if (isNaN(rad) || rad <= 0) {
      setApiError(t('partners.errors.radius'));
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
        scheme_name: selectedScheme,
      });
      setNearbyResults(res);
    } catch (err) {
      setApiError(err.message || t('partners.errors.fallback'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function loadSchemes() {
      try {
        const data = await getSchemes();
        setSchemes(data);
      } catch {
        setSchemes([]);
      }
    }

    loadSchemes();
  }, []);

  // Browser Geolocation
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setGeoMsg({ type: 'warning', text: t('partners.geoUnsupported') });
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
        setGeoMsg({ type: 'success', text: t('partners.geoSuccess') });
      },
      (error) => {
        setGeoLocating(false);
        let msg = t('partners.geoFailure');
        if (error.code === error.PERMISSION_DENIED) {
          msg = t('partners.geoDenied');
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
      setApiError(err.message || t('partners.errors.allFallback'));
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
            {t('partners.badge')}
          </span>
          <h1 className="page-header-title">{t('partners.title')}</h1>
          <p className="page-header-subtitle">
            {t('partners.subtitle')}
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
            <span>{t('partners.cityTitle')}</span>
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
              <Compass size={20} color="var(--primary-700)" /> {t('partners.formTitle')}
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
              {geoLocating ? t('partners.detecting') : t('partners.useLocation')}
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
                  {t('partners.fields.latitude')}
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
                <div className="form-hint">{t('partners.hints.latitude')}</div>
              </div>

              {/* Longitude */}
              <div className="form-group">
                <label className="form-label" htmlFor="longitude">
                  {t('partners.fields.longitude')}
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
                <div className="form-hint">{t('partners.hints.longitude')}</div>
              </div>

              {/* Radius */}
              <div className="form-group">
                <label className="form-label" htmlFor="scheme_name">
                  {t('partners.fields.scheme')}
                </label>
                <select
                  id="scheme_name"
                  name="scheme_name"
                  className="form-control"
                  value={selectedScheme}
                  onChange={(e) => setSelectedScheme(e.target.value)}
                >
                  <option value="">{t('partners.anyScheme')}</option>
                  {schemes.map((scheme) => (
                    <option key={scheme.id} value={scheme.name}>
                      {scheme.name}
                    </option>
                  ))}
                </select>
                <div className="form-hint">{t('partners.hints.scheme')}</div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="radius_km">
                  {t('partners.fields.radius')}
                </label>
                <select
                  id="radius_km"
                  name="radius_km"
                  className="form-control"
                  value={coords.radius_km}
                  onChange={(e) => setCoords({ ...coords, radius_km: e.target.value })}
                >
                  <option value="25">{t('partners.radii.km25')}</option>
                  <option value="50">{t('partners.radii.km50')}</option>
                  <option value="100">{t('partners.radii.km100')}</option>
                  <option value="250">{t('partners.radii.km250')}</option>
                  <option value="500">{t('partners.radii.km500')}</option>
                  <option value="1500">{t('partners.radii.km1500')}</option>
                </select>
              </div>

              {/* Submit Buttons */}
              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading}
                style={{ marginTop: '0.5rem' }}
              >
                {loading ? <LoadingSpinner size="sm" /> : <Search size={16} />} {t('partners.find')}
              </button>

              <button
                type="button"
                className="btn btn-outline btn-block btn-sm"
                onClick={handleViewAll}
                style={{ marginTop: '0.75rem' }}
              >
                <Building size={14} /> {t('partners.viewAll')} ({allPartners.length || t('schemes.all')})
              </button>
            </form>
          </div>

          {/* Results Side */}
          <div className="partners-results-container">
            {apiError && <ErrorMessage message={apiError} onRetry={handleSearch} />}

            {loading && <LoadingSpinner message={t('partners.loading')} />}

            {/* Nearby Mode Results */}
            {!loading && !viewAllMode && nearbyResults && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--slate-900)' }}>
                    {t('partners.found')} ({nearbyResults.partners.length})
                  </h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
                    {t('partners.within')} {nearbyResults.radius_km} {t('partners.of')} ({nearbyResults.user_location.latitude}, {nearbyResults.user_location.longitude})
                    {selectedScheme ? ` ${t('partners.for')} ${selectedScheme}` : ''}
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
                      {t('partners.noneTitle')} {coords.radius_km} km
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)', maxWidth: '420px', margin: '0 auto 1.25rem' }}>
                      {t('partners.noneText')}
                    </p>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setCoords((prev) => ({ ...prev, radius_km: '500' }));
                        handleSearch();
                      }}
                    >
                      {t('partners.expand')}
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
                    {t('partners.allTitle')} ({allPartners.length})
                  </h3>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleSearch()}
                  >
                    {t('partners.back')}
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
