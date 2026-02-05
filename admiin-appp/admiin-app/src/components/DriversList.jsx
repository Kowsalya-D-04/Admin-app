// // // src/components/DriversList.jsx
// import React, { useState, useEffect } from 'react';
// import { adminAPI } from '../api/adminApi';

// const DriversList = () => {
//   const [drivers, setDrivers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     fetchDrivers();
//   }, []);

//   const fetchDrivers = async () => {
//     try {
//       setLoading(true);
//       const response = await adminAPI.getAllDrivers();
//       setDrivers(response.data.drivers || response.data || []);
//     } catch (err) {
//       setError('Failed to load drivers');
//       console.error('DriversList Error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ APPROVE DRIVER
//   const handleApprove = async (driverId) => {
//     if (!window.confirm('Approve this driver?')) return;

//     try {
//       await adminAPI.approveDriver(driverId);
//       alert('Driver approved successfully');
//       fetchDrivers();
//     } catch (err) {
//       alert('Failed to approve driver');
//       console.error(err);
//     }
//   };

//   // ✅ DELETE DRIVER
//   const deleteDriver = async (driverId) => {
//     if (!window.confirm('Delete this driver?')) return;

//     try {
//       await adminAPI.deleteDriver(driverId);
//       setDrivers(drivers.filter(d => d.id !== driverId));
//     } catch (err) {
//       alert('Failed to delete driver');
//       console.error(err);
//     }
//   };

//   // ✅ EDIT DRIVER (simple prompt version)
//   const editDriver = async (driver) => {
//     const name = prompt('Enter name', driver.name);
//     const truckNumber = prompt('Enter truck number', driver.truckNumber);

//     if (!name || !truckNumber) return;

//     try {
//       await adminAPI.updateDriver(driver.id, {
//         ...driver,
//         name,
//         truckNumber,
//       });
//       fetchDrivers();
//     } catch (err) {
//       alert('Failed to update driver');
//       console.error(err);
//     }
//   };

//   if (loading) return <div className="loading">Loading drivers...</div>;
//   if (error) return <div className="error">{error}</div>;

//   return (
//     <div className="drivers-list">
//       <h2>Drivers List</h2>

//       <table className="data-table">
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Name</th>
//             <th>Phone</th>
//             <th>License No</th>
//             <th>Truck No</th>
//             <th>Status</th>
//             <th>Total Trips</th>
//             <th>Actions</th>
//           </tr>
//         </thead>

//         <tbody>
//           {drivers.length === 0 ? (
//             <tr>
//               <td colSpan="8" className="no-data">No drivers found</td>
//             </tr>
//           ) : (
//             drivers.map(driver => (
//               <tr key={driver.id}>
//                 <td>{driver.id}</td>
//                 <td>{driver.name}</td>
//                 <td>{driver.phone}</td>
//                 <td>{driver.licenseNumber || 'N/A'}</td>
//                 <td>{driver.truckNumber || 'N/A'}</td>
//                 <td>
//                   <span className={`status-badge status-${driver.status?.toLowerCase() || 'pending'}`}>
//                     {driver.status || 'PENDING'}
//                   </span>
//                 </td>
//                 <td>{driver.totalTrips || 0}</td>
//                 <td>
//                   {driver.status === 'PENDING' && (
//                     <button
//                       className="btn approve"
//                       onClick={() => handleApprove(driver.id)}
//                     >
//                       Approve
//                     </button>
//                   )}

//                   <button
//                     className="btn edit"
//                     onClick={() => editDriver(driver)}
//                   >
//                     Edit
//                   </button>

//                   <button
//                     className="btn delete"
//                     onClick={() => deleteDriver(driver.id)}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default DriversList;
// src/components/DriversList.jsx
// src/components/DriversList.jsx
// DriversList.jsx
// import React, { useState, useEffect } from 'react';
// import './DriversList.css';

// export default function DriversList() {
//   const [drivers, setDrivers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [expandedDriver, setExpandedDriver] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState('ALL');

//   useEffect(() => {
//     fetchDrivers();
//   }, []);

//   const fetchDrivers = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       // Direct API call to your backend
//       const response = await fetch('http://localhost:8080/api/admin/drivers');
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const result = await response.json();
//       console.log('Full API Response:', result); // Debug log
      
//       // Extract drivers array from response
//       let driversData = [];
//       if (result.success && Array.isArray(result.drivers)) {
//         driversData = result.drivers;
//       } else if (Array.isArray(result)) {
//         driversData = result;
//       }
      
//       console.log('Drivers data extracted:', driversData);
//       console.log('Number of drivers:', driversData.length);
      
//       setDrivers(driversData);
      
//     } catch (err) {
//       console.error('Error fetching drivers:', err);
//       setError('Failed to load drivers. Please check backend server.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Filter drivers based on search and status
//   const filteredDrivers = drivers.filter(driver => {
//     // Status filter
//     const statusMatch = filterStatus === 'ALL' || driver.status === filterStatus;
    
//     // Search filter
//     if (!searchTerm.trim()) return statusMatch;
    
//     const searchLower = searchTerm.toLowerCase();
//     return (
//       (driver.fullName && driver.fullName.toLowerCase().includes(searchLower)) ||
//       (driver.phoneNumber && driver.phoneNumber.includes(searchTerm)) ||
//       (driver.truckNumber && driver.truckNumber.toLowerCase().includes(searchLower)) ||
//       (driver.licenseNumber && driver.licenseNumber.toLowerCase().includes(searchLower)) ||
//       (driver.email && driver.email.toLowerCase().includes(searchLower)) ||
//       (driver.rcNumber && driver.rcNumber.toLowerCase().includes(searchLower))
//     );
//   });

