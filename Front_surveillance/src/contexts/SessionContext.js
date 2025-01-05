// src/context/SessionContext.jsx
import { createContext, useState } from 'react';

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  return (
    <SessionContext.Provider value={{ selectedSessionId, setSelectedSessionId }}>
      {children}
    </SessionContext.Provider>
  );
};