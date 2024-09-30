import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/shared/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import PrivateRoute from "./components/shared/PrivateRoute";
import Profile from "./pages/Profile";
import AllPosts from "./components/posts/AllPosts";
import { AuthProvider } from "./contexts/AuthContext";
import { BaseUrlProvider } from "./hooks/BaseUrlProvider";
import PostDetails from "./components/posts/PostDetails";

function App() {
  return (
    <>
      <AuthProvider>
        <BaseUrlProvider>
          <BrowserRouter>
            <Navbar />
            <div className="container">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/posts"
                  element={
                    <PrivateRoute>
                      <AllPosts />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/posts/:postId"
                  element={
                    <PrivateRoute>
                      <PostDetails />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </div>
          </BrowserRouter>
        </BaseUrlProvider>
      </AuthProvider>
    </>
  );
}

export default App;

{
  /* <BaseUrlProvider>
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
      </BaseUrlProvider> */
}
