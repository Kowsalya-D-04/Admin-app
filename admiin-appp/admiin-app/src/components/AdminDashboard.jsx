// // components/AdminDashboard.jsx
// import React, { useState, useEffect } from 'react';
// import { adminAPI } from '../api/adminApi';

// const AdminDashboard = () => {
//   const [stats, setStats] = useState({
//     pendingLoads: 0,
//     activeTrips: 0,
//     driversCount: 0,
//     customersCount: 0,
//     todayRevenue: 0
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     fetchDashboardStats();
//   }, []);

//   const fetchDashboardStats = async () => {
//     try {
//       setLoading(true);
//       const response = await adminAPI.getDashboardSummary();
      
//       // Log the response to see data structure
//       console.log('Dashboard API Response:', response.data);
      
//       if (response.data && typeof response.data === 'object') {
//         setStats({
//           pendingLoads: response.data.pendingLoads || 0,
//           activeTrips: response.data.activeTrips || 0,
//           driversCount: response.data.driversCount || 0,
//           customersCount: response.data.customersCount || 0,
//           todayRevenue: response.data.todayRevenue || 0
//         });
//       } else {
//         // If API returns different structure, adjust accordingly
//         setStats({
//           pendingLoads: 12,
//           activeTrips: 5,
//           driversCount: 8,
//           customersCount: 25,
//           todayRevenue: 45000
//         });
//       }
//     } catch (err) {
//       console.error('Dashboard API Error:', err);
//       setError('Failed to load dashboard data');
//       // Set mock data for testing
//       setStats({
//         pendingLoads: 12,
//         activeTrips: 5,
//         driversCount: 8,
//         customersCount: 25,
//         todayRevenue: 45000
//       });
//       setLoading(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <div className="loading">Loading dashboard...</div>;
//   if (error) return <div className="error">{error}</div>;

//   return (
//     <div className="dashboard">
//       <h2>Admin Dashboard</h2>
//       <p className="dashboard-subtitle">Welcome to Truck Booking Admin Panel</p>
      
//       <div className="stats-grid">
//         <div className="stat-card">
//           <h3>Pending Loads</h3>
//           <p className="stat-value">{stats.pendingLoads}</p>
//           <p className="stat-desc">Awaiting driver assignment</p>
//         </div>
//         <div className="stat-card">
//           <h3>Active Trips</h3>
//           <p className="stat-value">{stats.activeTrips}</p>
//           <p className="stat-desc">Currently in progress</p>
//         </div>
//         <div className="stat-card">
//           <h3>Total Drivers</h3>
//           <p className="stat-value">{stats.driversCount}</p>
//           <p className="stat-desc">Registered drivers</p>
//         </div>
//         <div className="stat-card">
//           <h3>Total Customers</h3>
//           <p className="stat-value">{stats.customersCount}</p>
//           <p className="stat-desc">Registered customers</p>
//         </div>
//         <div className="stat-card revenue-card">
//           <h3>Today's Revenue</h3>
//           <p className="stat-value">₹{stats.todayRevenue.toLocaleString()}</p>
//           <p className="stat-desc">Total earnings today</p>
//         </div>
//       </div>
      
//       <div className="quick-actions">
//         <h3>Quick Actions</h3>
//         <div className="action-buttons">
//           <button className="action-btn">
//             <span>📋</span>
//             View Pending Loads
//           </button>
//           <button className="action-btn">
//             <span>👨‍✈️</span>
//             Manage Drivers
//           </button>
//           <button className="action-btn">
//             <span>💰</span>
//             Check Payments
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;
// components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { adminAPI } from '../api/adminApi';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    pendingLoads: 0,
    activeTrips: 0,
    driversCount: 0,
    activeDrivers: 0,
    customersCount: 0,
    todayRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboardSummary();
      
      console.log('Dashboard API Response:', response.data);

      if (response.data && typeof response.data === 'object' && response.data.success) {
        setStats({
          pendingLoads: response.data.pendingRequests || 0,       // Your API uses 'pendingRequests'
          activeTrips: response.data.activeTrips || 0,
          driversCount: response.data.totalDrivers || 0,
          activeDrivers: response.data.activeDrivers || 0,
          customersCount: response.data.totalCustomers || 0,
          todayRevenue: response.data.totalRevenue || 0
        });
      }
    } catch (err) {
      console.error('Dashboard API Error:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard">
      <h2>Admin Dashboard</h2>
      <p className="dashboard-subtitle">Welcome to Truck Booking Admin Panel</p>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Pending Loads</h3>
          <p className="stat-value">{stats.pendingLoads}</p>
          <p className="stat-desc">Awaiting driver assignment</p>
        </div>
        <div className="stat-card">
          <h3>Active Trips</h3>
          <p className="stat-value">{stats.activeTrips}</p>
          <p className="stat-desc">Currently in progress</p>
        </div>
        <div className="stat-card">
          <h3>Total Drivers</h3>
          <p className="stat-value">{stats.driversCount}</p>
          <p className="stat-desc">Registered drivers</p>
        </div>
        <div className="stat-card">
          <h3>Active Drivers</h3>
          <p className="stat-value">{stats.activeDrivers}</p>
          <p className="stat-desc">Drivers on duty</p>
        </div>
        <div className="stat-card">
          <h3>Total Customers</h3>
          <p className="stat-value">{stats.customersCount}</p>
          <p className="stat-desc">Registered customers</p>
        </div>
        <div className="stat-card revenue-card">
          <h3>Today's Revenue</h3>
          <p className="stat-value">₹{stats.todayRevenue.toLocaleString()}</p>
          <p className="stat-desc">Total earnings today</p>
        </div>
      </div>
      
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button className="action-btn">
            <span>📋</span>
            View Pending Loads
          </button>
          <button className="action-btn">
            <span>👨‍✈️</span>
            Manage Drivers
          </button>
          <button className="action-btn">
            <span>💰</span>
            Check Payments
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
