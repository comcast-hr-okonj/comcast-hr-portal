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

  // LOAD APPLICATIONS
  const loadApps = async (authToken) => {
    const res = await fetch(`${API}/applications`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });

    const data = await res.json();
    setApps(data);
  };

  useEffect(() => {
    if (token) loadApps(token);
  }, [token]);

  // APPLY
  const submit = async () => {
    if (!form.name || !form.email || !form.number || !form.position) {
      alert("Fill all fields");
      return;
    }

    const res = await fetch(`${API}/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (data.success) {
      alert("Application submitted!");
      setForm({ name: "", email: "", number: "", position: "" });
    } else {
      alert("Failed to submit");
    }
  };

  // LOGIN
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
      alert("Login successful!");
      loadApps(data.token);
    } else {
      alert("Wrong credentials");
    }
  };

  // LOGIN PAGE
  if (!token) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Comcast HR Portal</h2>

        <h3>Apply for Job</h3>

        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <br />

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <br />

        <input
          placeholder="Phone"
          value={form.number}
          onChange={(e) => setForm({ ...form, number: e.target.value })}
        />
        <br />

        <input
          placeholder="Position"
          value={form.position}
          onChange={(e) => setForm({ ...form, position: e.target.value })}
        />

        <br /><br />
        <button onClick={submit}>Submit</button>

        <hr />

        <h3>Admin Login</h3>

        <input
          placeholder="Email"
          onChange={(e) =>
            setLogin({ ...login, email: e.target.value })
          }
        />
        <br />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setLogin({ ...login, password: e.target.value })
          }
        />

        <br /><br />
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  // DASHBOARD
  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Dashboard</h2>

      {apps.length === 0 ? (
        <p>No applications yet</p>
      ) : (
        apps.map((a) => (
          <div key={a.id}>
            <b>{a.name}</b> - {a.email} - {a.position} - {a.status}
          </div>
        ))
      )}
    </div>
  );
}
