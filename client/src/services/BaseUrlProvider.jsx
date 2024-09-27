import { useEffect, useState, useContext, createContext } from "react";

const BaseUrlContext = createContext();

function BaseUrlProvider({ children }) {
  const [baseUrl, setBaseUrl] = useState(process.env.REACT_APP_API_URL);

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