//   // Pagination
//   const totalPages = Math.max(1, Math.ceil(filteredDrivers.length / itemsPerPage));
//   const currentDrivers = filteredDrivers.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   // Format date
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     try {
//       return new Date(dateString).toLocaleDateString('en-IN');
//     } catch {
//       return dateString;
//     }
//   };

//   // Handle action buttons
//   const handleApprove = async (driverId) => {
//     if (window.confirm('Are you sure you want to approve this driver?')) {
//       try {
//         const response = await fetch(`http://localhost:8080/api/admin/drivers/${driverId}/approve`, {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });
        
//         if (response.ok) {
//           alert('Driver approved successfully!');
//           fetchDrivers();
//         } else {
//           alert('Failed to approve driver');
//         }
//       } catch (error) {
//         alert('Error approving driver');
//       }
//     }
//   };

//   const handleReject = async (driverId) => {
//     if (window.confirm('Are you sure you want to reject this driver?')) {
//       try {
//         const response = await fetch(`http://localhost:8080/api/admin/drivers/${driverId}/reject`, {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });
        
//         if (response.ok) {
//           alert('Driver rejected successfully!');
//           fetchDrivers();
//         } else {
//           alert('Failed to reject driver');
//         }
//       } catch (error) {
//         alert('Error rejecting driver');
//       }
//     }
//   };

//   const handleBlock = async (driverId) => {
//     if (window.confirm('Are you sure you want to block this driver?')) {
//       try {
//         const response = await fetch(`http://localhost:8080/api/admin/drivers/${driverId}/block`, {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });
        
//         if (response.ok) {
//           alert('Driver blocked successfully!');
//           fetchDrivers();
//         } else {
//           alert('Failed to block driver');
//         }
//       } catch (error) {
//         alert('Error blocking driver');
//       }
//     }
//   };

//   if (loading) return (
//     <div className="loading-container">
//       <div className="spinner"></div>
//       <p>Loading drivers...</p>
//     </div>
//   );

//   if (error) return (
//     <div className="error-container">
//       <p className="error-message">❌ {error}</p>
//       <button onClick={fetchDrivers} className="retry-btn">
//         Retry
//       </button>
//     </div>
//   );

//   return (
//     <div className="drivers-container">
//       <div className="header-section">
//         <h2>🚚 Drivers Management</h2>
//         <div className="stats">
//           <span className="stat-badge total">Total: {drivers.length}</span>
//           <span className="stat-badge active">Active: {drivers.filter(d => d.status === 'ACTIVE').length}</span>
//           <span className="stat-badge pending">Pending: {drivers.filter(d => d.status === 'PENDING').length}</span>
//         </div>
//       </div>

//       {/* Controls */}
//       <div className="drivers-controls">
//         <div className="search-box">
//           <input
//             type="text"
//             placeholder="Search by name, phone, truck, license..."
//             value={searchTerm}
//             onChange={(e) => {
//               setSearchTerm(e.target.value);
//               setCurrentPage(1);
//             }}
//             className="search-input"
//           />
//           <span className="search-icon">🔍</span>
//         </div>
        
//         <select 
//           value={filterStatus} 
//           onChange={(e) => {
//             setFilterStatus(e.target.value);
//             setCurrentPage(1);
//           }}
//           className="status-filter"
//         >
//           <option value="ALL">All Status</option>
//           <option value="PENDING">Pending</option>
//           <option value="ACTIVE">Active</option>
//           <option value="BLOCKED">Blocked</option>
//           <option value="REJECTED">Rejected</option>
//         </select>
        
//         <button onClick={fetchDrivers} className="refresh-btn">
//           🔄 Refresh
//         </button>
//       </div>

//       {/* Drivers Table */}
//       <div className="table-container">
//         {filteredDrivers.length === 0 ? (
//           <div className="no-data">
//             <p>📭 No drivers found {searchTerm ? 'matching "' + searchTerm + '"' : ''}</p>
//           </div>
//         ) : (
//           <>
//             <table className="drivers-table">
//               <thead>
//                 <tr>
//                   <th>ID</th>
//                   <th>Driver Name</th>
//                   <th>Phone</th>
//                   <th>Truck No</th>
//                   <th>Status</th>
//                   <th>Rating</th>
//                   <th>Trips</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentDrivers.map(driver => (
//                   <React.Fragment key={driver.driverId}>
//                     <tr className="driver-row">
//                       <td className="driver-id">{driver.driverId}</td>
//                       <td className="driver-name">
//                         <div className="name-cell">
//                           <img 
//                             src={driver.driverPhotoUrl} 
//                             alt={driver.fullName}
//                             className="driver-thumb"
//                             onError={(e) => {
//                               e.target.src = 'https://via.placeholder.com/40/cccccc/ffffff?text=Driver';
//                             }}
//                           />
//                           <div>
//                             <strong>{driver.fullName}</strong>
//                             <small>{driver.email}</small>
//                           </div>
//                         </div>
//                       </td>
//                       <td>{driver.phoneNumber}</td>
//                       <td className="truck-info">
//                         {driver.truckNumber}
//                         {driver.truckMake && <small>{driver.truckMake} {driver.truckModel}</small>}
//                       </td>
//                       <td>
//                         <span className={`status-badge status-${driver.status?.toLowerCase() || 'pending'}`}>
//                           {driver.status || 'PENDING'}
//                         </span>
//                       </td>
//                       <td className="rating-cell">
//                         <span className="rating-value">
//                           {driver.rating?.toFixed(1) || '0.0'} ⭐
//                         </span>
//                       </td>
//                       <td>
//                         <div className="trip-stats">
//                           <span className="completed">✓ {driver.completedTrips || 0}</span>
//                           <span className="total">/ {driver.totalTrips || 0}</span>
//                         </div>
//                       </td>
//                       <td>
//                         <button 
//                           onClick={() => setExpandedDriver(
//                             expandedDriver === driver.driverId ? null : driver.driverId
//                           )}
//                           className={`details-btn ${expandedDriver === driver.driverId ? 'active' : ''}`}
//                         >
//                           {expandedDriver === driver.driverId ? '▲ Hide' : '▼ Details'}
//                         </button>
//                       </td>
//                     </tr>

//                     {/* Expanded Details Row */}
//                     {expandedDriver === driver.driverId && (
//                       <tr className="details-expanded-row">
//                         <td colSpan="8">
//                           <div className="driver-details-panel">
//                             <div className="details-header">
//                               <h3>Driver Details - {driver.fullName}</h3>
//                               <span className="driver-id">ID: {driver.driverId}</span>
//                             </div>
                            
//                             <div className="details-grid">
//                               {/* Personal Information */}
//                               <div className="detail-card">
//                                 <h4>👤 Personal Information</h4>
//                                 <div className="detail-item">
//                                   <label>Full Name:</label>
//                                   <span>{driver.fullName}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                   <label>Phone:</label>
//                                   <span>{driver.phoneNumber}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                   <label>Email:</label>
//                                   <span>{driver.email}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                   <label>Address:</label>
//                                   <span>{driver.address}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                   <label>Registered Date:</label>
//                                   <span>{formatDate(driver.registeredAt)}</span>
//                                 </div>
//                               </div>

//                               {/* Truck Information */}
//                               <div className="detail-card">
//                                 <h4>🚚 Truck Details</h4>
//                                 <div className="detail-item">
//                                   <label>Truck Number:</label>
//                                   <span>{driver.truckNumber}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                   <label>Truck Type:</label>
//                                   <span>{driver.truckType}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                   <label>Make & Model:</label>
//                                   <span>{driver.truckMake} {driver.truckModel}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                   <label>Year:</label>
//                                   <span>{driver.truckYear}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                   <label>Color:</label>
//                                   <span>{driver.truckColor}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                   <label>Capacity:</label>
//                                   <span>{driver.truckCapacity}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                   <label>Fuel Type:</label>
//                                   <span>{driver.fuelType}</span>
//                                 </div>
//                               </div>

//                               {/* Documents */}
//                               <div className="detail-card">
//                                 <h4>📄 Documents</h4>
//                                 <div className="detail-item">
//                                   <label>License Number:</label>
//                                   <span>{driver.licenseNumber}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                   <label>RC Number:</label>
//                                   <span>{driver.rcNumber}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                   <label>Insurance Number:</label>
//                                   <span>{driver.insuranceNumber}</span>
//                                 </div>
//                               </div>

//                               {/* Statistics */}
//                               <div className="detail-card">
//                                 <h4>📊 Statistics</h4>
//                                 <div className="detail-item">
//                                   <label>Rating:</label>
//                                   <span className="rating-badge">{driver.rating?.toFixed(1) || '0.0'} ⭐</span>
//                                 </div>
//                                 <div className="detail-item">
//                                   <label>Completed Trips:</label>
//                                   <span>{driver.completedTrips || 0}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                   <label>Total Trips:</label>
//                                   <span>{driver.totalTrips || 0}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                   <label>Total Earnings:</label>
//                                   <span className="earnings">₹{driver.totalEarnings?.toFixed(2) || '0.00'}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                   <label>Status:</label>
//                                   <span className={`status-text status-${driver.status?.toLowerCase()}`}>
//                                     {driver.status}
//                                   </span>
//                                 </div>
//                               </div>
//                             </div>

//                             {/* Document Images */}
//                             <div className="documents-section">
//                               <h4>📷 Document Images</h4>
//                               <div className="documents-grid">
//                                 <div className="document-item">
//                                   <p>Driver Photo</p>
//                                   <img 
//                                     src={driver.driverPhotoUrl} 
//                                     alt="Driver" 
//                                     onError={(e) => {
//                                       e.target.src = 'https://via.placeholder.com/150/cccccc/ffffff?text=No+Driver+Photo';
//                                     }}
//                                   />
//                                 </div>
                                
//                                 <div className="document-item">
//                                   <p>License</p>
//                                   <img 
//                                     src={driver.licenseImageUrl} 
//                                     alt="License" 
//                                     onError={(e) => {
//                                       e.target.src = 'https://via.placeholder.com/150/cccccc/ffffff?text=No+License';
//                                     }}
//                                   />
//                                 </div>
                                
//                                 <div className="document-item">
//                                   <p>RC Book</p>
//                                   <img 
//                                     src={driver.rcBookUrl} 
//                                     alt="RC Book" 
//                                     onError={(e) => {
//                                       e.target.src = 'https://via.placeholder.com/150/cccccc/ffffff?text=No+RC';
//                                     }}
//                                   />
//                                 </div>
                                
//                                 <div className="document-item">
//                                   <p>Insurance</p>
//                                   <img 
//                                     src={driver.insuranceUrl} 
//                                     alt="Insurance" 
//                                     onError={(e) => {
//                                       e.target.src = 'https://via.placeholder.com/150/cccccc/ffffff?text=No+Insurance';
//                                     }}
//                                   />
//                                 </div>
                                
//                                 <div className="document-item">
//                                   <p>Truck Photo</p>
//                                   <img 
//                                     src={driver.truckImageUrl} 
//                                     alt="Truck" 
//                                     onError={(e) => {
//                                       e.target.src = 'https://via.placeholder.com/150/cccccc/ffffff?text=No+Truck+Photo';
//                                     }}
//                                   />
//                                 </div>
//                               </div>
//                             </div>

//                             {/* Action Buttons */}
//                             <div className="action-buttons">
//                               <button className="btn-edit">✏️ Edit Driver</button>
//                               {driver.status === 'PENDING' && (
//                                 <>
//                                   <button 
//                                     className="btn-approve"
//                                     onClick={() => handleApprove(driver.driverId)}
//                                   >
//                                     ✅ Approve
//                                   </button>
//                                   <button 
//                                     className="btn-reject"
//                                     onClick={() => handleReject(driver.driverId)}
//                                   >
//                                     ❌ Reject
//                                   </button>
//                                 </>
//                               )}
//                               {driver.status === 'ACTIVE' && (
//                                 <button 
//                                   className="btn-block"
//                                   onClick={() => handleBlock(driver.driverId)}
//                                 >
//                                   🚫 Block
//                                 </button>
//                               )}
//                               {driver.status === 'BLOCKED' && (
//                                 <button className="btn-unblock">🔓 Unblock</button>
//                               )}
//                               <button className="btn-delete">🗑️ Delete</button>
//                             </div>
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </React.Fragment>
//                 ))}
//               </tbody>
//             </table>

//             {/* Pagination */}
//             <div className="pagination">
//               <button 
//                 disabled={currentPage === 1} 
//                 onClick={() => setCurrentPage(p => p - 1)}
//                 className="pagination-btn prev"
//               >
//                 ← Previous
//               </button>
              
//               <div className="page-info">
//                 Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
//                 <span className="total-count">• {filteredDrivers.length} drivers</span>
//               </div>
              
//               <button 
//                 disabled={currentPage === totalPages} 
//                 onClick={() => setCurrentPage(p => p + 1)}
//                 className="pagination-btn next"
//               >
//                 Next →
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }




