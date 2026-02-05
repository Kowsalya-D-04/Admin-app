// components/Admin.jsx - Add this import
// import { useLocation, useNavigate } from 'react-router-dom';
// import React, { useState, useEffect } from 'react';
// import AdminDashboard from './AdminDashboard';
// import LoadRequests from './LoadRequests';
// import DriversList from './DriversList';
// import CustomersList from './CustomersList';
// import Trips from './Trips';
// import Payments from './Payments';
// import '../Admin.css';

// const Admin = ({ setIsAuthenticated }) => {
//   const location = useLocation();
//   const navigate = useNavigate();
  
//   // Get active tab from URL or default to 'dashboard'
//   const getActiveTabFromUrl = () => {
//     const path = location.pathname;
//     if (path.includes('load-requests')) return 'loadRequests';
//     if (path.includes('drivers')) return 'drivers';
//     if (path.includes('customers')) return 'customers';
//     if (path.includes('trips')) return 'trips';
//      if (path.includes('payments')) return 'payments';
//     return 'dashboard';
//   };

//   const [activeTab, setActiveTab] = useState(getActiveTabFromUrl());

//   // Update URL when tab changes
//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     let path = '/admin';
//     if (tab === 'loadRequests') path = '/admin/load-requests';
//     else if (tab === 'drivers') path = '/admin/drivers';
//     else if (tab === 'customers') path = '/admin/customers';
//     else if (tab === 'trips') path = '/admin/trips';
//     else if (tab === 'payments') path = '/admin/payments';
//     navigate(path);
//   };

//   // Update active tab when URL changes
//   useEffect(() => {
//     setActiveTab(getActiveTabFromUrl());
//   }, [location]);

//   const handleLogout = () => {
//     localStorage.removeItem('adminToken');
//     localStorage.removeItem('adminInfo');
//     setIsAuthenticated(false);
//     navigate('/login');
//   };

//   const renderTab = () => {
//     switch (activeTab) {
//       case 'dashboard': return <AdminDashboard />;
//       case 'loadRequests': return <LoadRequests />;
//       case 'drivers': return <DriversList />;
//       case 'customers': return <CustomersList />;
//       case 'trips': return <Trips />;
//       case 'payments': return <Payments />;
//       default: return <AdminDashboard />;
//     }
//   };

//   return (
//     <div className="admin-container">
//       <header className="admin-header">
//         <h1>Truck Booking Admin Panel</h1>
//         <button onClick={handleLogout} className="logout-btn">
//           Logout
//         </button>
//       </header>
//       <nav className="admin-nav">
//         <button 
//           className={activeTab === 'dashboard' ? 'active' : ''}
//           onClick={() => handleTabChange('dashboard')}
//         >
//           Dashboard
//         </button>
//         <button 
//           className={activeTab === 'loadRequests' ? 'active' : ''}
//           onClick={() => handleTabChange('loadRequests')}
//         >
//           Load Requests
//         </button>
//         <button 
//           className={activeTab === 'drivers' ? 'active' : ''}
//           onClick={() => handleTabChange('drivers')}
//         >
//           Drivers
//         </button>
//         <button 
//           className={activeTab === 'customers' ? 'active' : ''}
//           onClick={() => handleTabChange('customers')}
//         >
//           Customers
//         </button>
//         <button 
//           className={activeTab === 'trips' ? 'active' : ''}
//           onClick={() => handleTabChange('trips')}
//         >
//              Trips
//         </button>
//         <button 
//           className={activeTab === 'payments' ? 'active' : ''}
//           onClick={() => handleTabChange('payments')}
//         >
//           Payments
//         </button>
//       </nav>
//       <main className="admin-main">
//         {renderTab()}
//       </main>
//     </div>
//   );
// };

// export default Admin;
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import LoadRequests from './LoadRequests';
import DriversList from './DriversList';
import CustomersList from './CustomersList';
import PendingLoadRequests from './PendingLoadRequests'; // ✅ file must exist
import Trips from './Trips';
import Payments from './Payments';
import './Admin.css';

// Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Error in component:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <div style={{ padding: 20, color: 'red' }}>Something went wrong.</div>;
    }
    return this.props.children;
  }
}

const Admin = ({ setIsAuthenticated }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveTabFromUrl = () => {
    const path = location.pathname;
    if (path.includes('load-requests')) return 'loadRequests';
    if (path.includes('drivers')) return 'drivers';
    if (path.includes('customers')) return 'customers';
    if (path.includes('pendingloadrequests')) return 'pendingloadrequests'; // ✅ fixed
    if (path.includes('trips')) return 'trips';
    if (path.includes('payments')) return 'payments';
    return 'dashboard';
  };

  const [activeTab, setActiveTab] = useState(getActiveTabFromUrl());

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    let path = '/admin';

    if (tab === 'dashboard') path = '/admin';
    else if (tab === 'loadRequests') path = '/admin/load-requests';
    else if (tab === 'drivers') path = '/admin/drivers';
    else if (tab === 'customers') path = '/admin/customers';
    else if (tab === 'pendingloadrequest') path = '/admin/pendingloadrequests'; // ✅
    else if (tab === 'trips') path = '/admin/trips';
    else if (tab === 'payments') path = '/admin/payments';

    navigate(path);
  };

  useEffect(() => {
    setActiveTab(getActiveTabFromUrl());
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'loadRequests':
        return <LoadRequests />;
      case 'drivers':
        return <DriversList />;
      case 'customers':
        return <CustomersList />;
      case 'pendingloadrequests':
        return <PendingLoadRequests />; // ✅
      case 'trips':
        return <Trips />;
      case 'payments':
        return <Payments />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Truck Booking Admin Panel</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </header>

      <nav className="admin-nav">
        <button
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => handleTabChange('dashboard')}
        >
          Dashboard
        </button>

        <button
          className={activeTab === 'loadRequests' ? 'active' : ''}
          onClick={() => handleTabChange('loadRequests')}
        >
          Customer Requests
        </button>

        <button
          className={activeTab === 'drivers' ? 'active' : ''}
          onClick={() => handleTabChange('drivers')}
        >
          Drivers
        </button>

        <button
          className={activeTab === 'customers' ? 'active' : ''}
          onClick={() => handleTabChange('customers')}
        >
          Customers
        </button>

        <button
          className={activeTab === 'pendingloadrequest' ? 'active' : ''}  // ✅ fixed
          onClick={() => handleTabChange('pendingloadrequest')}
        >
          Driver Requests
        </button>

        <button
          className={activeTab === 'trips' ? 'active' : ''}
          onClick={() => handleTabChange('trips')}
        >
          Trips
        </button>

        <button
          className={activeTab === 'payments' ? 'active' : ''}
          onClick={() => handleTabChange('payments')}
        >
          Payments
        </button>
      </nav>

      <main className="admin-main">
        <ErrorBoundary>
          {renderTab()}
        </ErrorBoundary>
      </main>
    </div>
  );
};

export default Admin;