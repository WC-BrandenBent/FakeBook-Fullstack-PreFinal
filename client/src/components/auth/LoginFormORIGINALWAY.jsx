import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { useBaseUrl } from "../../hooks/BaseUrlProvider";
import "./Auth.css";

function LoginFormORIGINALWAY() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // const [loginSuccess, setLoginSuccess] = useState(false);
  // const [loginAttempt, setLoginAttempt] = useState(0);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const baseUrl = useBaseUrl();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(`${baseUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Login failed");
        return;
      }

      if (response.status === 200) {
        console.log("Login successful");
        // Handle successful login here, e.g., navigate to another page
        const data = await response.json();

        login({
          token: data.access_token,
          user: data.user,
        });

        navigate("/profile");

        // setLoginSuccess(true);
        // console.log(loginSuccess);
      } else {
        console.error("Login failed");
        setLoginData({
          username: "",
          password: "",
        });
      }
    } catch (error) {
      setError(error || "Login Failure");
    } finally {
      // setLoginAttempt(loginAttempt + 1);
      // console.log("Login attempt", loginAttempt);
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

export default LoginFormORIGINALWAY;
