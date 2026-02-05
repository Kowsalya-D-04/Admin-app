import axios from 'axios';

const API_BASE_URL = 'http://192.168.1.11:8080/api/admin';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000,
});

/* ================= INTERCEPTORS ================= */

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log('📤 API REQUEST:', config.method?.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    console.log('📥 API RESPONSE:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error(
      '📥 API ERROR:',
      error.config?.url,
      error.response?.status,
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);

// Helper functions for data transformation
const transformCustomerForAPI = (customerData) => {
  return {
    name: customerData.name,
    email: customerData.email,
    phone_number: customerData.phone,
    address: customerData.address || '',
    password: customerData.password || 'default123',
  };
};

const transformCustomerFromAPI = (customer) => {
  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone_number || customer.phone,
    address: customer.address,
    password: customer.password,
    totalTrips: customer.total_bookings || 0,
    totalSpent: customer.total_spent || 0,
    createdAt: customer.registered_at || customer.createdAt,
    status: customer.status || 'pending',
  };
};

/* ================= ADMIN APIs ================= */

export const adminAPI = {
  /* -------- AUTH -------- */
  login: (credentials) => api.post('/login', credentials),

  /* -------- DASHBOARD -------- */
  getDashboardSummary: () => api.get('/dashboard/summary'),

  /* ========== CUSTOMERS MANAGEMENT ========== */
  
  // ✅ GET ALL CUSTOMERS (with transformation)
  getAllCustomers: async () => {
    try {
      const response = await api.get('/customers');
      const customers = Array.isArray(response.data) 
        ? response.data.map(transformCustomerFromAPI)
        : response.data?.customers 
          ? response.data.customers.map(transformCustomerFromAPI)
          : [];
      
      return {
        ...response,
        data: customers
      };
    } catch (error) {
      console.error('Error in getAllCustomers:', error);
      throw error;
    }
  },

  // ✅ GET SINGLE CUSTOMER
  getCustomerById: (customerId) => 
    api.get(`/customers/${customerId}`),

  // ✅ CREATE CUSTOMER (with transformation)
  createCustomer: (customerData) => {
    const apiData = transformCustomerForAPI(customerData);
    return api.post('/customers', apiData);
  },

  // ✅ UPDATE CUSTOMER (with transformation)
  updateCustomer: (customerId, customerData) => {
    const apiData = transformCustomerForAPI(customerData);
    return api.put(`/customers/${customerId}`, apiData);
  },

  // ✅ DELETE CUSTOMER
  deleteCustomer: (customerId) =>
    api.delete(`/customers/${customerId}`),

  // ✅ APPROVE CUSTOMER
  approveCustomer: (customerId) =>
    api.put(`/customers/${customerId}/approve`),

  // ✅ BLOCK CUSTOMER (toggle block/unblock)
  blockCustomer: (customerId) =>
    api.put(`/customers/${customerId}/block`),

  // ✅ UNBLOCK CUSTOMER
  unblockCustomer: (customerId) =>
    api.put(`/customers/${customerId}/unblock`),

  // ✅ SEARCH CUSTOMERS
  searchCustomers: (searchQuery) =>
    api.get('/customers/search', { params: { q: searchQuery } }),

  // ✅ EXPORT CUSTOMERS
  exportCustomers: () =>
    api.get('/customers/export', { responseType: 'blob' }),

  /* ========== DRIVERS MANAGEMENT ========== */
  
  // ✅ GET ALL DRIVERS
  getAllDrivers: () => api.get('/drivers'),

  // ✅ GET DRIVER BY ID
  getDriverById: (driverId) => 
    api.get(`/drivers/${driverId}`),

  // ✅ CREATE DRIVER
  createDriver: (driverData) =>
    api.post('/drivers', driverData),

  // ✅ APPROVE DRIVER
  approveDriver: (driverId) =>
    api.put(`/drivers/${driverId}/approve`),

  // ✅ UPDATE DRIVER
  updateDriver: (driverId, data) =>
    api.put(`/drivers/${driverId}`, data),

  // ✅ DELETE DRIVER
  deleteDriver: (driverId) =>
    api.delete(`/drivers/${driverId}`),

  // ✅ BLOCK/UNBLOCK DRIVER
  toggleDriverStatus: (driverId) =>
    api.put(`/drivers/${driverId}/toggle-status`),

  // ✅ UPLOAD DRIVER DOCUMENTS
  uploadDriverDocument: (driverId, formData) =>
    api.post(`/drivers/${driverId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  /* ========== LOAD REQUESTS ========== */
  
  // ✅ GET ALL LOAD REQUESTS
  getAllLoadRequests: () => api.get('/load-requests'),

  // ✅ GET PENDING LOAD REQUESTS
  getPendingLoadRequests: () =>
    api.get('/load-requests/pending'),

  // ✅ GET LOAD REQUEST BY ID
  getLoadRequestById: (loadRequestId) =>
    api.get(`/load-requests/${loadRequestId}`),

  // // ✅ ASSIGN DRIVER TO LOAD
  // assignDriverToLoad: (loadRequestId, driverId) =>
  //   api.post(`/load-requests/${loadRequestId}/assign`, { driverId }),
  // Assign a driver to a customer's pending load request
 
   // ✅ ASSIGN DRIVER TO CUSTOMER LOAD (CORRECTED)
assignDriverToLoad: (customerLoadId, driverLoadRequestId) =>
  api.post("/assign/customer-to-driver", {
    customerLoadId: Number(customerLoadId),
    driverLoadRequestId: Number(driverLoadRequestId),
  }),




  // ✅ CLEAR ASSIGNED DRIVER
  clearAssignedDriver: (loadRequestId) =>
    api.delete(`/load-requests/${loadRequestId}/assignment`),

  // ✅ UPDATE LOAD STATUS
  updateLoadStatus: (loadRequestId, status) =>
    api.put(`/load-requests/${loadRequestId}/status`, { status }),

  // ✅ DELETE LOAD REQUEST
  deleteLoadRequest: (loadRequestId) =>
    api.delete(`/load-requests/${loadRequestId}`),
  /* ========== DRIVER LOAD REQUESTS ========== */

// ✅ GET ALL DRIVER LOAD REQUESTS
getDriverLoadRequests: () =>
  api.get('/driver-load-requests'),

// ✅ APPROVE DRIVER LOAD REQUEST
approveDriverLoadRequest: (id) =>
  api.put(`/driver-load-requests/${id}/approve`),

// ✅ REJECT DRIVER LOAD REQUEST
rejectDriverLoadRequest: (id) =>
  api.put(`/driver-load-requests/${id}/reject`),

  /* ========== TRIPS MANAGEMENT ========== */
  
  // ✅ GET ALL TRIPS
  getAllTrips: () => api.get('/trips'),

  // ✅ GET TRIP BY ID
  getTripById: (tripId) => api.get(`/trips/${tripId}`),

  // ✅ CREATE TRIP
  createTrip: (tripData) => api.post('/trips', tripData),

  // ✅ UPDATE TRIP
  updateTrip: (tripId, tripData) => api.put(`/trips/${tripId}`, tripData),

  // ✅ UPDATE TRIP STATUS
  updateTripStatus: (tripId, status) =>
    api.put(`/trips/${tripId}/status`, { status }),

  // ✅ DELETE TRIP
  deleteTrip: (tripId) => api.delete(`/trips/${tripId}`),

  // ✅ GET TRIP STATISTICS
  getTripStatistics: () => api.get('/trips/statistics'),

  /* ========== PAYMENTS ========== */
  
  // ✅ GET ALL PAYMENTS
  getAllPayments: () => api.get('/payments'),

  // ✅ GET PAYMENT BY ID
  getPaymentById: (paymentId) => api.get(`/payments/${paymentId}`),

  // ✅ UPDATE PAYMENT STATUS
  updatePaymentStatus: (paymentId, status) =>
    api.put(`/payments/${paymentId}/status`, { status }),

  // ✅ GET PAYMENT STATISTICS
  getPaymentStatistics: () => api.get('/payments/statistics'),

  // ✅ EXPORT PAYMENTS
  exportPayments: () => api.get('/payments/export', { responseType: 'blob' }),

  /* ========== REPORTS ========== */
  
  // ✅ GET CUSTOMER REPORTS
  getCustomerReports: (startDate, endDate) =>
    api.get('/reports/customers', { params: { startDate, endDate } }),

  // ✅ GET DRIVER REPORTS
  getDriverReports: (startDate, endDate) =>
    api.get('/reports/drivers', { params: { startDate, endDate } }),

  // ✅ GET REVENUE REPORTS
  getRevenueReports: (startDate, endDate) =>
    api.get('/reports/revenue', { params: { startDate, endDate } }),

  // ✅ GET TRIP REPORTS
  getTripReports: (startDate, endDate) =>
    api.get('/reports/trips', { params: { startDate, endDate } }),

  /* ========== SETTINGS ========== */
  
  // ✅ GET SYSTEM SETTINGS
  getSystemSettings: () => api.get('/settings'),

  // ✅ UPDATE SYSTEM SETTINGS
  updateSystemSettings: (settings) => api.put('/settings', settings),

  // ✅ GET NOTIFICATIONS
  getNotifications: () => api.get('/notifications'),

  // ✅ MARK NOTIFICATION AS READ
  markNotificationAsRead: (notificationId) =>
    api.put(`/notifications/${notificationId}/read`),

  // ✅ CLEAR ALL NOTIFICATIONS
  clearAllNotifications: () => api.delete('/notifications'),

  /* ========== BACKUP & EXPORT ========== */
  
  // ✅ CREATE BACKUP
  createBackup: () => api.post('/backup/create'),

  // ✅ EXPORT DATA
  exportData: (type) => api.get(`/export/${type}`, { responseType: 'blob' }),

  /* ========== USER MANAGEMENT ========== */
  
  // ✅ GET ADMIN PROFILE
  getAdminProfile: () => api.get('/profile'),

  // ✅ UPDATE ADMIN PROFILE
  updateAdminProfile: (profileData) => api.put('/profile', profileData),

  // ✅ CHANGE PASSWORD
  changePassword: (passwordData) => api.put('/change-password', passwordData),

  // ✅ GET ADMIN ACTIVITY LOGS
  getActivityLogs: () => api.get('/activity-logs'),

  // ✅ CLEAR ACTIVITY LOGS
  clearActivityLogs: () => api.delete('/activity-logs'),
};

export default api;