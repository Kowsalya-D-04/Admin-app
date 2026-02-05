import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Trips.css';

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    driverId: '',
    status: 'all'
  });
  const [stats, setStats] = useState({
    total: 0,
    scheduled: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0
  });

  // Fetch all trips from API
  const fetchTrips = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('http://localhost:8080/api/admin/trips');
      
      if (response.data.message && response.data.message === 'No trips found') {
        setTrips([]);
        resetStats();
      } else {
        const tripsData = response.data;
        setTrips(tripsData);
        calculateStats(tripsData);
      }
    } catch (err) {
      console.error('Error fetching trips:', err);
      setError(err.response?.data?.message || 'Failed to fetch trips. Please check the server connection.');
    } finally {
      setLoading(false);
    }
  };

  // Reset statistics
  const resetStats = () => {
    setStats({
      total: 0,
      scheduled: 0,
      inProgress: 0,
      completed: 0,
      cancelled: 0
    });
  };

  // Calculate statistics based on trip status/times
  const calculateStats = (tripData) => {
    const now = new Date();
    
    const stats = {
      total: tripData.length,
      scheduled: tripData.filter(trip => {
        const pickupTime = new Date(trip.pickupTime || trip.startTime);
        return pickupTime > now;
      }).length,
      inProgress: tripData.filter(trip => {
        const startTime = new Date(trip.startTime);
        const dropTime = new Date(trip.dropTime || trip.deliveryTime);
        return startTime <= now && (!trip.dropTime || dropTime > now);
      }).length,
      completed: tripData.filter(trip => trip.dropTime || trip.deliveryTime).length,
      cancelled: 0 // Assuming you have a cancelled field
    };
    
    setStats(stats);
  };

  // Initial fetch
  useEffect(() => {
    fetchTrips();
  }, []);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Apply filters
  const handleApplyFilters = (e) => {
    e.preventDefault();
    filterTrips();
  };

  // Filter trips based on criteria
  const filterTrips = () => {
    let filtered = [...trips];
    
    // Filter by driver ID
    if (filters.driverId) {
      filtered = filtered.filter(trip => 
        trip.driverId && trip.driverId.toString() === filters.driverId
      );
    }
    
    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(trip => {
        switch(filters.status) {
          case 'scheduled':
            const pickupTime = new Date(trip.pickupTime || trip.startTime);
            return pickupTime > new Date();
          case 'in-progress':
            const startTime = new Date(trip.startTime);
            const dropTime = new Date(trip.dropTime || trip.deliveryTime);
            return startTime <= new Date() && (!trip.dropTime || dropTime > new Date());
          case 'completed':
            return trip.dropTime || trip.deliveryTime;
          default:
            return true;
        }
      });
    }
    
    return filtered;
  };

  // Get filtered trips
  const filteredTrips = filterTrips();

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Format time only
  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      
      return date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  // Get trip status based on times
  const getTripStatus = (trip) => {
    const now = new Date();
    const pickupTime = new Date(trip.pickupTime || trip.startTime);
    const startTime = new Date(trip.startTime);
    const dropTime = new Date(trip.dropTime || trip.deliveryTime);
    
    if (trip.dropTime || trip.deliveryTime) {
      return 'completed';
    } else if (startTime <= now) {
      return 'in-progress';
    } else if (pickupTime > now) {
      return 'scheduled';
    }
    
    return 'unknown';
  };

  // Get status badge class
  const getStatusClass = (status) => {
    switch (status) {
      case 'scheduled':
        return 'status-scheduled';
      case 'in-progress':
        return 'status-in-progress';
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-unknown';
    }
  };

  // Get status display text
  const getStatusText = (status) => {
    switch (status) {
      case 'scheduled':
        return 'Scheduled';
      case 'in-progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  // Calculate trip duration
  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return 'N/A';
    
    try {
      const start = new Date(startTime);
      const end = new Date(endTime);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) return 'N/A';
      
      const durationMs = end - start;
      const hours = Math.floor(durationMs / (1000 * 60 * 60));
      const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      } else {
        return `${minutes}m`;
      }
    } catch (error) {
      return 'N/A';
    }
  };

  return (
    <div className="trips-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-left">
          <h1>🚛 Trip Management</h1>
          <p className="subtitle">Monitor and manage all transportation trips</p>
        </div>
        <div className="header-right">
          <button 
            className="refresh-btn"
            onClick={fetchTrips}
            disabled={loading}
          >
            {loading ? '⏳ Loading...' : '🔄 Refresh Data'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Trips</div>
        </div>
        <div className="stat-card scheduled">
          <div className="stat-value">{stats.scheduled}</div>
          <div className="stat-label">Scheduled</div>
        </div>
        <div className="stat-card in-progress">
          <div className="stat-value">{stats.inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card completed">
          <div className="stat-value">{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <h3>🔍 Filter Trips</h3>
        <form onSubmit={handleApplyFilters} className="filters-form">
          <div className="filter-group">
            <label htmlFor="driverId">Driver ID</label>
            <input
              type="number"
              id="driverId"
              name="driverId"
              placeholder="Enter Driver ID"
              value={filters.driverId}
              onChange={handleFilterChange}
              min="1"
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="status">Trip Status</label>
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <div className="filter-buttons">
            <button type="submit" className="btn-apply">
              🔍 Apply Filters
            </button>
            <button 
              type="button" 
              className="btn-reset"
              onClick={() => {
                setFilters({ driverId: '', status: 'all' });
                fetchTrips();
              }}
            >
              🗑️ Clear Filters
            </button>
          </div>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <span>❌ Error: {error}</span>
          <button className="close-btn" onClick={() => setError(null)}>
            ×
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading trips data...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredTrips.length === 0 && trips.length === 0 && !error && (
        <div className="empty-state">
          <div className="empty-icon">🚚</div>
          <h3>No Trips Found</h3>
          <p>There are no trips in the system yet.</p>
          <button className="retry-btn" onClick={fetchTrips}>
            🔄 Refresh
          </button>
        </div>
      )}

      {/* No Filter Results */}
      {!loading && filteredTrips.length === 0 && trips.length > 0 && (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No Matching Trips</h3>
          <p>No trips found matching your filter criteria.</p>
          <button 
            className="retry-btn" 
            onClick={() => setFilters({ driverId: '', status: 'all' })}
          >
            🔄 Clear Filters
          </button>
        </div>
      )}

      {/* Trips Grid */}
      {!loading && filteredTrips.length > 0 && (
        <>
          <div className="trips-header">
            <h3>📋 All Trips ({filteredTrips.length} of {trips.length})</h3>
            <div className="export-actions">
              <button className="btn-export" onClick={() => alert('Export feature coming soon!')}>
                📥 Export to Excel
              </button>
            </div>
          </div>
          
          <div className="trips-grid">
            {filteredTrips.map(trip => {
              const status = getTripStatus(trip);
              
              return (
                <div key={trip.id || trip.tripId} className="trip-card">
                  <div className="trip-header">
                    <div className="trip-id">
                      <span className="trip-badge">{trip.tripId || `TRIP-${trip.id}`}</span>
                      <span className="trip-date">
                        📅 Created: {formatDate(trip.createdAt || trip.startTime)}
                      </span>
                    </div>
                    <div className={`status-badge ${getStatusClass(status)}`}>
                      {getStatusText(status)}
                    </div>
                  </div>

                  {/* Trip IDs */}
                  <div className="ids-section">
                    <div className="id-item">
                      <span className="id-label">Driver ID:</span>
                      <span className="id-value">👤 {trip.driverId || 'N/A'}</span>
                    </div>
                    <div className="id-item">
                      <span className="id-label">Load Request ID:</span>
                      <span className="id-value">📦 {trip.loadRequestId || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Route Info */}
                  <div className="route-section">
                    <div className="route-point">
                      <div className="point-label">Pickup</div>
                      <div className="point-value">
                        🕒 {formatTime(trip.pickupTime)}
                        <br/>
                        <small>{trip.route || 'Location not specified'}</small>
                      </div>
                    </div>
                    <div className="route-arrow">→</div>
                    <div className="route-point">
                      <div className="point-label">Drop</div>
                      <div className="point-value">
                        🕒 {formatTime(trip.dropTime || trip.deliveryTime)}
                      </div>
                    </div>
                  </div>

                  {/* Trip Details */}
                  <div className="trip-details">
                    <div className="detail-row">
                      <div className="detail-item">
                        <span className="detail-label">Distance</span>
                        <span className="detail-value">
                          🛣️ {trip.distance ? `${trip.distance} km` : 'N/A'}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Price</span>
                        <span className="detail-value price">
                          ₹{trip.price || '0'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="detail-row">
                      <div className="detail-item">
                        <span className="detail-label">Duration</span>
                        <span className="detail-value">
                          ⏱️ {calculateDuration(trip.startTime, trip.dropTime || trip.deliveryTime)}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Start Time</span>
                        <span className="detail-value">
                          🕐 {formatTime(trip.startTime)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="timeline-section">
                    <div className="section-label">Trip Timeline</div>
                    <div className="timeline">
                      <div className="timeline-item">
                        <span className="timeline-label">Pickup:</span>
                        <span className="timeline-value">
                          {formatDate(trip.pickupTime)}
                        </span>
                      </div>
                      <div className="timeline-item">
                        <span className="timeline-label">Start:</span>
                        <span className="timeline-value">
                          {formatDate(trip.startTime)}
                        </span>
                      </div>
                      {(trip.dropTime || trip.deliveryTime) && (
                        <div className="timeline-item">
                          <span className="timeline-label">Drop:</span>
                          <span className="timeline-value">
                            {formatDate(trip.dropTime || trip.deliveryTime)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="trip-actions">
                    <button 
                      className="btn-view"
                      onClick={() => alert(`View details for Trip: ${trip.tripId}`)}
                    >
                      👁️ View Details
                    </button>
                    <button 
                      className="btn-track"
                      onClick={() => alert(`Track Trip: ${trip.tripId}`)}
                    >
                      🛰️ Track Trip
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Trips;
              

    
    