// export default LoadRequests;
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './LoadRequests.css';

// const LoadRequests = () => {
//   const [customerLoads, setCustomerLoads] = useState([]);
//   const [driverLoadRequests, setDriverLoadRequests] = useState([]); // Changed from drivers
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [selectedDriver, setSelectedDriver] = useState({});
//   const [showDriverModal, setShowDriverModal] = useState(false);
//   const [selectedLoad, setSelectedLoad] = useState(null);

//   // Base API URL
//   const API_URL = 'http://localhost:8080/api/admin';

//   // Fetch pending customer loads
//   const fetchCustomerLoads = async () => {
//     try {
//       setLoading(true);
//       setError('');
      
//       const response = await axios.get(`${API_URL}/load-requests/pending`);
//       console.log('Customer loads:', response.data);
      
//       if (response.data.success && Array.isArray(response.data.requests)) {
//         setCustomerLoads(response.data.requests);
        
//         if (response.data.requests.length === 0) {
//           setError('No pending load requests found');
//         }
//       } else {
//         setError('Invalid response format from server');
//       }
      
//     } catch (err) {
//       console.error('Error:', err);
//       setError('Failed to load pending requests');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch driver load requests (drivers who have submitted bids/requests)
//   const fetchDriverLoadRequests = async () => {
//     try {
//       // Fetch driver load requests instead of all drivers
//       const response = await axios.get(`${API_URL}/driver-load-requests`);
//       console.log('Driver load requests:', response.data);
      
//       let requestsData = [];
      
//       // Handle different response formats
//       if (Array.isArray(response.data)) {
//         requestsData = response.data;
//       } else if (response.data.success && Array.isArray(response.data.requests)) {
//         requestsData = response.data.requests;
//       } else if (response.data.data && Array.isArray(response.data.data)) {
//         requestsData = response.data.data;
//       }
      
//       // Filter for active/pending requests
//       const activeRequests = requestsData.filter(request => 
//         request.status === 'PENDING' || 
//         request.status === 'ACTIVE' ||
//         !request.status // Include all if no status
//       );
      
//       setDriverLoadRequests(activeRequests);
      
//     } catch (err) {
//       console.error('Error fetching driver load requests:', err);
//       // Try alternative endpoint
//       try {
//         const altResponse = await axios.get(`${API_URL}/drivers/load-requests`);
//         console.log('Alternative response:', altResponse.data);
//         // Process alternative response...
//       } catch (altErr) {
//         console.error('Both endpoints failed:', altErr);
//       }
//     }
//   };

//   // Open driver selection modal - show driver load requests
//   const openDriverModal = (load) => {
//     setSelectedLoad(load);
//     setSelectedDriver({});
//     setShowDriverModal(true);
    
//     // Fetch fresh driver load requests
//     fetchDriverLoadRequests();
//   };

//   // Close driver modal
//   const closeDriverModal = () => {
//     setShowDriverModal(false);
//     setSelectedLoad(null);
//     setSelectedDriver({});
//   };

//   // Handle driver selection from load requests
//   const handleDriverSelect = (driverId, driverName) => {
//     setSelectedDriver({
//       id: driverId,
//       name: driverName
//     });
//   };

//   // Assign driver load request to customer load
//   const assignDriverToLoad = async () => {
//     if (!selectedLoad || !selectedDriver.id) {
//       setError('Please select a driver request');
//       return;
//     }

//     setLoading(true);
//     setError('');
//     setSuccess('');

//     try {
//       const response = await axios.post(
//         `${API_URL}/assign/driver-to-customer`,
//         {
//           driverLoadRequestId: parseInt(selectedDriver.id),
//           customerLoadId: parseInt(selectedLoad.requestId || selectedLoad.id)
//         }
//       );

//       console.log('Assignment response:', response.data);

//       if (response.data.success) {
//         setSuccess(`✅ Driver "${selectedDriver.name}" assigned to Load #${selectedLoad.requestId} successfully!`);
        
//         // Close modal and refresh data
//         closeDriverModal();
        
//         // Refresh both lists after 1 second
//         setTimeout(() => {
//           fetchCustomerLoads();
//           fetchDriverLoadRequests();
//         }, 1000);
        
//         // Clear success message after 3 seconds
//         setTimeout(() => {
//           setSuccess('');
//         }, 3000);
//       } else {
//         setError(response.data.message || 'Assignment failed');
//       }
//     } catch (err) {
//       console.error('Assignment error:', err);
//       setError(err.response?.data?.message || 'Failed to assign driver');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString('en-IN') + ' ' + date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
//     } catch {
//       return dateString;
//     }
//   };

