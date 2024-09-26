import { useState } from "react";

function UseToken() {
  function getToken() {
    const tokenString = localStorage.getItem("token");
    const userToken = JSON.parse(tokenString);
    return userToken;
  }

  const [token, setToken] = useState(getToken());

  function saveToken(userToken) {
    localStorage.setItem("token", JSON.stringify(userToken));
    setToken(userToken.token);
  }

  function removeToken() {
    localStorage.removeItem("token");
    setToken(null);
  }

  return {
    setToken: saveToken,
    token,
    removeToken,
  };
}

export default UseToken;
