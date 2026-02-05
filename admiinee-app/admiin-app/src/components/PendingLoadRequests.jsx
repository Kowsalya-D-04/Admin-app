import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LoadRequests.css';

const PendingLoadRequests = () => {
  const [driverLoads, setDriverLoads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const API_URL = 'http://localhost:8080/api';

  // Fetch driver load requests only
  const fetchDriverLoadRequests = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get(`${API_URL}/admin/driver-load-requests`);
      console.log('Driver Load Requests API Response:', response.data);
      
      if (response.data) {
        let driverData = [];
        
        // Handle different response formats
        if (Array.isArray(response.data)) {
          driverData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          driverData = response.data.data;
        } else if (response.data.requests && Array.isArray(response.data.requests)) {
          driverData = response.data.requests;
        } else if (response.data.success && Array.isArray(response.data.data)) {
          driverData = response.data.data;
        } else if (response.data.success && Array.isArray(response.data.requests)) {
          driverData = response.data.requests;
        } else if (response.data.drivers && Array.isArray(response.data.drivers)) {
          driverData = response.data.drivers;
        }
        
        // If no data structure found, use the response as is
        if (driverData.length === 0 && response.data) {
          // Try to extract array from response
          if (typeof response.data === 'object') {
            const values = Object.values(response.data);
            if (values.length > 0 && Array.isArray(values[0])) {
              driverData = values[0];
            } else {
              // If it's a single object, wrap in array
              driverData = [response.data];
            }
          }
        }
        
        console.log('Processed Driver Data:', driverData);
        setDriverLoads(driverData);
        
        if (driverData.length === 0) {
          setError('No driver load requests found in the system');
        }
      } else {
        setError('Empty response from server');
        setDriverLoads([]);
      }
    } catch (err) {
      console.error('Error fetching driver requests:', err);
      setError(`Failed to load driver requests: ${err.message}`);
      setDriverLoads([]);
    } finally {
      setLoading(false);
    }
  };

  // View driver details
  const viewDriverDetails = (driver) => {
    setSelectedDriver(driver);
    setShowDetailsModal(true);
  };

  // Close details modal
  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedDriver(null);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  // Format price
  const formatPrice = (amount) => {
    if (!amount && amount !== 0) return '₹ N/A';
    return '₹' + parseInt(amount).toLocaleString('en-IN');
  };

  // Get status badge class
  const getStatusClass = (status) => {
    if (!status) return 'pending';
    const statusLower = status.toLowerCase();
    if (statusLower.includes('approve')) return 'approved';
    if (statusLower.includes('pending')) return 'pending';
    if (statusLower.includes('available')) return 'available';
    if (statusLower.includes('active')) return 'active';
    if (statusLower.includes('complete')) return 'completed';
    return 'pending';
  };

  // Get vehicle icon
  const getVehicleIcon = (type) => {
    if (!type) return '🚚';
    const typeLower = type.toLowerCase();
    if (typeLower.includes('mini')) return '🚐';
    if (typeLower.includes('truck')) return '🚚';
    if (typeLower.includes('lorry')) return '🚛';
    if (typeLower.includes('container')) return '🚢';
    if (typeLower.includes('trailer')) return '🚛';
    return '🚗';
  };

  // Initial fetch
  useEffect(() => {
    fetchDriverLoadRequests();
  }, []);

  // Handle refresh
  const handleRefresh = () => {
    setError('');
    setSuccess('');
    fetchDriverLoadRequests();
  };

  return (
    <div className="driver-load-requests-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-left">
          <h1>🚚 Driver Load Requests</h1>
          <p className="subtitle">View and manage all driver load requests in the system</p>
        </div>
        <div className="header-right">
          <button 
            className="refresh-btn"
            onClick={handleRefresh}
            disabled={loading}
          >
            🔄 {loading ? 'Refreshing...' : 'Refresh'}
          </button>
          
          <div className="stats-container">
            <div className="stat-card">
              <div className="stat-value">{driverLoads.length}</div>
              <div className="stat-label">Total Drivers</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {driverLoads.filter(d => d.status?.toLowerCase().includes('pending')).length}
              </div>
              <div className="stat-label">Pending</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {driverLoads.filter(d => d.status?.toLowerCase().includes('approved')).length}
              </div>
              <div className="stat-label">Approved</div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      {success && (
        <div className="success-message">
          <span className="success-icon">✅</span>
          <span className="success-text">{success}</span>
          <button className="close-btn" onClick={() => setSuccess('')}>✕</button>
        </div>
      )}

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <span className="error-text">{error}</span>
          <button className="close-btn" onClick={() => setError('')}>✕</button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading driver load requests...</p>
        </div>
      ) : (
        <div className="content-area">
          {driverLoads.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🚚</div>
              <h3>No Driver Load Requests</h3>
              <p>No driver load requests available in the system.</p>
              <button onClick={handleRefresh} className="retry-btn">
                Check Again
              </button>
            </div>
          ) : (
            <div className="driver-requests-grid">
              {driverLoads.map((driver, index) => {
                const driverId = driver.id || driver._id || driver.driverId || `DRV${index + 1}`;
                const driverName = driver.driverName || driver.name || `Driver ${index + 1}`;
                const vehicleType = driver.vehicleType || driver.vehicle || 'Truck';
                const capacity = driver.capacity || driver.vehicleCapacity || 'N/A';
                const fromLocation = driver.fromLocation || driver.currentLocation || driver.location || 'Not specified';
                const toLocation = driver.toLocation || driver.destination || driver.preferredLocation || 'Anywhere';
                const status = driver.status || 'PENDING';
                
                return (
                  <div key={driverId} className="driver-request-card">
                    {/* Card Header */}
                    <div className="card-header">
                      <div className="driver-info">
                        <div className="driver-avatar">
                          {driverName.charAt(0).toUpperCase()}
                        </div>
                        <div className="driver-details">
                          <div className="driver-name">{driverName}</div>
                          <div className="driver-id">ID: {driverId}</div>
                        </div>
                      </div>
                      <div className="driver-status">
                        <span className={`status-badge ${getStatusClass(status)}`}>
                          {status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Driver Route */}
                    <div className="driver-route">
                      <div className="route-section">
                        <div className="route-point">
                          <span className="point-label">FROM:</span>
                          <span className="point-value">{fromLocation}</span>
                        </div>
                        <div className="route-arrow">➔</div>
                        <div className="route-point">
                          <span className="point-label">TO:</span>
                          <span className="point-value">{toLocation}</span>
                        </div>
                      </div>
                    </div>

                    {/* Driver Details */}
                    <div className="driver-details">
                      <div className="detail-row">
                        <div className="detail-item">
                          <span className="detail-icon">{getVehicleIcon(vehicleType)}</span>
                          <span className="detail-label">Vehicle:</span>
                          <span className="detail-value">{vehicleType}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-icon">⚖️</span>
                          <span className="detail-label">Capacity:</span>
                          <span className="detail-value">{capacity} {capacity !== 'N/A' ? 'tons' : ''}</span>
                        </div>
                      </div>
                      
                      <div className="detail-row">
                        {driver.vehicleNumber && (
                          <div className="detail-item">
                            <span className="detail-icon">🔢</span>
                            <span className="detail-label">Vehicle No:</span>
                            <span className="detail-value">{driver.vehicleNumber}</span>
                          </div>
                        )}
                        {driver.rate && (
                          <div className="detail-item">
                            <span className="detail-icon">💰</span>
                            <span className="detail-label">Rate:</span>
                            <span className="detail-value price">{formatPrice(driver.rate)}</span>
                          </div>
                        )}
                      </div>
                      
                      {driver.message && (
                        <div className="driver-message">
                          <span className="message-label">Note:</span>
                          <span className="message-text">{driver.message}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Section */}
                    <div className="action-section">
                      <div className="meta-info">
                        <span className="meta-icon">📅</span>
                        <span className="meta-text">
                          {driver.createdAt ? formatDate(driver.createdAt) : 'Date N/A'}
                        </span>
                      </div>
                      
                      <button 
                        className="view-details-btn"
                        onClick={() => viewDriverDetails(driver)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Driver Details Modal */}
      {showDetailsModal && selectedDriver && (
        <div className="modal-overlay">
          <div className="modal-container details-modal">
            <div className="modal-header">
              <div className="modal-title">
                <h2>Driver Details</h2>
                <p className="modal-subtitle">
                  Complete information for {selectedDriver.driverName || selectedDriver.name}
                </p>
              </div>
              <button className="modal-close" onClick={closeDetailsModal}>✕</button>
            </div>

            <div className="modal-content">
              <div className="driver-profile">
                <div className="profile-header">
                  <div className="profile-avatar">
                    {selectedDriver.driverName?.charAt(0) || selectedDriver.name?.charAt(0) || 'D'}
                  </div>
                  <div className="profile-info">
                    <h3 className="profile-name">{selectedDriver.driverName || selectedDriver.name || 'Driver'}</h3>
                    <div className="profile-id">ID: {selectedDriver.id || selectedDriver._id || selectedDriver.driverId}</div>
                    <div className="profile-status">
                      <span className={`status-badge ${getStatusClass(selectedDriver.status)}`}>
                        {selectedDriver.status?.toUpperCase() || 'PENDING'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="details-section">
                  <h4 className="section-title">Route Information</h4>
                  <div className="section-content">
                    <div className="detail-item">
                      <span className="detail-label">From Location:</span>
                      <span className="detail-value">{selectedDriver.fromLocation || selectedDriver.currentLocation || 'Not specified'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">To Location:</span>
                      <span className="detail-value">{selectedDriver.toLocation || selectedDriver.destination || 'Anywhere'}</span>
                    </div>
                  </div>
                </div>

                <div className="details-section">
                  <h4 className="section-title">Vehicle Details</h4>
                  <div className="section-content">
                    <div className="detail-item">
                      <span className="detail-label">Vehicle Type:</span>
                      <span className="detail-value">{selectedDriver.vehicleType || selectedDriver.vehicle || 'Truck'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Vehicle Number:</span>
                      <span className="detail-value">{selectedDriver.vehicleNumber || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Capacity:</span>
                      <span className="detail-value">{selectedDriver.capacity || selectedDriver.vehicleCapacity || 'N/A'} tons</span>
                    </div>
                  </div>
                </div>

                <div className="details-section">
                  <h4 className="section-title">Contact Information</h4>
                  <div className="section-content">
                    {selectedDriver.phone && (
                      <div className="detail-item">
                        <span className="detail-label">Phone:</span>
                        <span className="detail-value">{selectedDriver.phone}</span>
                      </div>
                    )}
                    {selectedDriver.email && (
                      <div className="detail-item">
                        <span className="detail-label">Email:</span>
                        <span className="detail-value">{selectedDriver.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                {selectedDriver.rate && (
                  <div className="details-section">
                    <h4 className="section-title">Pricing</h4>
                    <div className="section-content">
                      <div className="detail-item">
                        <span className="detail-label">Requested Rate:</span>
                        <span className="detail-value price">{formatPrice(selectedDriver.rate)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {(selectedDriver.message || selectedDriver.notes) && (
                  <div className="details-section">
                    <h4 className="section-title">Additional Notes</h4>
                    <div className="section-content">
                      <div className="notes-box">
                        {selectedDriver.message || selectedDriver.notes}
                      </div>
                    </div>
                  </div>
                )}

                <div className="details-section">
                  <h4 className="section-title">Request Information</h4>
                  <div className="section-content">
                    {selectedDriver.createdAt && (
                      <div className="detail-item">
                        <span className="detail-label">Request Date:</span>
                        <span className="detail-value">{formatDate(selectedDriver.createdAt)}</span>
                      </div>
                    )}
                    {selectedDriver.updatedAt && (
                      <div className="detail-item">
                        <span className="detail-label">Last Updated:</span>
                        <span className="detail-value">{formatDate(selectedDriver.updatedAt)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button 
                className="btn-close"
                onClick={closeDetailsModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* System Info */}
      <div className="system-info">
        <details>
          <summary>📊 API Information</summary>
          <div className="info-content">
            <p><strong>API Endpoint:</strong> {API_URL}/admin/driver-load-requests</p>
            <p><strong>Total Records:</strong> {driverLoads.length}</p>
            <p><strong>Last Updated:</strong> {new Date().toLocaleTimeString()}</p>
            <p><strong>Status:</strong> <span className="status-connected">Connected</span></p>
          </div>
        </details>
      </div>
    </div>
  );
};

export default PendingLoadRequests;