// import React, { useState, useEffect } from 'react';
// import './DriversList.css';

// export default function DriversList() {
//   const [drivers, setDrivers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [expandedDriver, setExpandedDriver] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState('ALL');

//   useEffect(() => {
//     fetchDrivers();
//   }, []);

//   const fetchDrivers = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const response = await fetch('http://localhost:8080/api/admin/drivers');
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const result = await response.json();
//       console.log('Full API Response:', result);
      
//       let driversData = [];
//       if (result.success && Array.isArray(result.drivers)) {
//         driversData = result.drivers;
//       } else if (Array.isArray(result)) {
//         driversData = result;
//       }
      
//       console.log('Number of drivers:', driversData.length);
      
//       // Check image URLs for each driver
//       driversData.forEach(driver => {
//         console.log(`Driver ${driver.driverId} - Driver Photo: ${driver.driverPhotoUrl}`);
//         console.log(`Driver ${driver.driverId} - License: ${driver.licenseImageUrl}`);
//         console.log(`Driver ${driver.driverId} - RC: ${driver.rcBookUrl}`);
//         console.log(`Driver ${driver.driverId} - Insurance: ${driver.insuranceUrl}`);
//         console.log(`Driver ${driver.driverId} - Truck: ${driver.truckImageUrl}`);
//       });
      
//       setDrivers(driversData);
      
//     } catch (err) {
//       console.error('Error fetching drivers:', err);
//       setError('Failed to load drivers. Please check backend server.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Check if image URL is a real uploaded image or default
//   const isRealImage = (url) => {
//     if (!url) return false;
//     // Real uploaded images have timestamp in filename like "1767976173290_Truc.jpg"
//     // Default images are like "default-driver.png"
//     return !url.includes('default-');
//   };

//   // Get image URL with fallback
//   const getImageUrl = (url, type) => {
//     if (isRealImage(url)) {
//       return url;
//     }
    
//     // Return appropriate placeholder based on type
//     const placeholders = {
//       'driver': 'https://via.placeholder.com/150/cccccc/ffffff?text=Driver+Photo',
//       'license': 'https://via.placeholder.com/150/cccccc/ffffff?text=License',
//       'rc': 'https://via.placeholder.com/150/cccccc/ffffff?text=RC+Book',
//       'insurance': 'https://via.placeholder.com/150/cccccc/ffffff?text=Insurance',
//       'truck': 'https://via.placeholder.com/150/cccccc/ffffff?text=Truck+Photo'
//     };
    
//     return placeholders[type] || 'https://via.placeholder.com/150/cccccc/ffffff?text=Image';
//   };

//   // Filter drivers
//   const filteredDrivers = drivers.filter(driver => {
//     const statusMatch = filterStatus === 'ALL' || driver.status === filterStatus;
    
//     if (!searchTerm.trim()) return statusMatch;
    
//     const searchLower = searchTerm.toLowerCase();
//     return (
//       (driver.fullName && driver.fullName.toLowerCase().includes(searchLower)) ||
//       (driver.phoneNumber && driver.phoneNumber.includes(searchTerm)) ||
//       (driver.truckNumber && driver.truckNumber.toLowerCase().includes(searchLower)) ||
//       (driver.licenseNumber && driver.licenseNumber.toLowerCase().includes(searchLower)) ||
//       (driver.email && driver.email.toLowerCase().includes(searchLower))
//     );
//   });

//   // Pagination
//   const totalPages = Math.max(1, Math.ceil(filteredDrivers.length / itemsPerPage));
//   const currentDrivers = filteredDrivers.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const formatDate = (dateString) => {
//     if (!dateString) return 'Not available';
//     try {
//       return new Date(dateString).toLocaleDateString('en-IN', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit'
//       });
//     } catch {
//       return dateString;
//     }
//   };

//   if (loading) return (
//     <div className="loading-container">
//       <div className="spinner"></div>
//       <p>Loading drivers...</p>
//     </div>
//   );

//   if (error) return (
//     <div className="error-container">
//       <p className="error-message">❌ {error}</p>
//       <button onClick={fetchDrivers} className="retry-btn">
//         Retry
//       </button>
//     </div>
//   );

//   return (
//     <div className="drivers-container">
//       <div className="header-section">
//         <h2>🚚 Drivers Management</h2>
//         <div className="stats">
//           <span className="stat-badge total">Total: {drivers.length}</span>
//           <span className="stat-badge active">Active: {drivers.filter(d => d.status === 'ACTIVE').length}</span>
//           <span className="stat-badge pending">Pending: {drivers.filter(d => d.status === 'PENDING').length}</span>
//         </div>
//       </div>

//       <div className="drivers-controls">
//         <div className="search-box">
//           <input
//             type="text"
//             placeholder="Search by name, phone, truck, license..."
//             value={searchTerm}
//             onChange={(e) => {
//               setSearchTerm(e.target.value);
//               setCurrentPage(1);
//             }}
//             className="search-input"
//           />
//           <span className="search-icon">🔍</span>
//         </div>
        
//         <select 
//           value={filterStatus} 
//           onChange={(e) => {
//             setFilterStatus(e.target.value);
//             setCurrentPage(1);
//           }}
//           className="status-filter"
//         >
//           <option value="ALL">All Status</option>
//           <option value="PENDING">Pending</option>
//           <option value="ACTIVE">Active</option>
//           <option value="BLOCKED">Blocked</option>
//         </select>
        
//         <button onClick={fetchDrivers} className="refresh-btn">
//           🔄 Refresh
//         </button>
//       </div>

//       <div className="table-container">
//         {filteredDrivers.length === 0 ? (
//           <div className="no-data">
//             <p>📭 No drivers found {searchTerm ? 'matching "' + searchTerm + '"' : ''}</p>
//           </div>
//         ) : (
//           <>
//             <table className="drivers-table">
//               <thead>
//                 <tr>
//                   <th>ID</th>
//                   <th>Driver Name</th>
//                   <th>Phone</th>
//                   <th>Truck No</th>
//                   <th>Status</th>
//                   <th>Rating</th>
//                   <th>Trips</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentDrivers.map(driver => (
//                   <React.Fragment key={driver.driverId}>
//                     <tr className="driver-row">
//                       <td className="driver-id">{driver.driverId}</td>
//                       <td className="driver-name">
//                         <div className="name-cell">
//                           <img 
//                             src={getImageUrl(driver.driverPhotoUrl, 'driver')}
//                             alt={driver.fullName}
//                             className="driver-thumb"
//                           />
//                           <div>
//                             <strong>{driver.fullName}</strong>
//                             <small>{driver.email}</small>
//                           </div>
//                         </div>
//                       </td>
//                       <td>{driver.phoneNumber}</td>
//                       <td className="truck-info">
//                         {driver.truckNumber}
//                         <small>{driver.truckMake} {driver.truckModel} • {driver.truckType}</small>
//                       </td>
//                       <td>
//                         <span className={`status-badge status-${driver.status?.toLowerCase()}`}>
//                           {driver.status}
//                         </span>
//                       </td>
//                       <td className="rating-cell">
//                         <span className="rating-value">
//                           {driver.rating?.toFixed(1) || '0.0'} ⭐
//                         </span>
//                       </td>
//                       <td>
//                         <div className="trip-stats">
//                           <span className="completed">✓ {driver.completedTrips || 0}</span>
//                           <span className="total">/ {driver.totalTrips || 0}</span>
//                         </div>
//                       </td>
//                       <td>
//                         <button 
//                           onClick={() => setExpandedDriver(
//                             expandedDriver === driver.driverId ? null : driver.driverId
//                           )}
//                           className={`details-btn ${expandedDriver === driver.driverId ? 'active' : ''}`}
//                         >
//                           {expandedDriver === driver.driverId ? '▲ Hide' : '▼ Details'}
//                         </button>
//                       </td>
//                     </tr>

//                     {expandedDriver === driver.driverId && (
//                       <tr className="details-expanded-row">
//                         <td colSpan="8">
//                           <div className="driver-details-panel">
//                             <div className="details-header">
//                               <h3>Driver Details - {driver.fullName}</h3>
//                               <span className="driver-id">ID: {driver.driverId}</span>
//                             </div>
                            
//                             <div className="details-grid">
//                               <div className="detail-card">
//                                 <h4>👤 Personal Information</h4>
//                                 <div className="detail-item">
//                                   <label>Full Name:</label>
//                                   <span>{driver.fullName}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                   <label>Phone:</label>
//                                   <span>{driver.phoneNumber}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                   <label>Email:</label>
//                                   <span>{driver.email}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                   <label>Address:</label>
//                                   <span>{driver.address}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                   <label>Registered:</label>
//                                   <span>{formatDate(driver.registeredAt)}</span>
//                                 </div>
//                               </div>

