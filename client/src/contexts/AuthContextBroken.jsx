import { useState, createContext } from "react";

const AuthContext = createContext();

// function useAuthContext() {
//   return useContext(AuthContext);
// }

// This will create a context that will be used to pass the user's authentication state to the rest of the application. Handling it with this component will remove the need of constantly passing the user's authentication state as props to the components that need it
// eslint-disable-next-line react/prop-types
function AuthProvider({ children }) {
  // by setting the initial state of the user's authentication to the tokens already in local storage if they exist (or null if there are none), we can ensure that the user's authentication state is maintained even if the page is refreshed
  // Ternary operator syntax: condition ? value if true : value if false. This could be written as: useState(() => { if (localStorage.getItem("user")) { return JSON.parse(localStorage.getItem("user")); } else { return null; } });
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("tokens")
      ? JSON.parse(localStorage.getItem("tokens"))
      : null
  );

  // I'm using a seperate user state to store the user's data. This is because the user's data is not stored in the tokens, but is instead stored in the user object that is returned from the server when the user logs in. A token will primarily be used for authentication, or "is this person who they say they are?". We might get some info we need for our app to work from it, but instead of relying on it we can store the user's data in a seperate state and have access to any data we need from the user object

  // This also lets us have access to the user data without ever doing another API call or DB query everytime we want to use the user's data
  const [user, setUser] = useState(() => {
    try {
      return localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : null;
    } catch (error) {
      console.error("Error accessing localStorage for user:", error);
      return null;
    }
  });

  // const [user, setUser] = useState(() =>
  //   localStorage.getItem("user")
  //     ? JSON.parse(localStorage.getItem("user"))
  //     : null
  // );

  // const login = (data) => {
  //   setAuthTokens(data.access_token);
  //   setUser(data.user);
  //   localStorage.setItem("tokens", JSON.stringify(data.access_token));
  //   localStorage.setItem("user", JSON.stringify(data.user));
  // };

  const login = (data) => {
    setAuthTokens({ access_token: data.access_token });
    setUser(data.user);
    localStorage.setItem('tokens', JSON.stringify({ access_token: data.access_token }));
    localStorage.setItem('user', JSON.stringify(data.user));
  };

  function logout() {
    try {
      setAuthTokens(null);
      setUser(null);
      localStorage.removeItem("tokens");
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Error removing localStorage items:", error);
    }
  }

  const contextData = {
    user,
    authTokens,
    login,
    logout,
  };

  //   return AuthContext.Provider({ value: contextData }, children);

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
}
// export default AuthProvider;

export { AuthProvider, AuthContext };

// Exceptions

// SecurityError The request violates a policy decision, or the origin is not a valid scheme/host/port tuple (this can happen if the origin uses the file: or data: scheme, for example). For example, the user may have their browser configured to deny permission to persist data for the specified origin.

// so you should envelope your code with a try-catch, that will solve your

// Uncaught (in promise) TypeError: localStorage.setItem is not a function
