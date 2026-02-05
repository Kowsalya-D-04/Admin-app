import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AssignDriverToLoad.css"; // Optional: for styling

const AssignDriverToLoad = () => {
  const [loads, setLoads] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [notification, setNotification] = useState({ type: "", message: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      setNotification({ type: "", message: "" });

      // Fetch pending load requests and drivers concurrently
      const [loadsRes, driversRes] = await Promise.all([
        axios.get("http://localhost:8080/api/admin/load-requests/pending"),
        axios.get("http://localhost:8080/api/admin/drivers"),
      ]);

      // Extract data safely from API responses
      const loadsData = Array.isArray(loadsRes.data)
        ? loadsRes.data
        : loadsRes.data?.data || loadsRes.data?.content || [];

      const driversData = Array.isArray(driversRes.data)
        ? driversRes.data
        : driversRes.data?.data || driversRes.data?.content || [];

      // Filter to show only available/unassigned drivers
      const availableDrivers = driversData.filter(
        (driver) => driver.status === "AVAILABLE" || driver.status === "APPROVED"
      );

      setLoads(loadsData);
      setDrivers(availableDrivers);

      if (loadsData.length === 0) {
        setNotification({ 
          type: "info", 
          message: "No pending load requests found." 
        });
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(
        err.response?.data?.message || 
        err.message || 
        "Failed to load data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDriverSelect = (loadId, driverId) => {
    setSelectedDriver((prev) => ({
      ...prev,
      [loadId]: driverId,
    }));
  };

  const assignDriver = async (loadRequestId, loadData) => {
    const driverId = selectedDriver[loadRequestId];

    if (!driverId) {
      setNotification({ 
        type: "error", 
        message: "Please select a driver before assigning." 
      });
      return;
    }

    // Confirm assignment
    const selectedDriverData = drivers.find(d => d.id === parseInt(driverId));
    const isConfirmed = window.confirm(
      `Assign ${selectedDriverData?.name || "this driver"} to Load ${loadRequestId}?\n\n` +
      `From: ${loadData.pickupLocation}\n` +
      `To: ${loadData.dropLocation}`
    );

    if (!isConfirmed) return;

    setAssigning(true);
    setNotification({ type: "", message: "" });

    try {
      const response = await axios.post(
        `http://localhost:8080/api/admin/assign/${loadRequestId}`,
        { driverId }
      );

      // Check for successful response
      if (response.data.success) {
        setNotification({ 
          type: "success", 
          message: response.data.message || "Driver assigned successfully!" 
        });
        
        // Refresh data after successful assignment
        setTimeout(() => {
          fetchData();
          // Clear selection for this load
          setSelectedDriver((prev) => {
            const newSelection = { ...prev };
            delete newSelection[loadRequestId];
            return newSelection;
          });
        }, 1500);
      } else {
        throw new Error(response.data.message || "Assignment failed");
      }
    } catch (err) {
      console.error("Assignment error:", err);
      setNotification({ 
        type: "error", 
        message: err.response?.data?.message || 
                err.message || 
                "Failed to assign driver. Please try again." 
      });
    } finally {
      setAssigning(false);
    }
  };

  // Format date if present in load data
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading pending loads and drivers...</p>
      </div>
    );
  }

  return (
    <div className="assign-driver-container">
      <div className="page-header">
        <h1>Assign Driver to Load</h1>
        <button 
          onClick={fetchData} 
          className="refresh-btn"
          disabled={assigning}
        >
          🔄 Refresh
        </button>
      </div>

      {error && (
        <div className="error-alert">
          <strong>Error:</strong> {error}
          <button onClick={() => setError("")} className="close-btn">✕</button>
        </div>
      )}

      {notification.message && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
          <button 
            onClick={() => setNotification({ type: "", message: "" })} 
            className="close-btn"
          >
            ✕
          </button>
        </div>
      )}

      <div className="stats-bar">
        <div className="stat">
          <span className="stat-label">Pending Loads:</span>
          <span className="stat-value">{loads.length}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Available Drivers:</span>
          <span className="stat-value">{drivers.length}</span>
        </div>
      </div>

      {loads.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No Pending Load Requests</h3>
          <p>All load requests have been assigned or there are no pending requests at the moment.</p>
          <button onClick={fetchData} className="primary-btn">
            Check Again
          </button>
        </div>
      ) : (
        <div className="table-container">
          <table className="loads-table">
            <thead>
              <tr>
                <th>Load ID</th>
                <th>Pickup Location</th>
                <th>Drop Location</th>
                <th>Request Date</th>
                <th>Select Driver</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loads.map((load) => (
                <tr key={load.loadRequestId || load.id} className="load-row">
                  <td className="load-id">
                    <strong>{load.loadRequestId || load.id}</strong>
                  </td>
                  <td className="pickup">
                    {load.pickupLocation || "Not specified"}
                  </td>
                  <td className="drop">
                    {load.dropLocation || "Not specified"}
                  </td>
                  <td className="date">
                    {formatDate(load.createdAt || load.requestDate)}
                  </td>
                  <td className="driver-select">
                    <select
                      value={selectedDriver[load.loadRequestId] || ""}
                      onChange={(e) => 
                        handleDriverSelect(load.loadRequestId, e.target.value)
                      }
                      className="driver-dropdown"
                      disabled={assigning}
                    >
                      <option value="">Select Driver</option>
                      {drivers.map((driver) => (
                        <option key={driver.id} value={driver.id}>
                          {driver.name} ({driver.licenseNumber || driver.phone || driver.id})
                          {driver.vehicleNumber ? ` - ${driver.vehicleNumber}` : ""}
                        </option>
                      ))}
                    </select>
                    {selectedDriver[load.loadRequestId] && (
                      <div className="selected-driver-info">
                        Selected: {
                          drivers.find(d => d.id === parseInt(selectedDriver[load.loadRequestId]))?.name
                        }
                      </div>
                    )}
                  </td>
                  <td className="action-cell">
                    <button
                      onClick={() => assignDriver(load.loadRequestId, load)}
                      disabled={
                        !selectedDriver[load.loadRequestId] || 
                        assigning
                      }
                      className={`assign-btn ${
                        !selectedDriver[load.loadRequestId] ? "disabled" : ""
                      }`}
                    >
                      {assigning ? "Assigning..." : "Assign Driver"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {assigning && (
        <div className="overlay">
          <div className="assigning-spinner"></div>
          <p>Assigning driver...</p>
        </div>
      )}
    </div>
  );
};

export default AssignDriverToLoad;