//   // Format price
//   const formatPrice = (amount) => {
//     if (!amount) return '₹0';
//     return '₹' + amount.toLocaleString('en-IN');
//   };

//   // Get driver info from load request
//   const getDriverInfo = (driverRequest) => {
//     return {
//       id: driverRequest.id,
//       name: driverRequest.driverName || driverRequest.name,
//       bidAmount: driverRequest.bid_amount || driverRequest.bidAmount,
//       message: driverRequest.message,
//       vehicleNumber: driverRequest.vehicleNumber,
//       phone: driverRequest.phone,
//       status: driverRequest.status,
//       createdAt: driverRequest.created_at || driverRequest.createdAt
//     };
//   };

//   // Calculate match score based on load and driver request
//   const calculateMatchScore = (load, driverRequest) => {
//     let score = 50; // Base score
    
//     // Add points for bid amount
//     if (driverRequest.bid_amount) {
//       const bid = driverRequest.bid_amount;
//       const loadPrice = load.price || 0;
      
//       if (bid <= loadPrice) {
//         score += 20; // Good bid
//       } else if (bid <= loadPrice * 1.2) {
//         score += 10; // Acceptable bid
//       }
//     }
    
//     // Add points for recent requests
//     if (driverRequest.created_at) {
//       const requestDate = new Date(driverRequest.created_at);
//       const now = new Date();
//       const hoursDiff = (now - requestDate) / (1000 * 60 * 60);
      
//       if (hoursDiff < 24) {
//         score += 15; // Requested within 24 hours
//       }
//     }
    
//     // Add points if driver message mentions load type
//     if (driverRequest.message && load.loadType) {
//       const message = driverRequest.message.toLowerCase();
//       const loadType = load.loadType.toLowerCase();
      
//       if (message.includes(loadType) || message.includes('any') || message.includes('available')) {
//         score += 15;
//       }
//     }
    
//     return Math.min(score, 100);
//   };

//   // Fetch data on component mount
//   useEffect(() => {
//     fetchCustomerLoads();
//     fetchDriverLoadRequests();
//   }, []);

//   // Refresh button handler
//   const handleRefresh = () => {
//     setError('');
//     setSuccess('');
//     setLoading(true);
//     fetchCustomerLoads();
//     fetchDriverLoadRequests();
//   };

//   return (
//     <div className="load-requests-container">
//       {/* Header */}
//       <div className="page-header">
//         <div className="header-left">
//           <h1>📦 Customer Load Requests</h1>
//           <p className="subtitle">Assign drivers who have submitted load requests</p>
//         </div>
//         <div className="header-right">
//           <button 
//             className="refresh-btn"
//             onClick={handleRefresh}
//             disabled={loading}
//           >
//             🔄 {loading ? 'Refreshing...' : 'Refresh'}
//           </button>
//           <div className="stats-container">
//             <div className="stat-item">
//               <span className="stat-count">{customerLoads.length}</span>
//               <span className="stat-label">Pending Loads</span>
//             </div>
//             <div className="stat-item">
//               <span className="stat-count">{driverLoadRequests.length}</span>
//               <span className="stat-label">Driver Requests</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Success Message */}
//       {success && (
//         <div className="success-message">
//           <span className="success-icon">✅</span>
//           <span className="success-text">{success}</span>
//           <button className="close-btn" onClick={() => setSuccess('')}>✕</button>
//         </div>
//       )}

//       {/* Error Message */}
//       {error && (
//         <div className="error-message">
//           <span className="error-icon">⚠️</span>
//           <span className="error-text">{error}</span>
//           <button className="close-btn" onClick={() => setError('')}>✕</button>
//         </div>
//       )}

//       {/* Loading State */}
//       {loading && customerLoads.length === 0 ? (
//         <div className="loading-container">
//           <div className="spinner"></div>
//           <p>Loading customer loads...</p>
//         </div>
//       ) : (
//         <div className="content-area">
//           {customerLoads.length === 0 ? (
//             <div className="empty-state">
//               <div className="empty-icon">📭</div>
//               <h3>No Pending Loads</h3>
//               <p>All customer load requests have been processed.</p>
//               <button onClick={handleRefresh} className="retry-btn">
//                 Check Again
//               </button>
//             </div>
//           ) : (
//             <div className="loads-grid">
//               {customerLoads.map((load) => (
//                 <div key={load.requestId || load.id} className="load-card">
//                   {/* Card Header */}
//                   <div className="card-header">
//                     <div className="load-id">
//                       <span className="badge">#LOAD{load.requestId || load.id}</span>
//                       <span className="date">{formatDate(load.createdAt)}</span>
//                     </div>
//                     <div className="load-type">
//                       <span className="type-badge">{load.loadType || 'General'}</span>
//                     </div>
//                   </div>

