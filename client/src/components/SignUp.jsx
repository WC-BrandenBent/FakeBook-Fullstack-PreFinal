import React, { useEffect, useState } from "react";
import axios from "axios";

function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    bio: "",
  });

  const [passwordMatch, setPasswordMatch] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "confirmPassword") {
      setPasswordMatch(value === formData.password);
    } else if (name === "password") {
      setPasswordMatch(value === formData.confirmPassword);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwordMatch) {
      console.log("Form submitted", formData);
      registerUser(formData);
    } else {
      console.log("Passwords do not match");
    }
  };

  const registerUser = async (data) => {
    try {
      const response = await axios.post("http://localhost:5000/register", data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword || ""}
            onChange={handleChange}
            required
          />
          {!passwordMatch && (
            <p style={{ color: "red" }}>Passwords do not match</p>
          )}
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </>
  );
}

export default SignUp;
