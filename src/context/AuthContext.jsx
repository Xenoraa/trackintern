import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('internTrackUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('internTrackUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Mock API call - Replace with actual API
    const mockUsers = {
      'student@baze.edu.ng': { 
        id: '1', email, fullName: 'John Doe', role: 'student', 
        department: 'Computer Science', lastLogin: new Date().toISOString() 
      },
      'supervisor@baze.edu.ng': { 
        id: '2', email, fullName: 'Dr. Johnson', role: 'institutionSupervisor', 
        department: 'Computer Science', lastLogin: new Date().toISOString() 
      },
      'coordinator@baze.edu.ng': { 
        id: '3', email, fullName: 'Prof. Williams', role: 'siwesCoordinator', 
        department: 'SIWES Office', lastLogin: new Date().toISOString() 
      },
      'hod@baze.edu.ng': { 
        id: '4', email, fullName: 'Dr. Chen', role: 'hod', 
        department: 'Computer Science', lastLogin: new Date().toISOString() 
      },
      'industry@company.com': { 
        id: '5', email, fullName: 'Mr. Smith', role: 'industrySupervisor', 
        company: 'Tech Corp', lastLogin: new Date().toISOString() 
      }
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const userData = mockUsers[email] || null;
    
    if (userData && password === 'password') { // Default password for demo
      setUser(userData);
      localStorage.setItem('internTrackUser', JSON.stringify(userData));
      return userData;
    }
    
    throw new Error('Invalid email or password');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('internTrackUser');
  };

  const verifyCode = (code) => {
    // Mock verification
    return code.length >= 6;
  };

  const value = {
    user,
    login,
    logout,
    verifyCode,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};