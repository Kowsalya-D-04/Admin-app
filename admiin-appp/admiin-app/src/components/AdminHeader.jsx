const AdminHeader = ({ onLogout }) => {
  return (
    <div style={styles.header}>
      <div style={styles.left}>
        <img
          src="/logo.png"
          alt="Logo"
          style={{ height: 40 }}
        />
        <h2 style={{ marginLeft: 15 }}>RIGHT POLAM RIGHT</h2>
      </div>

      <button style={styles.logout} onClick={onLogout}>
        Logout
      </button>
    </div>
  );
};

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    background: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  left: {
    display: "flex",
    alignItems: "center",
  },
  logout: {
    background: "#e11d48",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: 6,
    cursor: "pointer",
  },
};

export default AdminHeader;