//                               <div className="detail-card">
//                                 <h4>🚚 Truck Details</h4>
//                                 <div className="detail-item">
//                                   <label>Truck Number:</label>
//                                   <span>{driver.truckNumber}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                   <label>Truck Type:</label>
//                                   <span>{driver.truckType}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                   <label>Make & Model:</label>
//                                   <span>{driver.truckMake} {driver.truckModel}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                   <label>Year:</label>
//                                   <span>{driver.truckYear}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                   <label>Color:</label>
//                                   <span>{driver.truckColor}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                   <label>Capacity:</label>
//                                   <span>{driver.truckCapacity}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                   <label>Fuel Type:</label>
//                                   <span>{driver.fuelType}</span>
//                                 </div>
//                               </div>

//                               <div className="detail-card">
//                                 <h4>📄 Documents</h4>
//                                 <div className="detail-item">
//                                   <label>License Number:</label>
//                                   <span>{driver.licenseNumber}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                   <label>RC Number:</label>
//                                   <span>{driver.rcNumber}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                   <label>Insurance Number:</label>
//                                   <span>{driver.insuranceNumber}</span>
//                                 </div>
//                               </div>

//                               <div className="detail-card">
//                                 <h4>📊 Statistics</h4>
//                                 <div className="detail-item">
//                                   <label>Rating:</label>
//                                   <span className="rating-badge">{driver.rating?.toFixed(1) || '0.0'} ⭐</span>
//                                 </div>
//                                 <div className="detail-item">
//                                   <label>Completed Trips:</label>
//                                   <span>{driver.completedTrips || 0}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                   <label>Total Trips:</label>
//                                   <span>{driver.totalTrips || 0}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                   <label>Total Earnings:</label>
//                                   <span className="earnings">₹{driver.totalEarnings?.toFixed(2) || '0.00'}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                   <label>Status:</label>
//                                   <span className={`status-text status-${driver.status?.toLowerCase()}`}>
//                                     {driver.status}
//                                   </span>
//                                 </div>
//                               </div>
//                             </div>

//                             <div className="documents-section">
//                               <h4>📷 Document Images</h4>
//                               <div className="documents-grid">
//                                 <div className="document-item">
//                                   <p>Driver Photo {isRealImage(driver.driverPhotoUrl) ? '✅' : '🟡'}</p>
//                                   <img 
//                                     src={getImageUrl(driver.driverPhotoUrl, 'driver')}
//                                     alt="Driver" 
//                                   />
//                                 </div>
                                
//                                 <div className="document-item">
//                                   <p>License {isRealImage(driver.licenseImageUrl) ? '✅' : '🟡'}</p>
//                                   <img 
//                                     src={getImageUrl(driver.licenseImageUrl, 'license')}
//                                     alt="License" 
//                                   />
//                                 </div>
                                
//                                 <div className="document-item">
//                                   <p>RC Book {isRealImage(driver.rcBookUrl) ? '✅' : '🟡'}</p>
//                                   <img 
//                                     src={getImageUrl(driver.rcBookUrl, 'rc')}
//                                     alt="RC Book" 
//                                   />
//                                 </div>
                                
//                                 <div className="document-item">
//                                   <p>Insurance {isRealImage(driver.insuranceUrl) ? '✅' : '🟡'}</p>
//                                   <img 
//                                     src={getImageUrl(driver.insuranceUrl, 'insurance')}
//                                     alt="Insurance" 
//                                   />
//                                 </div>
                                
//                                 <div className="document-item">
//                                   <p>Truck Photo {isRealImage(driver.truckImageUrl) ? '✅' : '🟡'}</p>
//                                   <img 
//                                     src={getImageUrl(driver.truckImageUrl, 'truck')}
//                                     alt="Truck" 
//                                   />
//                                 </div>
//                               </div>
//                               <p className="image-note">
//                                 ✅ = Uploaded image • 🟡 = Default/Placeholder
//                               </p>
//                             </div>

//                             <div className="action-buttons">
//                               <button className="btn-edit">✏️ Edit</button>
//                               {driver.status === 'PENDING' && (
//                                 <>
//                                   <button className="btn-approve">✅ Approve</button>
//                                   <button className="btn-reject">❌ Reject</button>
//                                 </>
//                               )}
//                               {driver.status === 'ACTIVE' && (
//                                 <button className="btn-block">🚫 Block</button>
//                               )}
//                               {driver.status === 'BLOCKED' && (
//                                 <button className="btn-unblock">🔓 Unblock</button>
//                               )}
//                               <button className="btn-view">👁️ View Full</button>
//                             </div>
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </React.Fragment>
//                 ))}
//               </tbody>
//             </table>

//             <div className="pagination">
//               <button 
//                 disabled={currentPage === 1} 
//                 onClick={() => setCurrentPage(p => p - 1)}
//                 className="pagination-btn prev"
//               >
//                 ← Previous
//               </button>
              
//               <div className="page-info">
//                 Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
//                 <span className="total-count">• {filteredDrivers.length} drivers</span>
//               </div>
              
//               <button 
//                 disabled={currentPage === totalPages} 
//                 onClick={() => setCurrentPage(p => p + 1)}
//                 className="pagination-btn next"
//               >
//                 Next →
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }
// import React, { useState, useEffect } from 'react';
// import './DriversList.css';

// export default function DriversList() {
//   const [drivers, setDrivers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [expandedDriver, setExpandedDriver] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState('ALL');

//   // 🔥 ADD ACTION FUNCTIONS HERE
//   const handleEdit = (driverId) => {
//     alert(`Edit driver ${driverId}`);
//     // Open edit modal or redirect to edit page
//   };

//   const handleApprove = async (driverId) => {
//     if (window.confirm(`Are you sure you want to approve driver ${driverId}?`)) {
//       try {
//         const response = await fetch(`http://localhost:8080/api/admin/drivers/${driverId}/approve`, {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });
        
//         if (response.ok) {
//           alert('Driver approved successfully!');
//           fetchDrivers(); // Refresh the list
//         } else {
//           alert('Failed to approve driver');
//         }
//       } catch (error) {
//         alert('Error approving driver: ' + error.message);
//       }
//     }
//   };

//   const handleReject = async (driverId) => {
//     if (window.confirm(`Are you sure you want to reject driver ${driverId}?`)) {
//       try {
//         const response = await fetch(`http://localhost:8080/api/admin/drivers/${driverId}/reject`, {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });
        
//         if (response.ok) {
//           alert('Driver rejected successfully!');
//           fetchDrivers();
//         } else {
//           alert('Failed to reject driver');
//         }
//       } catch (error) {
//         alert('Error rejecting driver: ' + error.message);
//       }
//     }
//   };

//   const handleDelete = async (driverId) => {
//     if (window.confirm(`Are you sure you want to delete driver ${driverId}?`)) {
//       try {
//         const response = await fetch(`http://localhost:8080/api/admin/drivers/${driverId}`, {
//           method: 'DELETE',
//         });
        
//         if (response.ok) {
//           alert('Driver deleted successfully!');
//           fetchDrivers();
//         } else {
//           alert('Failed to delete driver');
//         }
//       } catch (error) {
//         alert('Error deleting driver: ' + error.message);
//       }
//     }
//   };

//   const handleBlock = async (driverId) => {
//     if (window.confirm(`Are you sure you want to block driver ${driverId}?`)) {
//       try {
//         const response = await fetch(`http://localhost:8080/api/admin/drivers/${driverId}/block`, {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });
        
//         if (response.ok) {
//           alert('Driver blocked successfully!');
//           fetchDrivers();
//         } else {
//           alert('Failed to block driver');
//         }
//       } catch (error) {
//         alert('Error blocking driver: ' + error.message);
//       }
//     }
//   };

//   const handleUnblock = async (driverId) => {
//     if (window.confirm(`Are you sure you want to unblock driver ${driverId}?`)) {
//       try {
//         const response = await fetch(`http://localhost:8080/api/admin/drivers/${driverId}/unblock`, {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });
        
//         if (response.ok) {
//           alert('Driver unblocked successfully!');
//           fetchDrivers();
//         } else {
//           alert('Failed to unblock driver');
//         }
//       } catch (error) {
//         alert('Error unblocking driver: ' + error.message);
//       }
//     }
//   };

//   useEffect(() => {
//     fetchDrivers();
//   }, []);

//   const fetchDrivers = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const response = await fetch('http://localhost:8080/api/admin/drivers');
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const result = await response.json();
//       console.log('Full API Response:', result);
      
//       let driversData = [];
//       if (result.success && Array.isArray(result.drivers)) {
//         driversData = result.drivers;
//       } else if (Array.isArray(result)) {
//         driversData = result;
//       }
      
//       console.log('Number of drivers:', driversData.length);
      
//       setDrivers(driversData);
      
//     } catch (err) {
//       console.error('Error fetching drivers:', err);
//       setError('Failed to load drivers. Please check backend server.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Check if image URL is a real uploaded image or default
//   const isRealImage = (url) => {
//     if (!url) return false;
//     return !url.includes('default-');
//   };

