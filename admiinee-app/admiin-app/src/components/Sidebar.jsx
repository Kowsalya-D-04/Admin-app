import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div style={{ padding: 10, background: "#ddd" }}>
      <Link to="/dashboard">Dashboard</Link> |{" "}
      <Link to="/drivers">Drivers</Link> |{" "}
      <Link to="/customers">Customers</Link> |{" "}
      <Link to="/trips">Trips</Link> |{" "}
      <Link to="/payments">Payments</Link>
    </div>
  );
};

export default Sidebar;
