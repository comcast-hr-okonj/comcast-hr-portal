import { useState } from "react";

export default function App() {
  const API = "https://comcast-hr-portal.onrender.com";

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

  // HEADER
  const Header = () => (
    <div style={{
      width: "100%",
      background: "#0b3d91",
      color: "white",
      padding: 15,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <h2>Comcast HR Portal</h2>
    </div>
  );

  // LOGIN
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

  // LOAD APPLICATIONS
  const loadApps = async (tok) => {
    const res = await fetch(API + "/applications", {
      headers: { Authorization: tok }
    });

    const data = await res.json();
    setApps(data);
  };

  // SUBMIT APPLICATION
  const submit = async () => {
    await fetch(API + "/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    alert("Application submitted!");
  };

  // PUBLIC PAGE
  if (!token) {
    return (
      <div>
        <Header />

        <h2>Apply for Job</h2>

        <input placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Phone" onChange={e => setForm({ ...form, number: e.target.value })} />
        <input placeholder="Position" onChange={e => setForm({ ...form, position: e.target.value })} />

        <button onClick={submit}>Submit</button>

        <hr />

        <h3>Admin Login</h3>

        <input placeholder="Email" onChange={e => setLogin({ ...login, email: e.target.value })} />
        <input type="password" placeholder="Password" onChange={e => setLogin({ ...login, password: e.target.value })} />

        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  // ADMIN DASHBOARD
  return (
    <div>
      <Header />

      <h2>Admin Dashboard</h2>

      {apps.map((a) => (
        <div key={a.id}>
          {a.name} - {a.position} - {a.status}
        </div>
      ))}
    </div>
  );
}
