import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { login as loginService, register as registerService } from '../services/auth.service.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

useEffect(() => {
  if (token) {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setUser({ 
        id: decoded.id, 
        email: decoded.email,
        username: decoded.username
      });
    } catch (err) {
      console.error('Token decoding failed:', err);
      logout();
    }
  }
}, [token]);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await loginService(email, password);
      
      if (response.code !== 'Login_Successful') {
        throw new Error(response.message || 'Login failed');
      }
      
      if (!response.token) {
        throw new Error('No token received');
      }
      
      localStorage.setItem('token', response.token);
      setToken(response.token);
      navigate('/tasks');
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username, email, password) => {
    setIsLoading(true);
    try {
      const data = await registerService(username, email, password);

      if (data.code === 'Register_Successful') {
        toast.success(data.message || 'Registration successful');
        return true;
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);