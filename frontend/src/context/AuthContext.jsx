import { createContext, useContext, useState } from "react";
import api from "../api/axios.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("beebot_user");
    return stored ? JSON.parse(stored) : null;
  });

  const persistSession = (data) => {
    const { token, ...userData } = data;
    localStorage.setItem("beebot_token", token);
    localStorage.setItem("beebot_user", JSON.stringify(userData));
    setUser(userData);
  };

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    persistSession(data);
  };

  const signup = async (name, email, password) => {
    const { data } = await api.post("/auth/signup", { name, email, password });
    persistSession(data);
  };

  const logout = () => {
    localStorage.removeItem("beebot_token");
    localStorage.removeItem("beebot_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
