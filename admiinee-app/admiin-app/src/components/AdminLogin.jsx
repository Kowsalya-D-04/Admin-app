// // src/components/AdminLogin.jsx
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const AdminLogin = ({ setIsAuthenticated, setAdminData }) => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = (e) => {
//     e.preventDefault();

//     // ✅ Mock authentication
//     if (username === 'admin' && password === 'admin') {
//       setIsAuthenticated(true);
//       setAdminData({ name: 'Admin' });
//       navigate('/dashboard'); // redirect to dashboard
//     } else {
//       alert('Invalid username or password');
//     }
//   };

//   return (
//     <div
//       style={{
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         height: '100vh',
//         background: 'linear-gradient(to right, #667eea, #764ba2)',
//       }}
//     >
//       <form
//         onSubmit={handleLogin}
//         style={{
//           backgroundColor: '#fff',
//           padding: '40px',
//           borderRadius: '8px',
//           boxShadow: '0 0 10px rgba(0,0,0,0.2)',
//           width: '300px',
//         }}
//       >
//         <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Admin Login</h2>
//         <input
//           type="text"
//           placeholder="Username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           style={{
//             width: '100%',
//             padding: '10px',
//             marginBottom: '15px',
//             borderRadius: '4px',
//             border: '1px solid #ccc',
//           }}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           style={{
//             width: '100%',
//             padding: '10px',
//             marginBottom: '20px',
//             borderRadius: '4px',
//             border: '1px solid #ccc',
//           }}
//         />
//         <button
//           type="submit"
//           style={{
//             width: '100%',
//             padding: '10px',
//             backgroundColor: '#667eea',
//             color: '#fff',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: 'pointer',
//           }}
//         >
//           Login
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AdminLogin;

// src/components/AdminLogin.jsx
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { adminAPI } from '../api/adminApi';

// const AdminLogin = ({ setIsAuthenticated }) => {
//   const [username, setUsername] = useState('admin');
//   const [password, setPassword] = useState('admin123');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!username || !password) {
//       setError('Please enter username and password');
//       return;
//     }
//     setLoading(true);
//     setError('');

//     try {
//       const response = await adminAPI.login({ username, password });

//       if (response.data?.success) {
//         localStorage.setItem('adminToken', response.data.token);
//         localStorage.setItem('adminInfo', JSON.stringify(response.data.admin));
//         setIsAuthenticated(true);
//         navigate('/admin');
//       } else {
//         setError(response.data?.message || 'Invalid credentials');
//       }
//     } catch (err) {
//       console.error(err);
//       // Mock login if backend is not running
//       const mockToken = 'mock-jwt-token';
//       const mockAdmin = { id: 1, username, name: 'Admin User', role: 'ADMIN' };
//       localStorage.setItem('adminToken', mockToken);
//       localStorage.setItem('adminInfo', JSON.stringify(mockAdmin));
//       setIsAuthenticated(true);
//       navigate('/admin');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTestLogin = (type) => {
//     if (type === 'admin') {
//       setUsername('admin');
//       setPassword('admin123');
//     } else if (type === 'demo') {
//       setUsername('demo');
//       setPassword('demo123');
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.box}>
//         <h2 style={{ fontSize: 28 }}>Admin Login</h2>
//         <p style={{ marginBottom: 30, fontSize: 16 }}>Truck Booking System</p>

//         {error && <p style={styles.error}>{error}</p>}

//         <form onSubmit={handleSubmit} style={styles.form}>
//           <input
//             type="text"
//             placeholder="Username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             disabled={loading}
//             style={styles.input}
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             disabled={loading}
//             style={styles.input}
//           />
//           <button type="submit" style={styles.button} disabled={loading}>
//             {loading ? 'Logging in...' : 'Login'}
//           </button>
//         </form>

       

//         <p style={styles.reset}>Forgot password? <a href="/reset-password" style={{ color: '#007bff' }}>Reset Password</a></p>

//         <p style={styles.footer}>Truck Booking System © {new Date().getFullYear()}</p>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: '100vh',
//     background: '#f0f2f5',
//   },
//   box: {
//     padding: 50,
//     background: '#fff',
//     borderRadius: 15,
//     boxShadow: '0 0 20px rgba(0,0,0,0.1)',
//     textAlign: 'center',
//     width: 400, // bigger width
//   },
//   form: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: 20,
//     marginTop: 20,
//   },
//   input: {
//     padding: 15, // bigger input
//     fontSize: 16,
//     borderRadius: 8,
//     border: '1px solid #ccc',
//   },
//   button: {
//     padding: 15,
//     fontSize: 16,
//     borderRadius: 8,
//     border: 'none',
//     background: '#28a745',
//     color: '#fff',
//     cursor: 'pointer',
//   },
//   error: {
//     color: 'red',
//     marginTop: 10,
//   },
//   test: {
//     marginTop: 25,
//     display: 'flex',
//     flexDirection: 'column',
//     gap: 10,
//   },
//   testBtn: {
//     padding: 12,
//     borderRadius: 6,
//     border: '1px solid #007bff',
//     background: '#fff',
//     cursor: 'pointer',
//   },
//   reset: {
//     marginTop: 30,
//     fontSize: 14,
//   },
//   footer: {
//     marginTop: 20,
//     fontSize: 12,
//     color: '#555',
//   },
// };

// export default AdminLogin;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('admin'); // default
  const [password, setPassword] = useState('admin123'); // default
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter username and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/api/admin/login', {
        username,
        password,
      });

      // assuming your backend returns { token, admin } on success
      if (response.data?.token) {
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminInfo', JSON.stringify(response.data.admin));
        setIsAuthenticated(true);
        navigate('/admin');
      } else {
        setError(response.data?.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={{ fontSize: 28 }}>Admin Login</h2>
        <p style={{ marginBottom: 30, fontSize: 16 }}>Truck Booking System</p>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={styles.reset}>
          Forgot password? <a href="/reset-password" style={{ color: '#007bff' }}>Reset Password</a>
        </p>

        <p style={styles.footer}>Truck Booking System © {new Date().getFullYear()}</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: '#f0f2f5',
  },
  box: {
    padding: 50,
    background: '#fff',
    borderRadius: 15,
    boxShadow: '0 0 20px rgba(0,0,0,0.1)',
    textAlign: 'center',
    width: 400,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    marginTop: 20,
  },
  input: {
    padding: 15,
    fontSize: 16,
    borderRadius: 8,
    border: '1px solid #ccc',
  },
  button: {
    padding: 15,
    fontSize: 16,
    borderRadius: 8,
    border: 'none',
    background: '#28a745',
    color: '#fff',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  reset: {
    marginTop: 30,
    fontSize: 14,
  },
  footer: {
    marginTop: 20,
    fontSize: 12,
    color: '#555',
  },
};

export default AdminLogin;
