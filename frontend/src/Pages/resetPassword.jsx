import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../Services/api";
import "../Styles/resetPassword.css"

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    if (password.length <= 3 || !/\d/.test(password)) {
      setMsg("❌ Password must be more than 3 characters and include at least one number.");
      return;
    }
    try {
      await api.post("/api/auth/reset-password", { token, password });
      setMsg("✅ Password has been reset. You can now sign in.");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="page-wrapper">
    <div className="reset-container">
  <div className="reset-form-container">
    <form onSubmit={handleSubmit}>
      <h1>Set New Password</h1>
      <span>Enter your new password below</span>
      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit">Reset Password</button>
      {msg && <p>{msg}</p>}
    </form>
  </div>
</div>
</div>

  );
};

export default ResetPassword;