//   // Get image URL with fallback
//   const getImageUrl = (url, type) => {
//     if (isRealImage(url)) {
//       return url;
//     }
    
//     // Return appropriate placeholder based on type
//     const placeholders = {
//       'driver': 'https://via.placeholder.com/150/cccccc/ffffff?text=Driver+Photo',
//       'license': 'https://via.placeholder.com/150/cccccc/ffffff?text=License',
//       'rc': 'https://via.placeholder.com/150/cccccc/ffffff?text=RC+Book',
//       'insurance': 'https://via.placeholder.com/150/cccccc/ffffff?text=Insurance',
//       'truck': 'https://via.placeholder.com/150/cccccc/ffffff?text=Truck+Photo'
//     };
    
//     return placeholders[type] || 'https://via.placeholder.com/150/cccccc/ffffff?text=Image';
//   };

//   // Filter drivers
//   const filteredDrivers = drivers.filter(driver => {
//     const statusMatch = filterStatus === 'ALL' || driver.status === filterStatus;
    
//     if (!searchTerm.trim()) return statusMatch;
    
//     const searchLower = searchTerm.toLowerCase();
//     return (
//       (driver.fullName && driver.fullName.toLowerCase().includes(searchLower)) ||
//       (driver.phoneNumber && driver.phoneNumber.includes(searchTerm)) ||
//       (driver.truckNumber && driver.truckNumber.toLowerCase().includes(searchLower)) ||
//       (driver.licenseNumber && driver.licenseNumber.toLowerCase().includes(searchLower)) ||
//       (driver.email && driver.email.toLowerCase().includes(searchLower))
//     );
//   });

//   // Pagination
//   const totalPages = Math.max(1, Math.ceil(filteredDrivers.length / itemsPerPage));
//   const currentDrivers = filteredDrivers.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const formatDate = (dateString) => {
//     if (!dateString) return 'Not available';
//     try {
//       return new Date(dateString).toLocaleDateString('en-IN', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit'
//       });
//     } catch {
//       return dateString;
//     }
//   };

//   if (loading) return (
//     <div className="loading-container">
//       <div className="spinner"></div>
//       <p>Loading drivers...</p>
//     </div>
//   );

//   if (error) return (
//     <div className="error-container">
//       <p className="error-message">❌ {error}</p>
//       <button onClick={fetchDrivers} className="retry-btn">
//         Retry
//       </button>
//     </div>
//   );

//   return (
//     <div className="drivers-container">
//       <div className="header-section">
//         <h2>🚚 Drivers Management</h2>
//         <div className="stats">
//           <span className="stat-badge total">Total: {drivers.length}</span>
//           <span className="stat-badge active">Active: {drivers.filter(d => d.status === 'ACTIVE').length}</span>
//           <span className="stat-badge pending">Pending: {drivers.filter(d => d.status === 'PENDING').length}</span>
//         </div>
//       </div>

//       <div className="drivers-controls">
//         <div className="search-box">
//           <input
//             type="text"
//             placeholder="Search by name, phone, truck, license..."
//             value={searchTerm}
//             onChange={(e) => {
//               setSearchTerm(e.target.value);
//               setCurrentPage(1);
//             }}
//             className="search-input"
//           />
//           <span className="search-icon">🔍</span>
//         </div>
        
//         <select 
//           value={filterStatus} 
//           onChange={(e) => {
//             setFilterStatus(e.target.value);
//             setCurrentPage(1);
//           }}
//           className="status-filter"
//         >
//           <option value="ALL">All Status</option>
//           <option value="PENDING">Pending</option>
//           <option value="ACTIVE">Active</option>
//           <option value="BLOCKED">Blocked</option>
//           <option value="REJECTED">Rejected</option>
//         </select>
        
//         <button onClick={fetchDrivers} className="refresh-btn">
//           🔄 Refresh
//         </button>
//       </div>

//       <div className="table-container">
//         {filteredDrivers.length === 0 ? (
//           <div className="no-data">
//             <p>📭 No drivers found {searchTerm ? 'matching "' + searchTerm + '"' : ''}</p>
//           </div>
//         ) : (
//           <>
//             <table className="drivers-table">
//               <thead>
//                 <tr>
//                   <th>ID</th>
//                   <th>Driver Name</th>
//                   <th>Phone</th>
//                   <th>Truck No</th>
//                   <th>Status</th>
//                   <th>Rating</th>
//                   <th>Trips</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentDrivers.map(driver => (
//                   <React.Fragment key={driver.driverId}>
//                     <tr className="driver-row">
//                       <td className="driver-id">{driver.driverId}</td>
//                       <td className="driver-name">
//                         <div className="name-cell">
//                           <img 
//                             src={getImageUrl(driver.driverPhotoUrl, 'driver')}
//                             alt={driver.fullName}
//                             className="driver-thumb"
//                           />
//                           <div>
//                             <strong>{driver.fullName}</strong>
//                             <small>{driver.email}</small>
//                           </div>
//                         </div>
//                       </td>
//                       <td>{driver.phoneNumber}</td>
//                       <td className="truck-info">
//                         {driver.truckNumber}
//                         <small>{driver.truckMake} {driver.truckModel} • {driver.truckType}</small>
//                       </td>
//                       <td>
//                         <span className={`status-badge status-${driver.status?.toLowerCase()}`}>
//                           {driver.status}
//                         </span>
//                       </td>
//                       <td className="rating-cell">
//                         <span className="rating-value">
//                           {driver.rating?.toFixed(1) || '0.0'} ⭐
//                         </span>
//                       </td>
//                       <td>
//                         <div className="trip-stats">
//                           <span className="completed">✓ {driver.completedTrips || 0}</span>
//                           <span className="total">/ {driver.totalTrips || 0}</span>
//                         </div>
//                       </td>
//                       <td>
//                         <button 
//                           onClick={() => setExpandedDriver(
//                             expandedDriver === driver.driverId ? null : driver.driverId
//                           )}
//                           className={`details-btn ${expandedDriver === driver.driverId ? 'active' : ''}`}
//                         >
//                           {expandedDriver === driver.driverId ? '▲ Hide' : '▼ Details'}
//                         </button>
//                       </td>
//                     </tr>

//                     {expandedDriver === driver.driverId && (
//                       <tr className="details-expanded-row">
//                         <td colSpan="8">
//                           <div className="driver-details-panel">
//                             <div className="details-header">
//                               <h3>Driver Details - {driver.fullName}</h3>
//                               <span className="driver-id">ID: {driver.driverId}</span>
//                             </div>
                            
//                             <div className="details-grid">
//                               <div className="detail-card">
//                                 <h4>👤 Personal Information</h4>
//                                 <div className="detail-item">
//                                   <label>Full Name:</label>
//                                   <span>{driver.fullName}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                   <label>Phone:</label>
//                                   <span>{driver.phoneNumber}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                   <label>Email:</label>
//                                   <span>{driver.email}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                   <label>Address:</label>
//                                   <span>{driver.address}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                   <label>Registered:</label>
//                                   <span>{formatDate(driver.registeredAt)}</span>
//                                 </div>
//                               </div>

//                               <div className="detail-card">
//                                 <h4>🚚 Truck Details</h4>
//                                 <div className="detail-item">
//                                   <label>Truck Number:</label>
//                                   <span>{driver.truckNumber}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                   <label>Truck Type:</label>
//                                   <span>{driver.truckType}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                   <label>Make & Model:</label>
//                                   <span>{driver.truckMake} {driver.truckModel}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                   <label>Year:</label>
//                                   <span>{driver.truckYear}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                   <label>Color:</label>
//                                   <span>{driver.truckColor}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                   <label>Capacity:</label>
//                                   <span>{driver.truckCapacity}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                   <label>Fuel Type:</label>
//                                   <span>{driver.fuelType}</span>
//                                 </div>
//                               </div>

//                               <div className="detail-card">
//                                 <h4>📄 Documents</h4>
//                                 <div className="detail-item">
//                                   <label>License Number:</label>
//                                   <span>{driver.licenseNumber}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                   <label>RC Number:</label>
//                                   <span>{driver.rcNumber}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                   <label>Insurance Number:</label>
//                                   <span>{driver.insuranceNumber}</span>
//                                 </div>
//                               </div>

//                               <div className="detail-card">
//                                 <h4>📊 Statistics</h4>
//                                 <div className="detail-item">
//                                   <label>Rating:</label>
//                                   <span className="rating-badge">{driver.rating?.toFixed(1) || '0.0'} ⭐</span>
//                                 </div>
//                                 <div className="detail-item">
//                                   <label>Completed Trips:</label>
//                                   <span>{driver.completedTrips || 0}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                   <label>Total Trips:</label>
//                                   <span>{driver.totalTrips || 0}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                   <label>Total Earnings:</label>
//                                   <span className="earnings">₹{driver.totalEarnings?.toFixed(2) || '0.00'}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                   <label>Status:</label>
//                                   <span className={`status-text status-${driver.status?.toLowerCase()}`}>
//                                     {driver.status}
//                                   </span>
//                                 </div>
//                               </div>
//                             </div>

