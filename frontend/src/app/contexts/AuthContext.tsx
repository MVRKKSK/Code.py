import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = localStorage.getItem('codelens_current_user');
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
    setIsLoading(false);
  }, []);

const register = async (name: string, email: string, password: string) => {
  try {
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!data.success) {
      return { success: false, error: data.error };
    }

    return { success: true };

  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

const login = async (email: string, password: string) => {
  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!data.success) {
      return { success: false, error: data.error };
    }

    // ✅ store token
    localStorage.setItem('token', data.token);

    // ✅ store user
    setUser(data.user);
    localStorage.setItem('user', JSON.stringify(data.user));

    return { success: true };

  } catch (err: any) {
    return { success: false, error: err.message };
  }
};
  const logout = () => {
    setUser(null);
    localStorage.removeItem('codelens_current_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
