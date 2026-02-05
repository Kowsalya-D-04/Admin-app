
  // src/components/Payments.jsx
import React, { useState, useEffect } from 'react';
import { adminAPI } from '../api/adminApi';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllPayments();
      setPayments(response.data.payments || response.data || []);
    } catch (err) {
      setError('Failed to load payments');
      console.error('Payments Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading payments...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="payments">
      <h2>Payments</h2>
      
      <table className="data-table">
        <thead>
          <tr>
            <th>Payment ID</th>
            <th>Load ID</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Payment Mode</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.length === 0 ? (
            <tr>
              <td colSpan="7" className="no-data">No payments found</td>
            </tr>
          ) : (
            payments.map(payment => (
              <tr key={payment.id}>
                <td>{payment.paymentId || payment.id}</td>
                <td>{payment.loadId || 'N/A'}</td>
                <td>{payment.customerName || payment.customer}</td>
                <td>₹{(payment.amount || 0).toLocaleString()}</td>
                <td>{payment.paymentMode || payment.mode || 'N/A'}</td>
                <td>
                  <span className={`status-badge status-${payment.status?.toLowerCase() || 'pending'}`}>
                    {payment.status || 'PENDING'}
                  </span>
                </td>
                <td>{payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'N/A'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Payments;