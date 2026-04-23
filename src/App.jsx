import { useState, useEffect } from "react";

export default function App() {
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
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("apps")) || [];
    setApps(saved);
  }, []);

  // SUBMIT (NO BACKEND)
  const submit = () => {
    if (!form.name || !form.email || !form.number || !form.position) {
      alert("Fill all fields");
      return;
    }

    const newApps = [
      { ...form, id: Date.now(), status: "Pending" },
      ...apps
    ];

    localStorage.setItem("apps", JSON.stringify(newApps));
    setApps(newApps);

    alert("✅ Application submitted!");

    setForm({
      name: "",
      email: "",
      number: "",
      position: ""
    });
  };

  // LOGIN (NO BACKEND)
  const handleLogin = () => {
    if (
      login.email === "admin@comcast.com" &&
      login.password === "1234"
    ) {
      setToken("admin");
      alert("✅ Login successful!");
    } else {
      alert("❌ Wrong credentials");
    }
  };

  // PUBLIC PAGE
  if (!token) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Comcast HR Portal</h2>

        <h3>Apply for Job</h3>

        <input placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })} />

        <input placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })} />

        <input placeholder="Phone"
          value={form.number}
          onChange={e => setForm({ ...form, number: e.target.value })} />

        <input placeholder="Position"
          value={form.position}
          onChange={e => setForm({ ...form, position: e.target.value })} />

        <br /><br />

        <button onClick={submit}>Submit</button>

        <hr />

        <h3>Admin Login</h3>

        <input placeholder="Email"
          onChange={e => setLogin({ ...login, email: e.target.value })} />

        <input type="password" placeholder="Password"
          onChange={e => setLogin({ ...login, password: e.target.value })} />

        <br /><br />

        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  // ADMIN DASHBOARD
  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Dashboard</h2>

      {apps.length === 0 ? (
        <p>No applications yet</p>
      ) : (
        apps.map(a => (
          <div key={a.id}>
            {a.name} - {a.position} - {a.status}
          </div>
        ))
      )}
    </div>
  );
}
