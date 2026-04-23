import { useState } from "react";

export default function App() {
  const API = "https://comcast-hr-portal-1.onrender.com";

  const [token, setToken] = useState("");
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(false);

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

  // 🚀 SUBMIT APPLICATION
  const submit = async () => {
    setLoading(true);
    alert("Submitting application...");

    try {
      const res = await fetch(API + "/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const text = await res.text();
      console.log("SUBMIT:", text);

      if (!res.ok) {
        alert("❌ Submit failed: " + text);
        setLoading(false);
        return;
      }

      alert("✅ Application submitted successfully!");

      setForm({
        name: "",
        email: "",
        number: "",
        position: ""
      });

    } catch (err) {
      console.log(err);
      alert("❌ Backend sleeping. Wait 10 seconds and try again.");
    }

    setLoading(false);
  };

  // 🔐 LOGIN ADMIN
  const handleLogin = async () => {
    setLoading(true);
    alert("Logging in...");

    try {
      const res = await fetch(API + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(login)
      });

      const text = await res.text();
      console.log("LOGIN:", text);

      if (!res.ok) {
        alert("❌ Login failed: " + text);
        setLoading(false);
        return;
      }

      const data = JSON.parse(text);

      setToken(data.token);

      // LOAD APPLICATIONS
      const appsRes = await fetch(API + "/applications", {
        headers: { Authorization: data.token }
      });

      const appsData = await appsRes.json();
      setApps(appsData);

      alert("✅ Login successful!");

    } catch (err) {
      console.log(err);
      alert("❌ Server sleeping. Try again in a few seconds.");
    }

    setLoading(false);
  };

  // 🌐 PUBLIC PAGE
  if (!token) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Comcast HR Portal</h2>

        <h3>Apply for Job</h3>

        <input
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <input
          placeholder="Phone"
          value={form.number}
          onChange={e => setForm({ ...form, number: e.target.value })}
        />

        <input
          placeholder="Position"
          value={form.position}
          onChange={e => setForm({ ...form, position: e.target.value })}
        />

        <br /><br />

        <button onClick={submit} disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>

        <hr />

        <h3>Admin Login</h3>

        <input
          placeholder="Email"
          value={login.email}
          onChange={e => setLogin({ ...login, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          value={login.password}
          onChange={e => setLogin({ ...login, password: e.target.value })}
        />

        <br /><br />

        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    );
  }

  // 📊 ADMIN DASHBOARD
  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Dashboard</h2>

      {apps.length === 0 ? (
        <p>No applications yet</p>
      ) : (
        apps.map(a => (
          <div key={a.id} style={{ marginBottom: 10 }}>
            <strong>{a.name}</strong> - {a.position} - {a.status}
          </div>
        ))
      )}
    </div>
  );
}
