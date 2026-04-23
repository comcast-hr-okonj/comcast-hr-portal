import { useState, useEffect } from "react";

export default function App() {
  const API = "https://comcast-hr-backend-1.onrender.com";

  const [token, setToken] = useState("");
  const [apps, setApps] = useState([]);

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

  // APPLY
  const submit = async () => {
    await fetch(`${API}/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    alert("Submitted!");
  };

  // LOGIN
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

  // APPROVE / REJECT
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

  // DELETE
  const removeApp = async (id) => {
    await fetch(`${API}/applications/${id}`, {
      method: "DELETE",
      headers: { Authorization: token }
    });

    loadApps();
  };

  // LOGOUT
  const logout = () => {
    setToken("");
  };

  /* ---------------- LOGIN UI ---------------- */
  if (!token) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h1>Comcast HR Portal</h1>
          <p>Enterprise Recruitment System</p>

          <h3>Apply for Job</h3>

          <input placeholder="Name" style={styles.input}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />

          <input placeholder="Email" style={styles.input}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />

          <input placeholder="Phone" style={styles.input}
            onChange={(e) => setForm({ ...form, number: e.target.value })} />

          <input placeholder="Position" style={styles.input}
            onChange={(e) => setForm({ ...form, position: e.target.value })} />

          <button style={styles.btn} onClick={submit}>Submit</button>

          <hr />

          <h3>Admin Login</h3>

          <input placeholder="Email" style={styles.input}
            onChange={(e) => setLogin({ ...login, email: e.target.value })} />

          <input type="password" placeholder="Password" style={styles.input}
            onChange={(e) => setLogin({ ...login, password: e.target.value })} />

          <button style={styles.btn} onClick={handleLogin}>Login</button>
        </div>
      </div>
    );
  }

  /* ---------------- DASHBOARD ---------------- */
  return (
    <div style={styles.page}>
      <div style={styles.cardFull}>
        <h2>Admin Dashboard</h2>

        <button style={styles.logout} onClick={logout}>Logout</button>

        <div style={styles.table}>
          {apps.map((a) => (
            <div key={a.id} style={styles.row}>
              <div>{a.name}</div>
              <div>{a.email}</div>
              <div>{a.position}</div>
              <div>{a.status}</div>

              <button onClick={() => updateStatus(a.id, "Approved")}>✔</button>
              <button onClick={() => updateStatus(a.id, "Rejected")}>✖</button>
              <button onClick={() => removeApp(a.id)}>🗑</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- STYLE ---------------- */
const styles = {
  page: {
    fontFamily: "Arial",
    background: "#0b3d91",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    background: "white",
    padding: 20,
    width: 350,
    borderRadius: 10
  },
  cardFull: {
    background: "white",
    padding: 20,
    width: "90%",
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
    background: "#007bff",
    color: "white"
  },
  logout: {
    float: "right",
    background: "red",
    color: "white"
  },
  table: {
    marginTop: 20
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr auto auto auto",
    gap: 10,
    padding: 10,
    borderBottom: "1px solid #ccc"
  }
};
