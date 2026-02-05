// // src/components/CustomersList.js
// import React, { useState, useEffect } from 'react';
// import { adminAPI } from '../api/adminApi';
// import './CustomersList.css';

// const CustomersList = () => {
//   const [customers, setCustomers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [editingCustomer, setEditingCustomer] = useState(null);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [newCustomer, setNewCustomer] = useState({
//     name: '',
//     phone: '',
//     email: '',
//     address: '',
//     password: ''
//   });

//   useEffect(() => {
//     fetchCustomers();
//   }, []);

//   const fetchCustomers = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       const response = await adminAPI.getAllCustomers();
//       console.log('Customers data:', response.data); // Debug log
//       setCustomers(response.data);
//     } catch (err) {
//       console.error('Error details:', err.response || err.message);
//       setError(`Failed to load customers: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Handle CREATE CUSTOMER
//   const handleCreateSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // Validate required fields
//       if (!newCustomer.name || !newCustomer.email || !newCustomer.phone) {
//         alert('Name, email, and phone are required!');
//         return;
//       }

//       console.log('Creating customer with data:', newCustomer);
//       await adminAPI.createCustomer(newCustomer);
      
//       // Refresh the list
//       await fetchCustomers();
      
//       // Reset form
//       setShowCreateModal(false);
//       setNewCustomer({
//         name: '',
//         phone: '',
//         email: '',
//         address: '',
//         password: ''
//       });
      
//       alert('Customer created successfully!');
//     } catch (err) {
//       console.error('Create error:', err.response || err);
//       alert(`Failed to create customer: ${err.response?.data?.error || err.message}`);
//     }
//   };

//   // ✅ Handle EDIT CUSTOMER
//   const handleEditSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (!editingCustomer.name || !editingCustomer.email || !editingCustomer.phone) {
//         alert('Name, email, and phone are required!');
//         return;
//       }

//       await adminAPI.updateCustomer(editingCustomer.id, editingCustomer);
//       await fetchCustomers();
//       setShowEditModal(false);
//       setEditingCustomer(null);
//       alert('Customer updated successfully!');
//     } catch (err) {
//       console.error('Edit error:', err.response || err);
//       alert(`Failed to update customer: ${err.response?.data?.error || err.message}`);
//     }
//   };

//   // ✅ Handle DELETE CUSTOMER
//   const handleDeleteCustomer = async (id, name) => {
//     if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

//     try {
//       await adminAPI.deleteCustomer(id);
//       await fetchCustomers();
//       alert('Customer deleted successfully!');
//     } catch (err) {
//       console.error('Delete error:', err.response || err);
//       alert(`Failed to delete customer: ${err.response?.data?.error || err.message}`);
//     }
//   };

//   // ✅ Handle APPROVE CUSTOMER
//   const handleApproveCustomer = async (id, name) => {
//     if (!window.confirm(`Approve customer ${name}?`)) return;

//     try {
//       await adminAPI.approveCustomer(id);
//       await fetchCustomers();
//       alert('Customer approved successfully!');
//     } catch (err) {
//       console.error('Approve error:', err.response || err);
//       alert(`Failed to approve customer: ${err.response?.data?.error || err.message}`);
//     }
//   };

//   // ✅ Handle BLOCK/UNBLOCK CUSTOMER
//   const handleToggleBlockCustomer = async (customer) => {
//     const action = customer.status === 'blocked' ? 'unblock' : 'block';
//     if (!window.confirm(`Are you sure you want to ${action} ${customer.name}?`)) return;

//     try {
//       await adminAPI.blockCustomer(customer.id);
//       await fetchCustomers();
//       alert(`Customer ${action}ed successfully!`);
//     } catch (err) {
//       console.error('Block error:', err.response || err);
//       alert(`Failed to ${action} customer: ${err.response?.data?.error || err.message}`);
//     }
//   };

//   // Filter customers based on search
//   const filteredCustomers = customers.filter(customer => {
//     if (!searchTerm) return true;
    
//     const searchLower = searchTerm.toLowerCase();
//     return (
//       customer.name?.toLowerCase().includes(searchLower) ||
//       customer.email?.toLowerCase().includes(searchLower) ||
//       customer.phone?.toLowerCase().includes(searchLower) ||
//       customer.address?.toLowerCase().includes(searchLower)
//     );
//   });

//   if (loading) return <div className="loading">Loading customers...</div>;
//   if (error) return <div className="error">{error}</div>;

//   return (
//     <div className="customers-container">
//       <div className="header-section">
//         <h2>Customers List</h2>
//         <div className="action-buttons">
//           <button 
//             className="btn btn-primary" 
//             onClick={() => setShowCreateModal(true)}
//           >
//             + Add New Customer
//           </button>
//           <button 
//             className="btn btn-secondary" 
//             onClick={fetchCustomers}
//             title="Refresh"
//           >
//             ↻ Refresh
//           </button>
//         </div>
//       </div>

