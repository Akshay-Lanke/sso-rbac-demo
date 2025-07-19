import React, { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000";

function EmailForm() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult("");
    try {
      await axios.post(
        `${API_URL}/api/contact`,
        { email },
        { withCredentials: true }
      );
      setResult("Email sent to backend!");
    } catch (err) {
      setResult("Failed to send: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        style={{ marginRight: 10, padding: 4 }}
      />
      <button type="submit">Send Email to Backend</button>
      {result && <div style={{marginTop: 10}}>{result}</div>}
    </form>
  );
}

export default EmailForm;
