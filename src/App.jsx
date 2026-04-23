import { useState, useEffect } from "react";

export default function App() {
  const API = "https://comcast-hr-backend.onrender.com";

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

  const loadApps = async (authToken) => {
    try {
      const res = await fetch(`${API}/applications`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      const data = await res.json();
      setApps(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (token) loadApps(token);
  }, [token]);

  const submit = async () => {
    await fetch(`${API}/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    alert("Submitted!");
    setForm({ name: "", email: "", number: "", position: "" });
  };

  const handleLogin = async () => {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(login)
    });

    const data = await res.json();

    if (data.token) {
      setToken(data.token);
      loadApps(data.token);
    } else {
      alert("Login failed");
    }
  };

  if (!token) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Comcast HR Portal</h2>

        <h3>Apply</h3>

        <input placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} />

        <input placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })} />

        <input placeholder="Phone"
          value={form.number}
          onChange={(e) => setForm({ ...form, number: e.target.value })} />

        <input placeholder="Position"
          value={form.position}
          onChange={(e) => setForm({ ...form, position: e.target.value })} />

        <button onClick={submit}>Submit</button>

        <hr />

        <h3>Admin Login</h3>

        <input placeholder="Email"
          onChange={(e) => setLogin({ ...login, email: e.target.value })} />

        <input type="password"
          placeholder="Password"
          onChange={(e) => setLogin({ ...login, password: e.target.value })} />

        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Dashboard</h2>

      {apps.length === 0 ? (
        <p>No applications</p>
      ) : (
        apps.map((a) => (
          <div key={a.id}>
            {a.name} - {a.position}
          </div>
        ))
      )}
    </div>
  );
}
