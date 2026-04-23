import { useState } from "react";

export default function App() {
  // 🚨 IMPORTANT: UPDATED BACKEND (NEW RENDER SERVICE)
  const API = "https://comcast-hr-portal-1.onrender.com";

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

  // 📝 SUBMIT APPLICATION
  const submit = async () => {
    try {
      const res = await fetch(API + "/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      console.log("SUBMIT:", res.status, data);

      if (!res.ok) {
        alert(data.error || "Submit failed");
        return;
      }

      alert("Application submitted successfully!");

      setForm({
        name: "",
        email: "",
        number: "",
        position: ""
      });

    } catch (err) {
      console.log("SUBMIT ERROR:", err);
      alert("Backend not reachable");
    }
  };

  // 🔐 LOGIN
  const handleLogin = async () => {
    try {
      const res = await fetch(API + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(login)
      });

      const data = await res.json();

      console.log("LOGIN:", res.status, data);

      if (!res.ok) {
        alert(data.error || "Login failed");
        return;
      }

      setToken(data.token);
      loadApps(data.token);

    } catch (err) {
      console.log("LOGIN ERROR:", err);
      alert("Backend not reachable");
    }
  };

  // 📊 LOAD APPLICATIONS
  const loadApps = async (tok) => {
    try {
      const res = await fetch(API + "/applications", {
        headers: { Authorization: tok }
      });

      const data = await res.json();
      setApps(data);

    } catch (err) {
      console.log("LOAD ERROR:", err);
    }
  };

  // 🌐 PUBLIC UI
  if (!token) {
    return (
      <div>
        <h2>Comcast HR Portal</h2>

        <h3>Apply for Job</h3>

        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          placeholder="Phone"
          value={form.number}
          onChange={(e) => setForm({ ...form, number: e.target.value })}
        />

        <input
          placeholder="Position"
          value={form.position}
          onChange={(e) => setForm({ ...form, position: e.target.value })}
        />

        <button onClick={submit}>Submit</button>

        <hr />

        <h3>Admin Login</h3>

        <input
          placeholder="Email"
          value={login.email}
          onChange={(e) => setLogin({ ...login, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          value={login.password}
          onChange={(e) => setLogin({ ...login, password: e.target.value })}
        />

        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  // 🔐 ADMIN DASHBOARD
  return (
    <div>
      <h2>Admin Dashboard</h2>

      {apps.map((a) => (
        <div key={a.id}>
          {a.name} - {a.position} - {a.status}
        </div>
      ))}
    </div>
  );
}