//                             <div className="documents-section">
//                               <h4>📷 Document Images</h4>
//                               <div className="documents-grid">
//                                 <div className="document-item">
//                                   <p>Driver Photo {isRealImage(driver.driverPhotoUrl) ? '✅' : '🟡'}</p>
//                                   <img 
//                                     src={getImageUrl(driver.driverPhotoUrl, 'driver')}
//                                     alt="Driver" 
//                                   />
//                                 </div>
                                
//                                 <div className="document-item">
//                                   <p>License {isRealImage(driver.licenseImageUrl) ? '✅' : '🟡'}</p>
//                                   <img 
//                                     src={getImageUrl(driver.licenseImageUrl, 'license')}
//                                     alt="License" 
//                                   />
//                                 </div>
                                
//                                 <div className="document-item">
//                                   <p>RC Book {isRealImage(driver.rcBookUrl) ? '✅' : '🟡'}</p>
//                                   <img 
//                                     src={getImageUrl(driver.rcBookUrl, 'rc')}
//                                     alt="RC Book" 
//                                   />
//                                 </div>
                                
//                                 <div className="document-item">
//                                   <p>Insurance {isRealImage(driver.insuranceUrl) ? '✅' : '🟡'}</p>
//                                   <img 
//                                     src={getImageUrl(driver.insuranceUrl, 'insurance')}
//                                     alt="Insurance" 
//                                   />
//                                 </div>
                                
//                                 <div className="document-item">
//                                   <p>Truck Photo {isRealImage(driver.truckImageUrl) ? '✅' : '🟡'}</p>
//                                   <img 
//                                     src={getImageUrl(driver.truckImageUrl, 'truck')}
//                                     alt="Truck" 
//                                   />
//                                 </div>
//                               </div>
//                               <p className="image-note">
//                                 ✅ = Uploaded image • 🟡 = Default/Placeholder
//                               </p>
//                             </div>

//                             {/* 🔥 UPDATED ACTION BUTTONS WITH ONCLICK */}
//                             <div className="action-buttons">
//                               <button 
//                                 className="btn-edit"
//                                 onClick={() => handleEdit(driver.driverId)}
//                               >
//                                 ✏️ Edit
//                               </button>
                              
//                               {driver.status === 'PENDING' && (
//                                 <>
//                                   <button 
//                                     className="btn-approve"
//                                     onClick={() => handleApprove(driver.driverId)}
//                                   >
//                                     ✅ Approve
//                                   </button>
//                                   <button 
//                                     className="btn-reject"
//                                     onClick={() => handleReject(driver.driverId)}
//                                   >
//                                     ❌ Reject
//                                   </button>
//                                 </>
//                               )}
                              
//                               {driver.status === 'ACTIVE' && (
//                                 <button 
//                                   className="btn-block"
//                                   onClick={() => handleBlock(driver.driverId)}
//                                 >
//                                   🚫 Block
//                                 </button>
//                               )}
                              
//                               {driver.status === 'BLOCKED' && (
//                                 <button 
//                                   className="btn-unblock"
//                                   onClick={() => handleUnblock(driver.driverId)}
//                                 >
//                                   🔓 Unblock
//                                 </button>
//                               )}
                              
//                               <button 
//                                 className="btn-delete"
//                                 onClick={() => handleDelete(driver.driverId)}
//                               >
//                                 🗑️ Delete
//                               </button>
                              
//                               <button 
//                                 className="btn-view"
//                                 onClick={() => alert(`View full profile of driver ${driver.driverId}`)}
//                               >
//                                 👁️ View Full
//                               </button>
//                             </div>
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </React.Fragment>
//                 ))}
//               </tbody>
//             </table>

//             <div className="pagination">
//               <button 
//                 disabled={currentPage === 1} 
//                 onClick={() => setCurrentPage(p => p - 1)}
//                 className="pagination-btn prev"
//               >
//                 ← Previous
//               </button>
              
//               <div className="page-info">
//                 Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
//                 <span className="total-count">• {filteredDrivers.length} drivers</span>
//               </div>
              
//               <button 
//                 disabled={currentPage === totalPages} 
//                 onClick={() => setCurrentPage(p => p + 1)}
//                 className="pagination-btn next"
//               >
//                 Next →
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect } from 'react';
import './DriversList.css';

