import { useEffect, useState, useContext, createContext } from "react";

const BaseUrlContext = createContext();

function BaseUrlProvider({ children }) {
  const [baseUrl, setBaseUrl] = useState(
    process.env.REACT_APP_FLASK_API_ENDPOINT
  );

  useEffect(() => {
    if (!baseUrl || undefined) {
      setBaseUrl("http://localhost:5000");
    }
  }, [baseUrl]);

  return (
    <BaseUrlContext.Provider value={baseUrl}>
      {children}
    </BaseUrlContext.Provider>
  );
}

function useBaseUrl() {
  return useContext(BaseUrlContext);
}

export { BaseUrlProvider, useBaseUrl };

// A service could be used wherever you want, a custom hook only inside a React component, you could use your service inside a custom hook or an async action creator

// Inside a custom hook you can access to React context or define an state, things you can't inside a service outside the React application
