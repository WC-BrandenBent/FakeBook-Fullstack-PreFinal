import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { loginUser } from "../../api/api";
import "./Auth.css";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  /**
   * Handles the form submission for user login.
   * @param {object} e - The event object.
   */
  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    try {
      const data = await loginUser(username, password);
      console.log(data.access_token);

      login({
        access_token: data.access_token,
        user: data.user,
      });

      navigate("/profile");

      // setLoginSuccess(true);
      // console.log(loginSuccess);
    } catch (error) {
      setError(error.message || "Login Failure");
    }
  }
  return (
    <div className="auth-container">
      <h2>Login</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="auth-form">
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginForm;