export default function DriversList() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedDriver, setExpandedDriver] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  
  // EDIT MODAL STATE
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [editFormData, setEditFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    address: '',
    truckNumber: '',
    truckType: '',
    truckMake: '',
    truckModel: '',
    truckYear: '',
    truckColor: '',
    truckCapacity: '',
    fuelType: '',
    licenseNumber: '',
    rcNumber: '',
    insuranceNumber: '',
  });

  // 🔥 OPEN EDIT MODAL
  const openEditModal = (driver) => {
    console.log('Opening edit modal for driver:', driver);
    setEditingDriver(driver);
    setEditFormData({
      fullName: driver.fullName || '',
      phoneNumber: driver.phoneNumber || '',
      email: driver.email || '',
      address: driver.address || '',
      truckNumber: driver.truckNumber || '',
      truckType: driver.truckType || '',
      truckMake: driver.truckMake || '',
      truckModel: driver.truckModel || '',
      truckYear: driver.truckYear || '',
      truckColor: driver.truckColor || '',
      truckCapacity: driver.truckCapacity || '',
      fuelType: driver.fuelType || '',
      licenseNumber: driver.licenseNumber || '',
      rcNumber: driver.rcNumber || '',
      insuranceNumber: driver.insuranceNumber || '',
    });
    setShowEditModal(true);
  };

  // 🔥 HANDLE EDIT FORM CHANGE
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 🔥 SUBMIT EDITED DRIVER DATA - UPDATED WITH CORRECT ENDPOINT
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingDriver) return;

    // Validate required fields
    if (!editFormData.fullName.trim() || !editFormData.phoneNumber.trim() || !editFormData.truckNumber.trim() || !editFormData.truckType.trim()) {
      alert('Please fill in all required fields (marked with *)');
      return;
    }

    console.log('Submitting driver update:', {
      driverId: editingDriver.driverId,
      data: editFormData
    });

    try {
      // 🔥 CORRECTED ENDPOINT - Using /edit endpoint
      const endpoint = `http://localhost:8080/api/admin/drivers/${editingDriver.driverId}/edit`;
      console.log('Sending PUT request to:', endpoint);
      
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData)
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Update successful:', result);
        alert('Driver updated successfully!');
        setShowEditModal(false);
        fetchDrivers(); // Refresh the list
      } else {
        // Try to get error message from response
        try {
          const errorData = await response.json();
          console.error('Error response:', errorData);
          alert(`Failed to update driver: ${errorData.message || response.statusText || 'Unknown error'}`);
        } catch (jsonError) {
          console.error('Failed to parse error response:', jsonError);
          alert(`Failed to update driver: HTTP ${response.status} - ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error('Network error:', error);
      alert(`Network error updating driver: ${error.message}. Please check: 
      1. Backend server is running at http://localhost:8080
      2. CORS is enabled on backend
      3. API endpoint is correct`);
    }
  };

  // 🔥 TEST BACKEND CONNECTION
  const testBackendConnection = async () => {
    try {
      console.log('Testing backend connection...');
      const response = await fetch('http://localhost:8080/api/admin/drivers');
      console.log('Backend response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Backend data:', data);
        alert('✅ Backend connection successful!');
      } else {
        alert(`❌ Backend responded with status: ${response.status}`);
      }
    } catch (error) {
      console.error('Backend test failed:', error);
      alert(`❌ Cannot connect to backend: ${error.message}`);
    }
  };

  // 🔥 OTHER ACTION FUNCTIONS
  const handleApprove = async (driverId) => {
    if (window.confirm(`Are you sure you want to approve driver ${driverId}?`)) {
      try {
        const endpoint = `http://localhost:8080/api/admin/drivers/${driverId}/approve`;
        console.log('Approving driver at:', endpoint);
        
        const response = await fetch(endpoint, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          alert('Driver approved successfully!');
          fetchDrivers();
        } else {
          alert('Failed to approve driver');
        }
      } catch (error) {
        console.error('Approve error:', error);
        alert('Error approving driver: ' + error.message);
      }
    }
  };

  const handleReject = async (driverId) => {
    if (window.confirm(`Are you sure you want to reject driver ${driverId}?`)) {
      try {
        const endpoint = `http://localhost:8080/api/admin/drivers/${driverId}/reject`;
        console.log('Rejecting driver at:', endpoint);
        
        const response = await fetch(endpoint, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          alert('Driver rejected successfully!');
          fetchDrivers();
        } else {
          alert('Failed to reject driver');
        }
      } catch (error) {
        console.error('Reject error:', error);
        alert('Error rejecting driver: ' + error.message);
      }
    }
  };

  const handleDelete = async (driverId) => {
    if (window.confirm(`Are you sure you want to delete driver ${driverId}?`)) {
      try {
        const endpoint = `http://localhost:8080/api/admin/drivers/${driverId}`;
        console.log('Deleting driver at:', endpoint);
        
        const response = await fetch(endpoint, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          alert('Driver deleted successfully!');
          fetchDrivers();
        } else {
          alert('Failed to delete driver');
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert('Error deleting driver: ' + error.message);
      }
    }
  };

  const handleBlock = async (driverId) => {
    if (window.confirm(`Are you sure you want to block driver ${driverId}?`)) {
      try {
        const endpoint = `http://localhost:8080/api/admin/drivers/${driverId}/block`;
        console.log('Blocking driver at:', endpoint);
        
        const response = await fetch(endpoint, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          alert('Driver blocked successfully!');
          fetchDrivers();
        } else {
          alert('Failed to block driver');
        }
      } catch (error) {
        console.error('Block error:', error);
        alert('Error blocking driver: ' + error.message);
      }
    }
  };

  const handleUnblock = async (driverId) => {
    if (window.confirm(`Are you sure you want to unblock driver ${driverId}?`)) {
      try {
        const endpoint = `http://localhost:8080/api/admin/drivers/${driverId}/unblock`;
        console.log('Unblocking driver at:', endpoint);
        
        const response = await fetch(endpoint, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          alert('Driver unblocked successfully!');
          fetchDrivers();
        } else {
          alert('Failed to unblock driver');
        }
      } catch (error) {
        console.error('Unblock error:', error);
        alert('Error unblocking driver: ' + error.message);
      }
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:8080/api/admin/drivers');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Full API Response:', result);
      
      let driversData = [];
      if (result.success && Array.isArray(result.drivers)) {
        driversData = result.drivers;
      } else if (Array.isArray(result)) {
        driversData = result;
      }
      
      console.log('Number of drivers:', driversData.length);
      
      setDrivers(driversData);
      
    } catch (err) {
      console.error('Error fetching drivers:', err);
      setError('Failed to load drivers. Please check backend server.');
    } finally {
      setLoading(false);
    }
  };

  // Check if image URL is a real uploaded image or default
  const isRealImage = (url) => {
    if (!url) return false;
    return !url.includes('default-');
  };

  // Get image URL with fallback
  const getImageUrl = (url, type) => {
    if (isRealImage(url)) {
      return url;
    }
    
    // Return appropriate placeholder based on type
    const placeholders = {
      'driver': 'https://via.placeholder.com/150/cccccc/ffffff?text=Driver+Photo',
      'license': 'https://via.placeholder.com/150/cccccc/ffffff?text=License',
      'rc': 'https://via.placeholder.com/150/cccccc/ffffff?text=RC+Book',
      'insurance': 'https://via.placeholder.com/150/cccccc/ffffff?text=Insurance',
      'truck': 'https://via.placeholder.com/150/cccccc/ffffff?text=Truck+Photo'
    };
    
    return placeholders[type] || 'https://via.placeholder.com/150/cccccc/ffffff?text=Image';
  };

  // Filter drivers
  const filteredDrivers = drivers.filter(driver => {
    const statusMatch = filterStatus === 'ALL' || driver.status === filterStatus;
    
    if (!searchTerm.trim()) return statusMatch;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      (driver.fullName && driver.fullName.toLowerCase().includes(searchLower)) ||
      (driver.phoneNumber && driver.phoneNumber.includes(searchTerm)) ||
      (driver.truckNumber && driver.truckNumber.toLowerCase().includes(searchLower)) ||
      (driver.licenseNumber && driver.licenseNumber.toLowerCase().includes(searchLower)) ||
      (driver.email && driver.email.toLowerCase().includes(searchLower))
    );
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredDrivers.length / itemsPerPage));
  const currentDrivers = filteredDrivers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading drivers...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <p className="error-message">❌ {error}</p>
      <button onClick={fetchDrivers} className="retry-btn">
        Retry
      </button>
    </div>
  );

  return (
    <div className="drivers-container">
      <div className="header-section">
        <h2>🚚 Drivers Management</h2>
        <div className="stats">
          <span className="stat-badge total">Total: {drivers.length}</span>
          <span className="stat-badge active">Active: {drivers.filter(d => d.status === 'ACTIVE').length}</span>
          <span className="stat-badge pending">Pending: {drivers.filter(d => d.status === 'PENDING').length}</span>
          <button 
            onClick={testBackendConnection} 
            className="btn-test"
            title="Test backend connection"
          >
            🔌 Test Backend
          </button>
        </div>
      </div>

      {/* 🔥 IMPROVED SEARCH AND FILTERS SECTION */}
      <div className="search-filter-section">
        <div className="search-container">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="🔍 Search by name, phone, truck number, license..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="search-input-large"
            />
            {searchTerm && (
              <button 
                className="clear-search-btn"
                onClick={() => setSearchTerm('')}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
          
          <div className="search-info">
            {searchTerm && (
              <span className="search-results-count">
                Found {filteredDrivers.length} drivers matching "{searchTerm}"
              </span>
            )}
          </div>
        </div>

        <div className="filter-container">
          <div className="filter-group">
            <label>Filter by Status:</label>
            <select 
              value={filterStatus} 
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="status-filter-select"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">⏳ Pending</option>
              <option value="ACTIVE">✅ Active</option>
              <option value="BLOCKED">🚫 Blocked</option>
              <option value="REJECTED">❌ Rejected</option>
            </select>
          </div>
          
          <button onClick={fetchDrivers} className="refresh-btn-large">
            🔄 Refresh List
          </button>
        </div>
      </div>

      <div className="table-container">
        {filteredDrivers.length === 0 ? (
          <div className="no-data">
            <p>📭 No drivers found {searchTerm ? 'matching "' + searchTerm + '"' : ''}</p>
          </div>
        ) : (
          <>
            <table className="drivers-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Driver Name</th>
                  <th>Phone</th>
                  <th>Truck No</th>
                  <th>Status</th>
                  <th>Rating</th>
                  <th>Trips</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentDrivers.map(driver => (
                  <React.Fragment key={driver.driverId}>
                    <tr className="driver-row">
                      <td className="driver-id">{driver.driverId}</td>
                      <td className="driver-name">
                        <div className="name-cell">
                          <img 
                            src={getImageUrl(driver.driverPhotoUrl, 'driver')}
                            alt={driver.fullName}
                            className="driver-thumb"
                          />
                          <div>
                            <strong>{driver.fullName}</strong>
                            <small>{driver.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>{driver.phoneNumber}</td>
                      <td className="truck-info">
                        {driver.truckNumber}
                        <small>{driver.truckMake} {driver.truckModel} • {driver.truckType}</small>
                      </td>
                      <td>
                        <span className={`status-badge status-${driver.status?.toLowerCase()}`}>
                          {driver.status}
                        </span>
                      </td>
                      <td className="rating-cell">
                        <span className="rating-value">
                          {driver.rating?.toFixed(1) || '0.0'} ⭐
                        </span>
                      </td>
                      <td>
                        <div className="trip-stats">
                          <span className="completed">✓ {driver.completedTrips || 0}</span>
                          <span className="total">/ {driver.totalTrips || 0}</span>
                        </div>
                      </td>
                      <td>
                        <button 
                          onClick={() => setExpandedDriver(
                            expandedDriver === driver.driverId ? null : driver.driverId
                          )}
                          className={`details-btn ${expandedDriver === driver.driverId ? 'active' : ''}`}
                        >
                          {expandedDriver === driver.driverId ? '▲ Hide' : '▼ Details'}
                        </button>
                      </td>
                    </tr>

                    {expandedDriver === driver.driverId && (
                      <tr className="details-expanded-row">
                        <td colSpan="8">
                          <div className="driver-details-panel">
                            <div className="details-header">
                              <h3>Driver Details - {driver.fullName}</h3>
                              <span className="driver-id">ID: {driver.driverId}</span>
                            </div>
                            
                            <div className="details-grid">
                              <div className="detail-card">
                                <h4>👤 Personal Information</h4>
                                <div className="detail-item">
                                  <label>Full Name:</label>
                                  <span>{driver.fullName}</span>
                                </div>
                                <div className="detail-item">
                                  <label>Phone:</label>
                                  <span>{driver.phoneNumber}</span>
                                </div>
                                <div className="detail-item">
                                  <label>Email:</label>
                                  <span>{driver.email}</span>
                                </div>
                                <div className="detail-item">
                                  <label>Address:</label>
                                  <span>{driver.address}</span>
                                </div>
                                <div className="detail-item">
                                  <label>Registered:</label>
                                  <span>{formatDate(driver.registeredAt)}</span>
                                </div>
                              </div>

                              <div className="detail-card">
                                <h4>🚚 Truck Details</h4>
                                <div className="detail-item">
                                  <label>Truck Number:</label>
                                  <span>{driver.truckNumber}</span>
                                </div>
                                <div className="detail-item">
                                  <label>Truck Type:</label>
                                  <span>{driver.truckType}</span>
                                </div>
                                <div className="detail-item">
                                  <label>Make & Model:</label>
                                  <span>{driver.truckMake} {driver.truckModel}</span>
                                </div>
                                <div className="detail-item">
                                  <label>Year:</label>
                                  <span>{driver.truckYear}</span>
                                </div>
                                <div className="detail-item">
                                  <label>Color:</label>
                                  <span>{driver.truckColor}</span>
                                </div>
                                <div className="detail-item">
                                  <label>Capacity:</label>
                                  <span>{driver.truckCapacity}</span>
                                </div>
                                <div className="detail-item">
                                  <label>Fuel Type:</label>
                                  <span>{driver.fuelType}</span>
                                </div>
                              </div>

                              <div className="detail-card">
                                <h4>📄 Documents</h4>
                                <div className="detail-item">
                                  <label>License Number:</label>
                                  <span>{driver.licenseNumber}</span>
                                </div>
                                <div className="detail-item">
                                  <label>RC Number:</label>
                                  <span>{driver.rcNumber}</span>
                                </div>
                                <div className="detail-item">
                                  <label>Insurance Number:</label>
                                  <span>{driver.insuranceNumber}</span>
                                </div>
                              </div>

                              <div className="detail-card">
                                <h4>📊 Statistics</h4>
                                <div className="detail-item">
                                  <label>Rating:</label>
                                  <span className="rating-badge">{driver.rating?.toFixed(1) || '0.0'} ⭐</span>
                                </div>
                                <div className="detail-item">
                                  <label>Completed Trips:</label>
                                  <span>{driver.completedTrips || 0}</span>
                                </div>
                                <div className="detail-item">
                                  <label>Total Trips:</label>
                                  <span>{driver.totalTrips || 0}</span>
                                </div>
                                <div className="detail-item">
                                  <label>Total Earnings:</label>
                                  <span className="earnings">₹{driver.totalEarnings?.toFixed(2) || '0.00'}</span>
                                </div>
                                <div className="detail-item">
                                  <label>Status:</label>
                                  <span className={`status-text status-${driver.status?.toLowerCase()}`}>
                                    {driver.status}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="documents-section">
                              <h4>📷 Document Images</h4>
                              <div className="documents-grid">
                                <div className="document-item">
                                  <p>Driver Photo {isRealImage(driver.driverPhotoUrl) ? '✅' : '🟡'}</p>
                                  <img 
                                    src={getImageUrl(driver.driverPhotoUrl, 'driver')}
                                    alt="Driver" 
                                  />
                                </div>
                                
                                <div className="document-item">
                                  <p>License {isRealImage(driver.licenseImageUrl) ? '✅' : '🟡'}</p>
                                  <img 
                                    src={getImageUrl(driver.licenseImageUrl, 'license')}
                                    alt="License" 
                                  />
                                </div>
                                
                                <div className="document-item">
                                  <p>RC Book {isRealImage(driver.rcBookUrl) ? '✅' : '🟡'}</p>
                                  <img 
                                    src={getImageUrl(driver.rcBookUrl, 'rc')}
                                    alt="RC Book" 
                                  />
                                </div>
                                
                                <div className="document-item">
                                  <p>Insurance {isRealImage(driver.insuranceUrl) ? '✅' : '🟡'}</p>
                                  <img 
                                    src={getImageUrl(driver.insuranceUrl, 'insurance')}
                                    alt="Insurance" 
                                  />
                                </div>
                                
                                <div className="document-item">
                                  <p>Truck Photo {isRealImage(driver.truckImageUrl) ? '✅' : '🟡'}</p>
                                  <img 
                                    src={getImageUrl(driver.truckImageUrl, 'truck')}
                                    alt="Truck" 
                                  />
                                </div>
                              </div>
                              <p className="image-note">
                                ✅ = Uploaded image • 🟡 = Default/Placeholder
                              </p>
                            </div>

                            <div className="action-buttons">
                              <button 
                                className="btn-edit"
                                onClick={() => openEditModal(driver)}
                              >
                                ✏️ Edit Driver
                              </button>
                              
                              {driver.status === 'PENDING' && (
                                <>
                                  <button 
                                    className="btn-approve"
                                    onClick={() => handleApprove(driver.driverId)}
                                  >
                                    ✅ Approve
                                  </button>
                                  <button 
                                    className="btn-reject"
                                    onClick={() => handleReject(driver.driverId)}
                                  >
                                    ❌ Reject
                                  </button>
                                </>
                              )}
                              
                              {driver.status === 'ACTIVE' && (
                                <button 
                                  className="btn-block"
                                  onClick={() => handleBlock(driver.driverId)}
                                >
                                  🚫 Block
                                </button>
                              )}
                              
                              {driver.status === 'BLOCKED' && (
                                <button 
                                  className="btn-unblock"
                                  onClick={() => handleUnblock(driver.driverId)}
                                >
                                  🔓 Unblock
                                </button>
                              )}
                              
                              <button 
                                className="btn-delete"
                                onClick={() => handleDelete(driver.driverId)}
                              >
                                🗑️ Delete
                              </button>
                              
                              <button 
                                className="btn-view"
                                onClick={() => alert(`View full profile of driver ${driver.driverId}`)}
                              >
                                👁️ View Full
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              <button 
                disabled={currentPage === 1} 
                onClick={() => setCurrentPage(p => p - 1)}
                className="pagination-btn prev"
              >
                ← Previous
              </button>
              
              <div className="page-info">
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                <span className="total-count">• {filteredDrivers.length} drivers</span>
              </div>
              
              <button 
                disabled={currentPage === totalPages} 
                onClick={() => setCurrentPage(p => p + 1)}
                className="pagination-btn next"
              >
                Next →
              </button>
            </div>
          </>
        )}
      </div>

      {/* 🔥 EDIT MODAL */}
      {showEditModal && editingDriver && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>✏️ Edit Driver: {editingDriver.fullName}</h2>
              <div className="debug-info">
                <small>Driver ID: {editingDriver.driverId}</small>
                <small>Endpoint: /api/admin/drivers/{editingDriver.driverId}/edit</small>
              </div>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>✕</button>
            </div>
            
            <form onSubmit={handleEditSubmit}>
              <div className="modal-body">
                <div className="form-section">
                  <h3>👤 Personal Information</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        name="fullName"
                        value={editFormData.fullName}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone Number *</label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={editFormData.phoneNumber}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={editFormData.email}
                        onChange={handleEditChange}
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Address</label>
                    <textarea
                      name="address"
                      value={editFormData.address}
                      onChange={handleEditChange}
                      rows="3"
                    />
                  </div>
                </div>

                <div className="form-section">
                  <h3>🚚 Truck Details</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Truck Number *</label>
                      <input
                        type="text"
                        name="truckNumber"
                        value={editFormData.truckNumber}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Truck Type *</label>
                      <select
                        name="truckType"
                        value={editFormData.truckType}
                        onChange={handleEditChange}
                        required
                      >
                        <option value="">Select Type</option>
                        <option value="MINI_TRUCK">Mini Truck</option>
                        <option value="LORRY">Lorry</option>
                        <option value="TRAILER">Trailer</option>
                        <option value="CONTAINER">Container</option>
                        <option value="TANKER">Tanker</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Truck Make</label>
                      <input
                        type="text"
                        name="truckMake"
                        value={editFormData.truckMake}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Truck Model</label>
                      <input
                        type="text"
                        name="truckModel"
                        value={editFormData.truckModel}
                        onChange={handleEditChange}
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Truck Year</label>
                      <input
                        type="number"
                        name="truckYear"
                        value={editFormData.truckYear}
                        onChange={handleEditChange}
                        min="2000"
                        max="2024"
                      />
                    </div>
                    <div className="form-group">
                      <label>Truck Color</label>
                      <input
                        type="text"
                        name="truckColor"
                        value={editFormData.truckColor}
                        onChange={handleEditChange}
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Capacity (tons)</label>
                      <input
                        type="number"
                        name="truckCapacity"
                        value={editFormData.truckCapacity}
                        onChange={handleEditChange}
                        step="0.1"
                        min="1"
                      />
                    </div>
                    <div className="form-group">
                      <label>Fuel Type</label>
                      <select
                        name="fuelType"
                        value={editFormData.fuelType}
                        onChange={handleEditChange}
                      >
                        <option value="">Select Fuel</option>
                        <option value="DIESEL">Diesel</option>
                        <option value="PETROL">Petrol</option>
                        <option value="CNG">CNG</option>
                        <option value="ELECTRIC">Electric</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3>📄 Document Numbers</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>License Number</label>
                      <input
                        type="text"
                        name="licenseNumber"
                        value={editFormData.licenseNumber}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>RC Number</label>
                      <input
                        type="text"
                        name="rcNumber"
                        value={editFormData.rcNumber}
                        onChange={handleEditChange}
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Insurance Number</label>
                    <input
                      type="text"
                      name="insuranceNumber"
                      value={editFormData.insuranceNumber}
                      onChange={handleEditChange}
                    />
                  </div>
                </div>

                <div className="debug-section">
                  <h4>🔍 Debug Information</h4>
                  <p>Endpoint: <code>PUT http://localhost:8080/api/admin/drivers/{editingDriver.driverId}/edit</code></p>
                  <p>Request Body:</p>
                  <pre className="debug-pre">
                    {JSON.stringify(editFormData, null, 2)}
                  </pre>
                </div>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  💾 Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}