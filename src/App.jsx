import { useState, useEffect } from "react";

export default function App() {
  const API = "https://comcast-hr-backend-1.onrender.com";

  const [token, setToken] = useState("");
  const [apps, setApps] = useState([]);
  const [view, setView] = useState("dashboard");

  const [login, setLogin] = useState({ email: "", password: "" });

  const [form, setForm] = useState({
    name: "",
    email: "",
    number: "",
    position: ""
  });

  const loadApps = async () => {
    const res = await fetch(`${API}/applications`, {
      headers: { Authorization: token }
    });

    const data = await res.json();
    setApps(data);
  };

  useEffect(() => {
    if (token) loadApps();
  }, [token]);

  const submit = async () => {
    await fetch(`${API}/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    alert("Application submitted");
  };

  const handleLogin = async () => {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(login)
    });

    const data = await res.json();

    if (data.token) {
      setToken(data.token);
    } else {
      alert("Wrong credentials");
    }
  };

  const updateStatus = async (id, status) => {
    await fetch(`${API}/applications/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({ status })
    });

    loadApps();
  };

  const removeApp = async (id) => {
    await fetch(`${API}/applications/${id}`, {
      method: "DELETE",
      headers: { Authorization: token }
    });

    loadApps();
  };

  const logout = () => {
    setToken("");
  };

  /* ---------------- LOGIN ---------------- */
  if (!token) {
    return (
      <div style={styles.loginPage}>
        <div style={styles.loginCard}>
          <h2>Comcast HR Portal</h2>
          <p>Enterprise Recruitment System</p>

          <h4>Apply for Job</h4>

          <input style={styles.input} placeholder="Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })} />

          <input style={styles.input} placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })} />

          <input style={styles.input} placeholder="Phone"
            onChange={(e) => setForm({ ...form, number: e.target.value })} />

          <input style={styles.input} placeholder="Position"
            onChange={(e) => setForm({ ...form, position: e.target.value })} />

          <button style={styles.btn} onClick={submit}>Submit</button>

          <hr />

          <h4>Admin Login</h4>

          <input style={styles.input} placeholder="Email"
            onChange={(e) => setLogin({ ...login, email: e.target.value })} />

          <input style={styles.input} type="password" placeholder="Password"
            onChange={(e) => setLogin({ ...login, password: e.target.value })} />

          <button style={styles.btn} onClick={handleLogin}>Login</button>
        </div>
      </div>
    );
  }

  /* ---------------- DASHBOARD ---------------- */
  return (
    <div style={styles.layout}>
      
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <h3>Comcast HR</h3>

        <button style={styles.navBtn} onClick={() => setView("dashboard")}>
          Dashboard
        </button>

        <button style={styles.navBtn} onClick={() => setView("applications")}>
          Applications
        </button>

        <button style={styles.logoutBtn} onClick={logout}>
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div style={styles.main}>
        <h2>Admin Panel</h2>

        {view === "dashboard" && (
          <div style={styles.card}>
            <h3>Overview</h3>
            <p>Total Applications: {apps.length}</p>
          </div>
        )}

        {view === "applications" && (
          <div style={styles.table}>
            <div style={styles.rowHeader}>
              <div>Name</div>
              <div>Email</div>
              <div>Position</div>
              <div>Status</div>
              <div>Actions</div>
            </div>

            {apps.map((a) => (
              <div key={a.id} style={styles.row}>
                <div>{a.name}</div>
                <div>{a.email}</div>
                <div>{a.position}</div>
                <div>{a.status}</div>

                <div>
                  <button onClick={() => updateStatus(a.id, "Approved")}>✔</button>
                  <button onClick={() => updateStatus(a.id, "Rejected")}>✖</button>
                  <button onClick={() => removeApp(a.id)}>🗑</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */
const styles = {
  loginPage: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0b2e6b",
    fontFamily: "Arial"
  },

  loginCard: {
    background: "white",
    padding: 25,
    width: 360,
    borderRadius: 10
  },

  input: {
    width: "100%",
    padding: 10,
    margin: 5
  },

  btn: {
    width: "100%",
    padding: 10,
    background: "#0078d7",
    color: "white",
    border: "none",
    marginTop: 10
  },

  layout: {
    display: "flex",
    fontFamily: "Arial"
  },

  sidebar: {
    width: 220,
    height: "100vh",
    background: "#0b2e6b",
    color: "white",
    padding: 20
  },

  navBtn: {
    width: "100%",
    padding: 10,
    marginTop: 10,
    background: "transparent",
    color: "white",
    border: "1px solid white"
  },

  logoutBtn: {
    width: "100%",
    padding: 10,
    marginTop: 30,
    background: "red",
    color: "white",
    border: "none"
  },

  main: {
    flex: 1,
    padding: 20,
    background: "#f4f6f8"
  },

  card: {
    background: "white",
    padding: 20,
    borderRadius: 10
  },

  table: {
    background: "white",
    padding: 10,
    borderRadius: 10
  },

  rowHeader: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
    fontWeight: "bold",
    padding: 10,
    borderBottom: "2px solid #ddd"
  },

  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
    padding: 10,
    borderBottom: "1px solid #eee"
  }
};
