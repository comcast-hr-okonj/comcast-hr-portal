import { useState } from "react";

export default function App() {
  // ✅ FIXED: MUST use Render backend (NOT localhost)
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

  // 📝 SUBMIT APPLICATION
  const submit = async () => {
    try {
      const res = await fetch(API + "/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Submit failed");
        return;
      }

      alert("Application submitted!");
    } catch (err) {
      console.log(err);
      alert("Network error");
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

      if (!res.ok) {
        alert(data.error || "Login failed");
        return;
      }

      setToken(data.token);
      loadApps(data.token);

    } catch (err) {
      console.log(err);
      alert("Network error");
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
      console.log(err);
    }
  };

  // 🌐 PUBLIC PAGE
  if (!token) {
    return (
      <div>
        <h2>Apply for Job</h2>

        <input
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          placeholder="Phone"
          onChange={(e) => setForm({ ...form, number: e.target.value })}
        />

        <input
          placeholder="Position"
          onChange={(e) => setForm({ ...form, position: e.target.value })}
        />

        <button onClick={submit}>Submit</button>

        <hr />

        <h3>Admin Login</h3>

        <input
          placeholder="Email"
          onChange={(e) => setLogin({ ...login, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
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
