
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './components/AdminLogin';
import Admin from './components/Admin';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="loading-app">Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
              <Navigate to="/admin" /> : 
              <AdminLogin setIsAuthenticated={setIsAuthenticated} />
            } 
          />
          <Route 
            path="/admin/*" 
            element={
              isAuthenticated ? 
              <Admin setIsAuthenticated={setIsAuthenticated} /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? 
              <Navigate to="/admin" /> : 
              <Navigate to="/login" />
            } 
          />
          <Route path="/" element={<Navigate to={isAuthenticated ? "/admin" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Dashboard from './components/Dashboard';
// import LoadRequests from './components/LoadRequests';
// import Drivers from './components/Drivers';
// import Customers from './components/Customers';
// import Payments from './components/Payments';
// import Trips from './components/Trips'; // ✅ new component

// function App() {
//   return (
//     <Router>
//       <Navbar />
//       <Routes>
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/load-requests" element={<LoadRequests />} />
//         <Route path="/drivers" element={<Drivers />} />
//         <Route path="/customers" element={<Customers />} />
//         <Route path="/payments" element={<Payments />} />
//         <Route path="/trips" element={<Trips />} /> {/* ✅ new route */}
//       </Routes>
//     </Router>
//   );
// }

// export default App;
