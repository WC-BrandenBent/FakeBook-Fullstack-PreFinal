import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import UseToken from "./UseToken";
import { useBaseUrl } from "../services/BaseUrlProvider";
import "./Login.css";

function Login({ setToken }) {
  const baseUrl = useBaseUrl();

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginAttempt, setLoginAttempt] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setLoginSuccess(true);
    }
  }, [loginAttempt]);

  useEffect(() => {
    if (loginSuccess) {
      navigate("/profile");
    }
  }, [loginSuccess]);

  // const { token, removeToken, setToken } = UseToken();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${baseUrl}/token`, loginData);

      if (response.status === 200) {
        console.log("Login successful");
        setToken(response.data.access_token);
        setLoginSuccess(true);
      } else {
        console.log("Login failed");

        setLoginData({
          username: "",
          password: "",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoginAttempt(loginAttempt + 1);
      console.log("Login attempt", loginAttempt);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  return (
    <>
      <h1 className="login-title">Login</h1>
      {loginSuccess && <p className="login-success">LOGIN SUCCESSFUL</p>}
      <form className="login-form" onSubmit={handleLogin}>
        <input
          className="login-input"
          type="text"
          name="username"
          placeholder="Username"
          value={loginData.username}
          onChange={handleChange}
        />
        <input
          className="login-input"
          type="password"
          name="password"
          placeholder="Password"
          value={loginData.password}
          onChange={handleChange}
        />
        <button className="login-button" type="submit">
          Login
        </button>
      </form>
    </>
  );
}

export default Login;
