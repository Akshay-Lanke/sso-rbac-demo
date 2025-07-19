import React, { useEffect, useState } from "react";
import axios from "axios";
import EmailForm from "./components/EmailForm";

const API_URL = "http://localhost:3000"; // Backend URL

function App() {
  const [user, setUser] = useState(null);
  const [adminMsg, setAdminMsg] = useState("");
  const [editorMsg, setEditorMsg] = useState("");
  const [error, setError] = useState("");

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get(`${API_URL}/api/profile`)
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  const login = () => {
    window.location.href = `${API_URL}/login`;
  };

  const logout = () => {
    window.location.href = `${API_URL}/logout`;
  };

  const callAdmin = async () => {
    setError("");
    try {
      const res = await axios.get(`${API_URL}/api/admin`);
      setAdminMsg(JSON.stringify(res.data, null, 2));
    } catch {
      setAdminMsg("");
      setError("You are not an admin!");
    }
  };

  const callEditor = async () => {
    setError("");
    try {
      const res = await axios.get(`${API_URL}/api/editor`);
      setEditorMsg(JSON.stringify(res.data, null, 2));
    } catch {
      setEditorMsg("");
      setError("You are not an editor!");
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "50px auto", padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>Okta SSO + RBAC Demo</h2>
      {!user ? (
        <div>
          <button onClick={login}>Login with Okta SSO</button>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: 16 }}>
            <b>Logged in as:</b>
            <pre style={{ background: "#f4f4f4", padding: 10, borderRadius: 4 }}>{JSON.stringify(user, null, 2)}</pre>
          </div>
          <EmailForm />
          <button onClick={callAdmin} style={{ marginRight: 10 }}>Admin Endpoint</button>
          <button onClick={callEditor}>Editor Endpoint</button>
          <button onClick={logout} style={{ float: "right", color: "red" }}>Logout</button>
          {adminMsg && <div style={{ marginTop: 12 }}><b>Admin:</b><pre>{adminMsg}</pre></div>}
          {editorMsg && <div style={{ marginTop: 12 }}><b>Editor:</b><pre>{editorMsg}</pre></div>}
          {error && <div style={{ color: "red", marginTop: 12 }}>{error}</div>}
        </div>
      )}
    </div>
  );
}

export default App;
