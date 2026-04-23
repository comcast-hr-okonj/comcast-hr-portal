import { useState, useEffect } from "react";

export default function App() {
  const API = "https://comcast-hr-backend-1.onrender.com";

  const [token, setToken] = useState("");
  const [apps, setApps] = useState([]);
  const [dark, setDark] = useState(false);

  const [login, setLogin] = useState({ email: "", password: "" });
  const [form, setForm] = useState({
    name: "",
    email: "",
    number: "",
    position: ""
  });

  // LOAD
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

  // SUBMIT
  const submit = async () => {
    await fetch(`${API}/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    alert("Application submitted");
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

  // DELETE
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
      <div style={dark ? styles.darkPage : styles.page}>

        <img
          src="https://upload.wikimedia.org/wikipedia/commons/8/8b/Comcast_Logo.png"
          style={{ width: 130 }}
        />

        <h2>Comcast HR Portal</h2>
        <p>Enterprise SaaS Recruitment System</p>

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

          <button onClick={() => setDark(!dark)}>
            Toggle Dark Mode
          </button>

        </div>
      </div>
    );
  }

  /* ================= DASHBOARD ================= */
  return (
    <div style={styles.layout}>

      <div style={styles.sidebar}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/8/8b/Comcast_Logo.png"
          style={{ width: 120 }}
        />

        <button onClick={logout} style={styles.logout}>
          Logout
        </button>
      </div>

      <div style={styles.main}>
        <h2>Admin Dashboard</h2>

        {apps.map((a) => (
          <div key={a.id} style={styles.row}>
            <div>{a.name}</div>
            <div>{a.email}</div>
            <div>{a.position}</div>
            <div>{a.status}</div>

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
  darkPage: { background: "#0b0f1a", color: "white", minHeight: "100vh", textAlign: "center", padding: 20 },

  card: { background: "white", padding: 20, width: 380, margin: "auto" },

  input: { width: "100%", padding: 10, margin: 5 },

  btn: { width: "100%", padding: 10, background: "#0078d7", color: "white" },

  loginBtn: { width: "100%", padding: 10, background: "#0b2e6b", color: "white" },

  layout: { display: "flex" },

  sidebar: { width: 200, background: "#0b2e6b", color: "white", height: "100vh", padding: 10 },

  logout: { marginTop: 20, background: "red", color: "white" },

  main: { flex: 1, padding: 20 },

  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
    padding: 10,
    borderBottom: "1px solid #ccc"
  }
};