//       <div className="search-section">
//         <input
//           type="text"
//           placeholder="Search by name, email, phone, or address..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="search-input"
//         />
//       </div>

//       <div className="table-container">
//         <table className="data-table">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Name</th>
//               <th>Phone</th>
//               <th>Email</th>
//               <th>Address</th>
//               <th>Total Trips</th>
//               <th>Total Spent</th>
//               <th>Joined Date</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {filteredCustomers.length === 0 ? (
//               <tr>
//                 <td colSpan="10" className="no-data">
//                   {searchTerm ? 'No matching customers found' : 'No customers found'}
//                 </td>
//               </tr>
//             ) : (
//               filteredCustomers.map(customer => (
//                 <tr key={customer.id}>
//                   <td>{customer.id}</td>
//                   <td>{customer.name}</td>
//                   <td>{customer.phone || 'N/A'}</td>
//                   <td>{customer.email || 'N/A'}</td>
//                   <td>{customer.address || 'N/A'}</td>
//                   <td>{customer.totalTrips || 0}</td>
//                   <td>${(customer.totalSpent || 0).toFixed(2)}</td>
//                   <td>
//                     {customer.createdAt
//                       ? new Date(customer.createdAt).toLocaleDateString()
//                       : 'N/A'}
//                   </td>
//                   <td>
//                     <span className={`status-badge ${customer.status || 'pending'}`}>
//                       {customer.status || 'pending'}
//                     </span>
//                   </td>
//                   <td>
//                     <div className="action-buttons-group">
//                       {customer.status !== 'approved' && (
//                         <button
//                           className="btn btn-success btn-sm"
//                           onClick={() => handleApproveCustomer(customer.id, customer.name)}
//                           title="Approve Customer"
//                         >
//                           Approve
//                         </button>
//                       )}
                      
//                       <button
//                         className="btn btn-warning btn-sm"
//                         onClick={() => {
//                           setEditingCustomer(customer);
//                           setShowEditModal(true);
//                         }}
//                         title="Edit Customer"
//                       >
//                         Edit
//                       </button>
                      
//                       <button
//                         className={`btn btn-sm ${
//                           customer.status === 'blocked' ? 'btn-success' : 'btn-secondary'
//                         }`}
//                         onClick={() => handleToggleBlockCustomer(customer)}
//                         title={customer.status === 'blocked' ? 'Unblock Customer' : 'Block Customer'}
//                       >
//                         {customer.status === 'blocked' ? 'Unblock' : 'Block'}
//                       </button>
                      
//                       <button
//                         className="btn btn-danger btn-sm"
//                         onClick={() => handleDeleteCustomer(customer.id, customer.name)}
//                         title="Delete Customer"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* EDIT MODAL */}
//       {showEditModal && editingCustomer && (
//         <div className="modal-overlay">
//           <div className="modal">
//             <div className="modal-header">
//               <h3>Edit Customer</h3>
//               <button className="close-btn" onClick={() => setShowEditModal(false)}>×</button>
//             </div>
//             <form onSubmit={handleEditSubmit}>
//               <div className="form-group">
//                 <label>Name *</label>
//                 <input
//                   type="text"
//                   value={editingCustomer.name || ''}
//                   onChange={(e) => setEditingCustomer({
//                     ...editingCustomer,
//                     name: e.target.value
//                   })}
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Email *</label>
//                 <input
//                   type="email"
//                   value={editingCustomer.email || ''}
//                   onChange={(e) => setEditingCustomer({
//                     ...editingCustomer,
//                     email: e.target.value
//                   })}
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Phone *</label>
//                 <input
//                   type="text"
//                   value={editingCustomer.phone || ''}
//                   onChange={(e) => setEditingCustomer({
//                     ...editingCustomer,
//                     phone: e.target.value
//                   })}
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Address</label>
//                 <input
//                   type="text"
//                   value={editingCustomer.address || ''}
//                   onChange={(e) => setEditingCustomer({
//                     ...editingCustomer,
//                     address: e.target.value
//                   })}
//                 />
//               </div>
//               <div className="modal-buttons">
//                 <button type="submit" className="btn btn-primary">Save Changes</button>
//                 <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* CREATE MODAL */}
//       {showCreateModal && (
//         <div className="modal-overlay">
//           <div className="modal">
//             <div className="modal-header">
//               <h3>Add New Customer</h3>
//               <button className="close-btn" onClick={() => setShowCreateModal(false)}>×</button>
//             </div>
//             <form onSubmit={handleCreateSubmit}>
//               <div className="form-group">
//                 <label>Name *</label>
//                 <input
//                   type="text"
//                   value={newCustomer.name}
//                   onChange={(e) => setNewCustomer({
//                     ...newCustomer,
//                     name: e.target.value
//                   })}
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Email *</label>
//                 <input
//                   type="email"
//                   value={newCustomer.email}
//                   onChange={(e) => setNewCustomer({
//                     ...newCustomer,
//                     email: e.target.value
//                   })}
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Phone *</label>
//                 <input
//                   type="text"
//                   value={newCustomer.phone}
//                   onChange={(e) => setNewCustomer({
//                     ...newCustomer,
//                     phone: e.target.value
//                   })}
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Address</label>
//                 <input
//                   type="text"
//                   value={newCustomer.address}
//                   onChange={(e) => setNewCustomer({
//                     ...newCustomer,
//                     address: e.target.value
//                   })}
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Password (Optional)</label>
//                 <input
//                   type="password"
//                   value={newCustomer.password}
//                   onChange={(e) => setNewCustomer({
//                     ...newCustomer,
//                     password: e.target.value
//                   })}
//                   placeholder="Leave empty for default password"
//                 />
//               </div>
//               <div className="modal-buttons">
//                 <button type="submit" className="btn btn-primary">Create Customer</button>
//                 <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CustomersList;
import React, { useState, useEffect } from 'react';
import { adminAPI } from '../api/adminApi';
import './CustomersList.css';

