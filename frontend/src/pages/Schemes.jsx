import React, { useState, useEffect } from 'react';
import { Layers, Search, Filter, Sparkles, RefreshCw } from 'lucide-react';
import { getSchemes } from '../services/api';
import SchemeCard from '../components/SchemeCard';
import SchemeDetailsModal from '../components/SchemeDetailsModal';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function Schemes() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSchemeId, setSelectedSchemeId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const fetchSchemesList = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSchemes();
      setSchemes(data);
    } catch (err) {
      setError(err.message || 'Unable to load schemes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemesList();
  }, []);

  // Filter & Search Logic
  const filteredSchemes = schemes.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      filterType === 'all' || (s.project_types && s.project_types.includes(filterType));

    return matchesSearch && matchesType;
  });

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <span className="badge badge-teal" style={{ marginBottom: '0.5rem' }}>
            Ministry Catalog
          </span>
          <h1 className="page-header-title">Concessional Schemes Explorer</h1>
          <p className="page-header-subtitle">
            Browse all official demo credit and educational loan schemes under MoSJE guidelines for marginalized beneficiaries.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="container" style={{ paddingBottom: '4rem' }}>
        {/* Search and Filters Bar */}
        <div
          style={{
            backgroundColor: 'var(--white)',
            border: '1px solid var(--slate-200)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            marginBottom: '2rem',
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Search Input */}
          <div style={{ flex: '1 1 280px', position: 'relative' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '0.9rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--slate-400)',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '2.4rem' }}
              placeholder="Search schemes by keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '0 1 auto' }}>
            <Filter size={18} color="var(--slate-500)" />
            <select
              className="form-control"
              style={{ width: 'auto', minWidth: '180px' }}
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="business">Business / Micro-Finance</option>
              <option value="education">Education Schemes</option>
              <option value="other">Other Permissible</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && <LoadingSpinner message="Fetching schemes from backend..." />}

        {/* Error State */}
        {error && <ErrorMessage message={error} onRetry={fetchSchemesList} />}

        {/* Results Grid */}
        {!loading && !error && (
          <>
            {filteredSchemes.length > 0 ? (
              <div className="schemes-grid">
                {filteredSchemes.map((scheme) => (
                  <SchemeCard
                    key={scheme.id}
                    scheme={scheme}
                    onViewDetails={(s) => setSelectedSchemeId(s.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                <Layers size={40} color="var(--slate-400)" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--slate-800)', marginBottom: '0.5rem' }}>
                  No Matching Schemes Found
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)' }}>
                  Try adjusting your search keywords or filter category.
                </p>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ marginTop: '1rem' }}
                  onClick={() => {
                    setSearchTerm('');
                    setFilterType('all');
                  }}
                >
                  Reset Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Details Modal */}
      {selectedSchemeId && (
        <SchemeDetailsModal
          schemeId={selectedSchemeId}
          onClose={() => setSelectedSchemeId(null)}
        />
      )}
    </div>
  );
}
