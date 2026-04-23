import { useState, useEffect } from "react";

export default function App() {
  const API = "https://comcast-hr-backend-1.onrender.com";

  const [token, setToken] = useState("");
  const [apps, setApps] = useState([]);
  const [stats, setStats] = useState({});

  const [login, setLogin] = useState({
    email: "",
    password: ""
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    number: "",
    position: ""
  });

  // LOAD DATA
  const loadApps = async (t) => {
    const res = await fetch(`${API}/applications`, {
      headers: { Authorization: t }
    });
    setApps(await res.json());
  };

  const loadStats = async (t) => {
    const res = await fetch(`${API}/stats`, {
      headers: { Authorization: t }
    });
    setStats(await res.json());
  };

  useEffect(() => {
    if (token) {
      loadApps(token);
      loadStats(token);

      const interval = setInterval(() => {
        loadApps(token);
        loadStats(token);
      }, 5000);

      return () => clearInterval(interval);
    }
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
  };

  // STATUS UPDATE
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
    loadStats(token);
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

  /* ================= LOGIN PAGE ================= */
  if (!token) {
    return (
      <div style={styles.loginWrap}>
        <div style={styles.card}>
          <h2>Comcast HR Portal</h2>
          <p>Enterprise SaaS System</p>

          <input placeholder="Name"
            style={styles.input}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />

          <input placeholder="Email"
            style={styles.input}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />

          <input placeholder="Phone"
            style={styles.input}
            onChange={(e) => setForm({ ...form, number: e.target.value })} />

          <input placeholder="Position"
            style={styles.input}
            onChange={(e) => setForm({ ...form, position: e.target.value })} />

          <button onClick={submit} style={styles.btn}>
            Submit Application
          </button>

          <hr />

          <input placeholder="Admin Email"
            style={styles.input}
            onChange={(e) => setLogin({ ...login, email: e.target.value })} />

          <input type="password" placeholder="Password"
            style={styles.input}
            onChange={(e) => setLogin({ ...login, password: e.target.value })} />

          <button onClick={handleLogin} style={styles.btnBlue}>
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
        <h3>HR SaaS</h3>
        <button onClick={logout} style={styles.logout}>Logout</button>
      </div>

      <div style={styles.main}>

        {/* STATS */}
        <div style={styles.stats}>
          <div>Total {stats.total}</div>
          <div>Pending {stats.pending}</div>
          <div>Approved {stats.approved}</div>
          <div>Rejected {stats.rejected}</div>
        </div>

        {/* TABLE */}
        <div style={styles.table}>

          <div style={styles.header}>
            <div>Name</div>
            <div>Email</div>
            <div>Phone</div>
            <div>Position</div>
            <div>Status</div>
            <div>Actions</div>
          </div>

          {apps.map((a) => (
            <div key={a.id} style={styles.row}>
              <div>{a.name}</div>
              <div>{a.email}</div>
              <div>{a.number}</div>
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
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  loginWrap: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0b2e6b"
  },

  card: {
    background: "white",
    padding: 20,
    width: 380
  },

  input: {
    width: "100%",
    padding: 10,
    margin: 5
  },

  btn: {
    width: "100%",
    padding: 10
  },

  btnBlue: {
    width: "100%",
    padding: 10,
    background: "#0078d7",
    color: "white",
    border: "none"
  },

  layout: {
    display: "flex",
    fontFamily: "Arial"
  },

  sidebar: {
    width: 200,
    background: "#0b2e6b",
    color: "white",
    height: "100vh",
    padding: 20
  },

  logout: {
    marginTop: 20,
    background: "red",
    color: "white",
    border: "none",
    padding: 10
  },

  main: {
    flex: 1,
    padding: 20,
    background: "#f4f6fb"
  },

  stats: {
    display: "flex",
    gap: 10,
    marginBottom: 20
  },

  table: {
    background: "white",
    padding: 10
  },

  header: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr",
    fontWeight: "bold",
    borderBottom: "2px solid #ddd"
  },

  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr",
    padding: 10,
    borderBottom: "1px solid #eee"
  }
};
