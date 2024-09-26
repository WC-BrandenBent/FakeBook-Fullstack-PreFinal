import { useState } from "react";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import NavBar from "./components/NavBar";
import UseToken from "./components/UseToken";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// import Header from "./components/Logout";
import Profile from "./components/Profile";
import Home from "./components/Home";
import Logout from "./components/Logout";
import Error from "./components/Error";

function App() {
  const { token, removeToken, setToken } = UseToken();

  return (
    <>
      <BrowserRouter>
        <div className="App">
          <NavBar></NavBar>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route
              path="/login"
              element={<Login setToken={setToken} />}
            ></Route>
            <Route path="/signup" element={<SignUp />}></Route>
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/logout" element={<Logout />}></Route>
            <Route path="/error" element={<Error />}></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
