import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

const AuthContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Auto login (verify token)
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "/api/auth/verify",
          {
            headers: {
              Authorization: `Bearer ${token}`, // ✅ IMPORTANT
            },
          }
        );

        if (response.data.success) {
          setUser(response.data.user);
        }
      
      } catch (error) {
        console.error(error);
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [navigate]);

  // ✅ login
  const login = (userData) => {
    setUser(userData);
  };

  // ✅ logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <UserContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

// ✅ custom hook
const useAuth = () => useContext(UserContext);

export { useAuth };
export default AuthContext;