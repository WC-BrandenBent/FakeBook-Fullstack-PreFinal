import { createContext, useState, useEffect } from "react";

/**
 * AuthContext provides authentication state and functions to its consumers.
 */
export const AuthContext = createContext();

/**
 * AuthProvider component wraps around parts of the app that need access to authentication data.
 * It manages user state, JWT tokens, and provides login and logout functionalities.
 *
 * @param {object} props - The component's props.
 * @param {React.ReactNode} props.children - The child components that will have access to AuthContext.
 * @returns {JSX.Element} The AuthContext provider.
 */
export const AuthProvider = ({ children }) => {
  /**
   * authTokens holds the JWT token.
   * It is initialized from localStorage to persist authentication across sessions.
   */
  const [authTokens, setAuthTokens] = useState(() => {
    const tokenString = localStorage.getItem("token");
    return tokenString ? JSON.parse(tokenString) : null;
  });

  /**
   * user holds the authenticated user's data.
   * It is also initialized from localStorage.
   */
  const [user, setUser] = useState(() => {
    const userString = localStorage.getItem("user");
    return userString ? JSON.parse(userString) : null;
  });

  /**
   * login function updates authTokens and user state,
   * and stores them in localStorage for persistence.
   *
   * @param {object} data - The login response containing tokens and user data.
   * @param {string} data.access_token - The JWT access token.
   * @param {object} data.user - The authenticated user's data.
   */
  const login = (data) => {
    // Update state
    setAuthTokens({ token: data.access_token });
    setUser(data.user);

    // Store in localStorage
    localStorage.setItem("token", JSON.stringify(data.access_token));
    localStorage.setItem("user", JSON.stringify(data.user));
  };

  /**
   * logout function clears authTokens and user state,
   * and removes them from localStorage.
   */
  const logout = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  /**
   * updateUser function allows updating the user's data.
   * Useful for scenarios like editing the profile.
   *
   * @param {object} updatedUser - The updated user data.
   */
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  /**
   * Optionally, you can add a token refresh mechanism here.
   * This involves checking token expiration and requesting a new token before it expires.
   */

  /**
   * Effect to synchronize state with localStorage changes.
   * This ensures that if localStorage is updated from another tab or window,
   * the React state stays in sync.
   */
  useEffect(() => {
    const syncAuth = (event) => {
      if (event.key === "token") {
        setAuthTokens(event.newValue ? JSON.parse(event.newValue) : null);
      }
      if (event.key === "user") {
        setUser(event.newValue ? JSON.parse(event.newValue) : null);
      }
    };

    window.addEventListener("storage", syncAuth);

    return () => {
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  /**
   * The context value that will be supplied to any descendants of this component.
   * It includes user data, auth tokens, and functions to modify them.
   */
  const contextData = {
    user,
    authTokens,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