//                   {/* Route Information */}
//                   <div className="route-section">
//                     <div className="route-point pickup">
//                       <div className="point-label">Pickup</div>
//                       <div className="point-value">{load.pickup || 'Not specified'}</div>
//                     </div>
//                     <div className="route-arrow">➔</div>
//                     <div className="route-point drop">
//                       <div className="point-label">Drop</div>
//                       <div className="point-value">{load.drop || load.dropLocation || 'Not specified'}</div>
//                     </div>
//                   </div>

//                   {/* Load Details */}
//                   <div className="details-section">
//                     <div className="detail-row">
//                       <div className="detail-item">
//                         <span className="detail-label">Weight:</span>
//                         <span className="detail-value">{load.weight || load.weishk || 'N/A'} kg</span>
//                       </div>
//                       <div className="detail-item">
//                         <span className="detail-label">Distance:</span>
//                         <span className="detail-value">{load.distance || 'N/A'} km</span>
//                       </div>
//                     </div>
//                     <div className="detail-row">
//                       <div className="detail-item">
//                         <span className="detail-label">Price:</span>
//                         <span className="detail-value price">{formatPrice(load.price)}</span>
//                       </div>
//                       <div className="detail-item">
//                         <span className="detail-label">Status:</span>
//                         <span className="status-badge pending">Pending</span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Customer Info */}
//                   {load.customerName && (
//                     <div className="customer-section">
//                       <div className="customer-label">Customer:</div>
//                       <div className="customer-info">
//                         <span className="customer-name">{load.customerName}</span>
//                         {load.customerPhone && (
//                           <span className="customer-phone">📱 {load.customerPhone}</span>
//                         )}
//                       </div>
//                     </div>
//                   )}

//                   {/* Action Button */}
//                   <div className="action-section">
//                     <button 
//                       className="assign-btn"
//                       onClick={() => openDriverModal(load)}
//                     >
//                       👥 View Driver Requests ({driverLoadRequests.length})
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* Driver Requests Selection Modal */}
//       {showDriverModal && selectedLoad && (
//         <div className="modal-overlay">
//           <div className="modal-container">
//             {/* Modal Header */}
//             <div className="modal-header">
//               <div>
//                 <h2>Assign Driver to Load #{selectedLoad.requestId}</h2>
//                 <p className="modal-subtitle">Select from drivers who have submitted load requests</p>
//               </div>
//               <button className="modal-close" onClick={closeDriverModal}>✕</button>
//             </div>

//             {/* Load Summary */}
//             <div className="modal-load-summary">
//               <div className="summary-card">
//                 <div className="summary-item">
//                   <span className="summary-label">Route:</span>
//                   <span className="summary-value">{selectedLoad.pickup} → {selectedLoad.drop}</span>
//                 </div>
//                 <div className="summary-item">
//                   <span className="summary-label">Load Type:</span>
//                   <span className="summary-value">{selectedLoad.loadType}</span>
//                 </div>
//                 <div className="summary-item">
//                   <span className="summary-label">Weight:</span>
//                   <span className="summary-value">{selectedLoad.weight || selectedLoad.weishk} kg</span>
//                 </div>
//                 {selectedLoad.price && (
//                   <div className="summary-item">
//                     <span className="summary-label">Price:</span>
//                     <span className="summary-value price">{formatPrice(selectedLoad.price)}</span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Driver Requests List */}
//             <div className="drivers-section">
//               <div className="section-header">
//                 <h3>Driver Load Requests ({driverLoadRequests.length})</h3>
//                 <div className="section-subtitle">
//                   Drivers who have bid/submitted requests
//                 </div>
//               </div>
              
//               {driverLoadRequests.length === 0 ? (
//                 <div className="no-drivers">
//                   <div className="empty-icon">🚚</div>
//                   <h4>No Driver Requests Yet</h4>
//                   <p>No drivers have submitted load requests yet.</p>
//                 </div>
//               ) : (
//                 <div className="driver-requests-grid">
//                   {driverLoadRequests.map((driverRequest) => {
//                     const driverInfo = getDriverInfo(driverRequest);
//                     const matchScore = calculateMatchScore(selectedLoad, driverRequest);
//                     const isSelected = selectedDriver.id === driverInfo.id;
                    
