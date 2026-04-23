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

  const submit = async () => {
    try {
      const res = await fetch(`${API}/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (data.success) {
        alert("Application submitted!");
        setForm({ name: "", email: "", number: "", position: "" });
      } else {
        alert("Failed to submit");
      }
    } catch (err) {
      alert("Server error");
    }
  };

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(login)
      });

      const data = await res.json();

      if (data.token) {
        setToken(data.token);
        alert("Login successful!");
      } else {
        alert("Wrong credentials");
      }
    } catch (err) {
      alert("Login failed");
    }
  };

  if (!token) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Comcast HR Portal</h2>

        <h3>Apply for Job</h3>

        <input placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <br />

        <input placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <br />

        <input placeholder="Phone"
          value={form.number}
          onChange={(e) => setForm({ ...form, number: e.target.value })}
        />
        <br />

        <input placeholder="Position"
          value={form.position}
          onChange={(e) => setForm({ ...form, position: e.target.value })}
        />

        <br /><br />
        <button onClick={submit}>Submit</button>

        <hr />

        <h3>Admin Login</h3>

        <input placeholder="Email"
          onChange={(e) =>
            setLogin({ ...login, email: e.target.value })
          }
        />
        <br />

        <input type="password"
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

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Dashboard</h2>
      <p>You are logged in.</p>
    </div>
  );
}
