import { useState, useEffect } from "react";

export default function App() {
  const API = "https://comcast-hr-backend-1.onrender.com";

  const [token, setToken] = useState("");
  const [apps, setApps] = useState([]);

  const [login, setLogin] = useState({ email: "", password: "" });

  const [form, setForm] = useState({
    name: "",
    email: "",
    number: "",
    position: "",
    address: ""
  });

  // LOAD APPLICATIONS
  const loadApps = async (t) => {
    const res = await fetch(`${API}/applications`, {
      headers: { Authorization: t }
    });
    setApps(await res.json());
  };

  useEffect(() => {
    if (token) loadApps(token);
  }, [token]);

  // LOGIN
  const handleLogin = async () => {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(login)
    });

    const data = await res.json();
    if (data.token) setToken(data.token);
    else alert("Wrong credentials");
  };

  // SUBMIT APPLICATION
  const submit = async () => {
    await fetch(`${API}/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    alert("Application submitted");

    setForm({
      name: "",
      email: "",
      number: "",
      position: "",
      address: ""
    });
  };

  // UPDATE STATUS
  const updateStatus = async (id, status) => {
    await fetch(`${API}/applications/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({ status })
    });

    loadApps(token);
  };

  // DELETE APPLICATION
  const remove = async (id) => {
    await fetch(`${API}/applications/${id}`, {
      method: "DELETE",
      headers: { Authorization: token }
    });

    loadApps(token);
  };

  const logout = () => setToken("");

  /* ================= PUBLIC PAGE ================= */
  if (!token) {
    return (
      <div style={styles.page}>

        <h1>Comcast HR Portal</h1>
        <p>Enterprise Recruitment System</p>

        <div style={styles.card}>
          <h3>Apply for Job</h3>

          <input placeholder="Name" style={styles.input}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />

          <input placeholder="Email" style={styles.input}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />

          <input placeholder="Phone" style={styles.input}
            onChange={(e) => setForm({ ...form, number: e.target.value })} />

          <input placeholder="Position" style={styles.input}
            onChange={(e) => setForm({ ...form, position: e.target.value })} />

          <input placeholder="Address" style={styles.input}
            onChange={(e) => setForm({ ...form, address: e.target.value })} />

          <button style={styles.btn} onClick={submit}>
            Submit Application
          </button>

          <hr />

          <h3>Admin Login</h3>

          <input placeholder="Email" style={styles.input}
            onChange={(e) => setLogin({ ...login, email: e.target.value })} />

          <input type="password" placeholder="Password" style={styles.input}
            onChange={(e) => setLogin({ ...login, password: e.target.value })} />

          <button style={styles.loginBtn} onClick={handleLogin}>
            Login
          </button>

        </div>
      </div>
    );
  }

  /* ================= DASHBOARD ================= */
  return (
    <div style={styles.layout}>

      <div style={styles.sidebar}>
        <h3>HR Admin</h3>
        <button onClick={logout} style={styles.logout}>
          Logout
        </button>
      </div>

      <div style={styles.main}>
        <h2>Applications Dashboard</h2>

        {apps.map((a) => (
          <div key={a.id} style={styles.cardRow}>

            <div>
              <b>{a.name}</b>
              <div style={styles.small}>{a.email}</div>
            </div>

            <div>{a.position}</div>
            <div>{a.address}</div>

            <div>
              <span style={{
                ...styles.badge,
                background:
                  a.status === "Approved"
                    ? "green"
                    : a.status === "Rejected"
                    ? "red"
                    : "orange"
              }}>
                {a.status}
              </span>
            </div>

            <div>
              <button onClick={() => updateStatus(a.id, "Approved")}>✔</button>
              <button onClick={() => updateStatus(a.id, "Rejected")}>✖</button>
              <button onClick={() => remove(a.id)}>🗑</button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  page: { textAlign: "center", padding: 20 },

  card: {
    background: "#fff",
    padding: 20,
    width: 400,
    margin: "auto",
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
    color: "white"
  },

  loginBtn: {
    width: "100%",
    padding: 10,
    background: "#0b2e6b",
    color: "white"
  },

  layout: { display: "flex" },

  sidebar: {
    width: 180,
    background: "#0b2e6b",
    color: "white",
    height: "100vh",
    padding: 10
  },

  logout: {
    marginTop: 20,
    background: "red",
    color: "white"
  },

  main: {
    flex: 1,
    padding: 20
  },

  cardRow: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
    padding: 15,
    marginBottom: 10,
    background: "#fff",
    borderRadius: 10
  },

  small: { fontSize: 12, color: "#666" },

  badge: {
    padding: "5px 10px",
    borderRadius: 20,
    color: "white",
    fontSize: 12
  }
};