//                     return (
//                       <div 
//                         key={driverInfo.id} 
//                         className={`driver-request-card ${isSelected ? 'selected' : ''}`}
//                         onClick={() => handleDriverSelect(driverInfo.id, driverInfo.name)}
//                       >
//                         {/* Driver Header */}
//                         <div className="driver-request-header">
//                           <div className="driver-info">
//                             <div className="driver-name">{driverInfo.name}</div>
//                             <div className="driver-status">
//                               <span className={`status-badge ${driverInfo.status === 'ACTIVE' ? 'active' : 'pending'}`}>
//                                 {driverInfo.status || 'PENDING'}
//                               </span>
//                             </div>
//                           </div>
//                           <div className="match-score">
//                             <div className="score-display">
//                               <div className="score-percent">{matchScore}%</div>
//                               <div className="score-label">Match</div>
//                             </div>
//                           </div>
//                         </div>

//                         {/* Bid/Request Details */}
//                         <div className="request-details">
//                           {driverInfo.bidAmount && (
//                             <div className="bid-amount">
//                               <span className="bid-label">Bid Amount:</span>
//                               <span className="bid-value">{formatPrice(driverInfo.bidAmount)}</span>
//                             </div>
//                           )}
                          
//                           {driverInfo.message && (
//                             <div className="request-message">
//                               <span className="message-label">Message:</span>
//                               <span className="message-text">"{driverInfo.message}"</span>
//                             </div>
//                           )}
                          
//                           <div className="request-meta">
//                             {driverInfo.vehicleNumber && (
//                               <div className="meta-item">
//                                 <span className="meta-icon">🚚</span>
//                                 <span className="meta-text">{driverInfo.vehicleNumber}</span>
//                               </div>
//                             )}
                            
//                             {driverInfo.phone && (
//                               <div className="meta-item">
//                                 <span className="meta-icon">📱</span>
//                                 <span className="meta-text">{driverInfo.phone}</span>
//                               </div>
//                             )}
                            
//                             {driverInfo.createdAt && (
//                               <div className="meta-item">
//                                 <span className="meta-icon">🕒</span>
//                                 <span className="meta-text">Requested: {formatDate(driverInfo.createdAt)}</span>
//                               </div>
//                             )}
//                           </div>
//                         </div>

//                         {/* Request ID */}
//                         <div className="request-id">
//                           Request ID: {driverInfo.id}
//                         </div>

//                         {/* Selection Indicator */}
//                         {isSelected && (
//                           <div className="selected-indicator">
//                             <span className="selected-icon">✓</span>
//                             <span className="selected-text">Selected for assignment</span>
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>

//             {/* Selected Driver Info */}
//             {selectedDriver.id && (
//               <div className="selected-driver-info">
//                 <div className="selected-header">
//                   <span className="selected-label">Selected Driver:</span>
//                   <span className="selected-name">{selectedDriver.name}</span>
//                 </div>
//                 <div className="selected-details">
//                   <span className="driver-id">Load Request ID: {selectedDriver.id}</span>
//                 </div>
//               </div>
//             )}

//             {/* Modal Actions */}
//             <div className="modal-actions">
//               <button 
//                 className="btn-cancel"
//                 onClick={closeDriverModal}
//               >
//                 Cancel
//               </button>
              
//               <button 
//                 className={`btn-assign ${!selectedDriver.id ? 'disabled' : ''}`}
//                 onClick={assignDriverToLoad}
//                 disabled={!selectedDriver.id || loading}
//               >
//                 {loading ? (
//                   <>
//                     <span className="loading-spinner"></span>
//                     Assigning...
//                   </>
//                 ) : 'Confirm Assignment'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Debug Info */}
//       <details className="debug-info">
//         <summary>🔧 Debug Information</summary>
//         <div className="debug-content">
//           <p><strong>API Status:</strong> {customerLoads.length > 0 ? '✅ Connected' : '❌ Not Connected'}</p>
//           <p><strong>Customer Loads Endpoint:</strong> {API_URL}/load-requests/pending</p>
//           <p><strong>Driver Requests Endpoint:</strong> {API_URL}/driver-load-requests</p>
//           <p><strong>Assignment Endpoint:</strong> {API_URL}/assign/driver-to-customer</p>
//           <p><strong>Total Loads:</strong> {customerLoads.length}</p>
//           <p><strong>Total Driver Requests:</strong> {driverLoadRequests.length}</p>
//           <p><strong>Selected Load:</strong> {selectedLoad ? `#${selectedLoad.requestId}` : 'None'}</p>
//           <p><strong>Selected Driver Request:</strong> {selectedDriver.name ? `${selectedDriver.name} (ID: ${selectedDriver.id})` : 'None'}</p>
//         </div>
//       </details>
//     </div>
//   );
// };