const CustomersList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: 'default123'
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllCustomers();
      setCustomers(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load customers: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle CREATE CUSTOMER
  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createCustomer(newCustomer);
      await fetchCustomers();
      setShowCreateModal(false);
      setNewCustomer({ name: '', email: '', phone: '', address: '', password: 'default123' });
      alert('Customer created successfully!');
    } catch (err) {
      alert('Failed to create customer: ' + (err.response?.data?.error || err.message));
    }
  };

  // ✅ Handle DELETE CUSTOMER
  const handleDeleteCustomer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    
    try {
      await adminAPI.deleteCustomer(id);
      await fetchCustomers();
      alert('Customer deleted successfully!');
    } catch (err) {
      alert('Failed to delete customer: ' + (err.response?.data?.error || err.message));
    }
  };

  // ✅ Handle APPROVE CUSTOMER
  const handleApproveCustomer = async (id) => {
    try {
      await adminAPI.approveCustomer(id);
      await fetchCustomers();
      alert('Customer approved successfully!');
    } catch (err) {
      alert('Failed to approve customer: ' + (err.response?.data?.error || err.message));
    }
  };

  // ✅ Handle BLOCK CUSTOMER
  const handleBlockCustomer = async (id, currentStatus) => {
    const action = currentStatus === 'blocked' ? 'unblock' : 'block';
    if (!window.confirm(`Are you sure you want to ${action} this customer?`)) return;
    
    try {
      await adminAPI.blockCustomer(id);
      await fetchCustomers();
      alert(`Customer ${action}ed successfully!`);
    } catch (err) {
      alert(`Failed to ${action} customer: ` + (err.response?.data?.error || err.message));
    }
  };

  // Filter customers
  const filteredCustomers = customers.filter(customer =>
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm)
  );

  if (loading) return <div className="loading">Loading customers...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="customers-container">
      <div className="header-section">
        <h2>Customers List</h2>
        <div className="action-buttons">
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            + Add Customer
          </button>
          <button className="btn btn-secondary" onClick={fetchCustomers}>
            Refresh
          </button>
        </div>
      </div>

      <div className="search-section">
        <input
          type="text"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Trips</th>
              <th>Spent</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map(customer => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>{customer.address || 'N/A'}</td>
                <td>{customer.totalTrips}</td>
                <td>${customer.totalSpent?.toFixed(2)}</td>
                <td>
                  <span className={`status-badge ${customer.status}`}>
                    {customer.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons-group">
                    {customer.status === 'pending' && (
                      <button className="btn btn-success btn-sm" onClick={() => handleApproveCustomer(customer.id)}>
                        Approve
                      </button>
                    )}
                    <button 
                      className={`btn btn-sm ${customer.status === 'blocked' ? 'btn-success' : 'btn-warning'}`}
                      onClick={() => handleBlockCustomer(customer.id, customer.status)}
                    >
                      {customer.status === 'blocked' ? 'Unblock' : 'Block'}
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteCustomer(customer.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Customer Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Customer</h3>
            <form onSubmit={handleCreateCustomer}>
              <input
                type="text"
                placeholder="Name"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Phone"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Address"
                value={newCustomer.address}
                onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
              />
              <div className="modal-buttons">
                <button type="submit" className="btn btn-primary">Create</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersList;