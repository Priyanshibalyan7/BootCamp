import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('lms_token');
      const cachedUser = localStorage.getItem('lms_user');
      if (token && cachedUser) {
        setUser(JSON.parse(cachedUser));
        try {
          const { data } = await api.get('/auth/me');
          setUser(data.data);
        } catch (err) {
          localStorage.removeItem('lms_token');
          localStorage.removeItem('lms_user');
          setUser(null);
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('lms_token', data.data.token);
    localStorage.setItem('lms_user', JSON.stringify(data.data));
    setUser(data.data);
    toast.success(`Welcome back, ${data.data.name}!`);
    return data.data;
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    localStorage.setItem('lms_token', data.data.token);
    localStorage.setItem('lms_user', JSON.stringify(data.data));
    setUser(data.data);
    toast.success('Account created successfully!');
    return data.data;
  };

  const logout = () => {
    localStorage.removeItem('lms_token');
    localStorage.removeItem('lms_user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUserState = (updatedFields) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedFields };
      localStorage.setItem('lms_user', JSON.stringify(merged));
      return merged;
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateUserState }}
    >
      {children}
    </AuthContext.Provider>
  );
};