// export default LoadRequests;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './LoadRequests.css';

const LoadRequests = () => {
  const [customerLoads, setCustomerLoads] = useState([]);
  const [driverLoadRequests, setDriverLoadRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedDriver, setSelectedDriver] = useState({});
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [selectedLoad, setSelectedLoad] = useState(null);

  const API_URL = 'http://localhost:8080/api/admin';

  // ---------------- FETCH CUSTOMER LOADS ----------------
  const fetchCustomerLoads = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.get(`${API_URL}/load-requests/pending`);
      console.log('Customer loads:', response.data);

      if (response.data.success && Array.isArray(response.data.requests)) {
        setCustomerLoads(response.data.requests);
        if (response.data.requests.length === 0) {
          setError('No pending load requests found');
        }
      } else {
        setError('Invalid response format from server');
      }
    } catch (err) {
      console.error('Error fetching customer loads:', err);
      setError('Failed to load pending requests');
    } finally {
      setLoading(false);
    }
  };

  // ---------------- FETCH DRIVER LOAD REQUESTS ----------------
  const fetchDriverLoadRequests = async () => {
    try {
      const response = await axios.get(`${API_URL}/driver-load-requests`);
      console.log('Driver load requests:', response.data);

      let requestsData = [];

      if (Array.isArray(response.data)) {
        requestsData = response.data;
      } else if (response.data.success && Array.isArray(response.data.requests)) {
        requestsData = response.data.requests;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        requestsData = response.data.data;
      }

      // Only pending/active driver load requests
      const activeRequests = requestsData.filter(
        (r) => r.status === 'PENDING' || r.status === 'ACTIVE' || !r.status
      );

      setDriverLoadRequests(activeRequests);
    } catch (err) {
      console.error('Error fetching driver load requests:', err);
    }
  };

  // ---------------- DRIVER MODAL ----------------
  const openDriverModal = (load) => {
    setSelectedLoad(load);
    setSelectedDriver({});
    setShowDriverModal(true);
    fetchDriverLoadRequests();
  };

  const closeDriverModal = () => {
    setShowDriverModal(false);
    setSelectedLoad(null);
    setSelectedDriver({});
  };

  // ---------------- HANDLE DRIVER SELECTION ----------------
  const handleDriverSelect = (driverRequest) => {
    setSelectedDriver({
      id: driverRequest.driverLoadRequestId || driverRequest.id,
      name: driverRequest.driverName || driverRequest.name,
    });
  };

  // ---------------- ASSIGN DRIVER TO LOAD ----------------
  const assignDriverToLoad = async () => {
    if (!selectedLoad || !selectedDriver.id) {
      setError('Please select a driver request');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Assigning driver:', selectedDriver, 'to load:', selectedLoad);

      const response = await axios.post(
        `${API_URL}/assign/customer-to-driver`, // ✅ Correct endpoint
        {
          driverLoadRequestId: parseInt(selectedDriver.id),
          customerLoadId: parseInt(selectedLoad.requestId || selectedLoad.id),
        }
      );

      console.log('Assignment response:', response.data);

      if (response.data.success) {
        setSuccess(
          `✅ Driver "${selectedDriver.name}" assigned to Load #${selectedLoad.requestId || selectedLoad.id} successfully!`
        );

        // Close modal and refresh data
        closeDriverModal();

        // Refresh lists after short delay
        setTimeout(() => {
          fetchCustomerLoads();
          fetchDriverLoadRequests();
        }, 500);

        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.data.message || 'Assignment failed');
      }
    } catch (err) {
      console.error('Assignment error:', err);
      setError(err.response?.data?.message || 'Failed to assign driver');
    } finally {
      setLoading(false);
    }
  };

  // ---------------- UTILITY FUNCTIONS ----------------
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return (
        date.toLocaleDateString('en-IN') +
        ' ' +
        date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      );
    } catch {
      return dateString;
    }
  };

  const formatPrice = (amount) => {
    if (!amount) return '₹0';
    return '₹' + amount.toLocaleString('en-IN');
  };

  const getDriverInfo = (driverRequest) => ({
    id: driverRequest.driverLoadRequestId || driverRequest.id,
    name: driverRequest.driverName || driverRequest.name,
    bidAmount: driverRequest.bid_amount || driverRequest.bidAmount,
    message: driverRequest.message,
    vehicleNumber: driverRequest.vehicleNumber,
    phone: driverRequest.phone,
    status: driverRequest.status,
    createdAt: driverRequest.created_at || driverRequest.createdAt,
  });

  const calculateMatchScore = (load, driverRequest) => {
    let score = 50;
    if (driverRequest.bid_amount && load.price) {
      const bid = driverRequest.bid_amount;
      const loadPrice = load.price;
      if (bid <= loadPrice) score += 20;
      else if (bid <= loadPrice * 1.2) score += 10;
    }

    if (driverRequest.created_at) {
      const hoursDiff = (new Date() - new Date(driverRequest.created_at)) / 1000 / 60 / 60;
      if (hoursDiff < 24) score += 15;
    }

    if (driverRequest.message && load.loadType) {
      const msg = driverRequest.message.toLowerCase();
      const type = load.loadType.toLowerCase();
      if (msg.includes(type) || msg.includes('any') || msg.includes('available')) score += 15;
    }

    return Math.min(score, 100);
  };

  useEffect(() => {
    fetchCustomerLoads();
    fetchDriverLoadRequests();
  }, []);

  const handleRefresh = () => {
    setError('');
    setSuccess('');
    setLoading(true);
    fetchCustomerLoads();
    fetchDriverLoadRequests();
  };

  // ---------------- RENDER ----------------
  return (
    <div className="load-requests-container">
      <div className="page-header">
        <div className="header-left">
          <h1>📦 Customer Load Requests</h1>
          <p className="subtitle">Assign drivers who have submitted load requests</p>
        </div>
        <div className="header-right">
          <button className="refresh-btn" onClick={handleRefresh} disabled={loading}>
            🔄 {loading ? 'Refreshing...' : 'Refresh'}
          </button>
          <div className="stats-container">
            <div className="stat-item">
              <span className="stat-count">{customerLoads.length}</span>
              <span className="stat-label">Pending Loads</span>
            </div>
            <div className="stat-item">
              <span className="stat-count">{driverLoadRequests.length}</span>
              <span className="stat-label">Driver Requests</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      {success && (
        <div className="success-message">
          <span>✅ {success}</span>
          <button onClick={() => setSuccess('')}>✕</button>
        </div>
      )}
      {error && (
        <div className="error-message">
          <span>⚠️ {error}</span>
          <button onClick={() => setError('')}>✕</button>
        </div>
      )}

      {/* Loads Grid */}
      <div className="content-area">
        {customerLoads.length === 0 && !loading ? (
          <div className="empty-state">
            <h3>No Pending Loads</h3>
            <button onClick={handleRefresh}>Check Again</button>
          </div>
        ) : (
          <div className="loads-grid">
            {customerLoads.map((load) => (
              <div key={load.requestId || load.id} className="load-card">
                <div className="card-header">
                  <span className="badge">#LOAD{load.requestId || load.id}</span>
                  <span>{formatDate(load.createdAt)}</span>
                </div>
                <div className="load-type">{load.loadType || 'General'}</div>
                <button className="assign-btn" onClick={() => openDriverModal(load)}>
                  👥 View Driver Requests ({driverLoadRequests.length})
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Driver Modal */}
      {showDriverModal && selectedLoad && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h3>Assign Driver to Load #{selectedLoad.requestId || selectedLoad.id}</h3>
            <button onClick={closeDriverModal}>✕</button>
            {driverLoadRequests.length === 0 ? (
              <p>No driver requests yet</p>
            ) : (
              <div className="driver-requests-grid">
                {driverLoadRequests.map((driverRequest) => {
                  const driver = getDriverInfo(driverRequest);
                  const matchScore = calculateMatchScore(selectedLoad, driverRequest);
                  const isSelected = selectedDriver.id === driver.id;

                  return (
                    <div
                      key={driver.id}
                      className={`driver-request-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleDriverSelect(driverRequest)}
                    >
                      <span>{driver.name}</span> | <span>{driver.status || 'PENDING'}</span> | Match: {matchScore}%
                    </div>
                  );
                })}
              </div>
            )}

            <button
              className="btn-assign"
              onClick={assignDriverToLoad}
              disabled={!selectedDriver.id || loading}
            >
              Assign Selected Driver
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadRequests;
