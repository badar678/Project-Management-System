import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Services/api";
import "../Styles/loginSignup.css";

const LoginSignup = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "client",
  });
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMsg, setResetMsg] = useState("");
  const navigate = useNavigate();

  const toggleMode = () => setIsSignup(!isSignup);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "client",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ✅ Password validation
    const password = formData.password;
    const hasNumber = /\d/.test(password);
    if (password.length <= 3 || !hasNumber) {
      alert("❌ Password must be more than 3 characters and include at least one number.");
      return;
    }
    try {
      if (isSignup) {
        await api.post("/api/auth/register", formData);
        alert("✅ Registered successfully. Now log in.");
        resetForm();
        setIsSignup(false);
      } else {
        const res = await api.post("/api/auth/login", {
          email: formData.email,
          password: formData.password,
        });
        const { token, user } = res.data;

        sessionStorage.setItem("userId", user._id);
        sessionStorage.setItem("role", user.role);

        resetForm();
        if (user.role === "ceo") {
          sessionStorage.setItem("ceo_token", token);
          navigate("/dashboard/ceo");
        } else if (user.role === "pm") {
          sessionStorage.setItem("pm_token", token);
          navigate("/dashboard/pm");
        } else if (user.role === "employee") {
          sessionStorage.setItem("employee_token", token);
          navigate("/dashboard/employee");
        } else {
          sessionStorage.setItem("client_token", token);
          navigate("/dashboard/client");
        }
      }
    } catch (err) {
      alert("❌ " + (err.response?.data?.error || err.message));
    }
  };

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setResetMsg("");
    try {
      await api.post("/api/auth/forgot-password", { email: resetEmail });
      setResetMsg("✅ If this email is registered, a reset link has been sent.");
    } catch (err) {
      setResetMsg("❌ " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="login-page-wrapper">
    <div className={`container ${isSignup ? "active" : ""}`} id="container">
      {/* Sign Up Form */}
      <div className="form-container sign-up">
        <form onSubmit={handleSubmit}>
          <h1>Create Account</h1>
          <span>or use your email for registration</span>
          <input
            type="text"
            placeholder="Name"
            name="name"
            onChange={handleChange}
            value={formData.name}
            required={isSignup}
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={handleChange}
            value={formData.email}
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
            value={formData.password}
            required
          />
          <select name="role" onChange={handleChange} value={formData.role} required>
            <option value="client">Client</option>
            <option value="ceo">CEO</option>
            <option value="pm">Project Manager</option>
            <option value="employee">Employee</option>
          </select>
          <button type="submit">Sign Up</button>
        </form>
      </div>

      {/* Sign In or Reset Form */}
      <div className="form-container sign-in">
        {showReset ? (
          <form onSubmit={handleResetRequest}>
            <h1>Reset Password</h1>
            <span>Enter your email to receive a reset link</span>
            <input
              type="email"
              placeholder="Email"
              value={resetEmail}
              onChange={e => setResetEmail(e.target.value)}
              required
            />
            <button type="submit">Send Reset Link</button>
            <button type="button" onClick={() => { setShowReset(false); setResetMsg(""); }}>Back to Sign In</button>
            {resetMsg && <p style={{ marginTop: 10 }}>{resetMsg}</p>}
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <h1>Sign In</h1>
            <span>or use your email and password</span>
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={formData.email}
              required
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={formData.password}
              required
            />
            <a href="#" onClick={e => { e.preventDefault(); setShowReset(true); }}>Forget Your Password?</a>
            <button type="submit">Sign In</button>
          </form>
        )}
      </div>

      {/* Toggle Panels */}
      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Welcome Back!</h1>
            <p>Enter your details to sign in</p>
            <button className="hidden" onClick={toggleMode}>Sign In</button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Hello, Friend!</h1>
            <p>Register to use all features</p>
            <button className="hidden" onClick={toggleMode}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default LoginSignup;
