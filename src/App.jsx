import { useState } from "react";

export default function App() {
  const API = "http://localhost:3000";

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

  // 🔷 HEADER (FULL WIDTH + LOGO)
  const Header = () => (
    <div style={{
      width: "100%",
      background: "linear-gradient(90deg,#0b3d91,#1266f1)",
      color: "white",
      padding: "18px 25px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      boxShadow: "0 2px 10px rgba(0,0,0,0.2)"
    }}>
      
      <div>
        <h2 style={{ margin: 0 }}>Comcast HR Portal</h2>
        <small>Enterprise Recruitment System</small>
      </div>

      {/* GOOD LOGO (NO FILE NEEDED) */}
      <img
        src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
        style={{
          width: 55,
          height: 55,
          background: "white",
          borderRadius: 10,
          padding: 5
        }}
      />
    </div>
  );

  // 🔐 LOGIN
  const handleLogin = async () => {
    const res = await fetch(API + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(login)
    });

    const data = await res.json();

    if (!res.ok) {
      alert("Login failed");
      return;
    }

    setToken(data.token);
    loadApps(data.token);
  };

  // 📊 LOAD DATA
  const loadApps = async (tok) => {
    const res = await fetch(API + "/applications", {
      headers: { Authorization: tok }
    });

    const data = await res.json();
    setApps(data);
  };

  // 📝 APPLY
  const submit = async () => {
    await fetch(API + "/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    alert("Application submitted!");
  };

  // 🌐 PAGE WRAPPER (FULL SCREEN)
  const pageStyle = {
    minHeight: "100vh",
    background: "#f4f6f9",
    fontFamily: "Arial"
  };

  const container = {
    maxWidth: 900,
    margin: "30px auto",
    background: "white",
    padding: 25,
    borderRadius: 10,
    boxShadow: "0 0 15px rgba(0,0,0,0.08)"
  };

  // 👤 PUBLIC PAGE
  if (!token) {
    return (
      <div style={pageStyle}>
        <Header />

        <div style={container}>
          <h2>Apply for Job</h2>

          <input placeholder="Name"
            style={inputStyle}
            onChange={e => setForm({ ...form, name: e.target.value })} />

          <input placeholder="Email"
            style={inputStyle}
            onChange={e => setForm({ ...form, email: e.target.value })} />

          <input placeholder="Phone"
            style={inputStyle}
            onChange={e => setForm({ ...form, number: e.target.value })} />

          <input placeholder="Position"
            style={inputStyle}
            onChange={e => setForm({ ...form, position: e.target.value })} />

          <button style={btn} onClick={submit}>
            Submit
          </button>

          <hr />

          <h3>Admin Login</h3>

          <input placeholder="Email"
            style={inputStyle}
            onChange={e => setLogin({ ...login, email: e.target.value })} />

          <input type="password"
            placeholder="Password"
            style={inputStyle}
            onChange={e => setLogin({ ...login, password: e.target.value })} />

          <button style={btn} onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    );
  }

  // 🔐 ADMIN DASHBOARD
  return (
    <div style={pageStyle}>
      <Header />

      <div style={container}>
        <h2>Admin Dashboard</h2>

        <table style={{
          width: "100%",
          borderCollapse: "collapse"
        }}>
          <thead>
            <tr style={{ background: "#eee" }}>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Position</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {apps.map((a, i) => (
              <tr key={a.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td>{i + 1}</td>
                <td>{a.name}</td>
                <td>{a.email}</td>
                <td>{a.number}</td>
                <td>{a.position}</td>
                <td>{a.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 🎨 STYLES
const inputStyle = {
  width: "100%",
  padding: 10,
  margin: "8px 0",
  borderRadius: 5,
  border: "1px solid #ccc"
};

const btn = {
  padding: "10px 15px",
  marginTop: 10,
  background: "#0b3d91",
  color: "white",
  border: "none",
  borderRadius: 5,
  cursor: "pointer"
};