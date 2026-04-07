import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ExploreSectionPage from './pages/ExploreSectionPage';
import FeedPage from './pages/FeedMongoPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { explorePages } from './data/explorePages';
import { apiFetch, clearAccessToken, getAccessToken, setAccessToken } from './lib/api';
import { closeSocket } from './lib/socket';

const AuthContext = createContext({
  user: null,
  profile: null,
  loading: true,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  refreshProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

function normalizeUser(user) {
  if (!user) {
    return null;
  }

  return {
    ...user,
    uid: user.id,
    photoURL: user.avatarUrl,
  };
}

function ProtectedRoute({ children }) {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-lg font-medium text-slate-600">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    const response = await apiFetch('/users/me');
    setUser(normalizeUser(response.user));
    return response.user;
  };

  useEffect(() => {
    let cancelled = false;

    async function bootstrapAuth() {
      setLoading(true);

      try {
        if (!getAccessToken()) {
          const refreshed = await apiFetch('/auth/refresh', { method: 'POST', skipAuthRefresh: true });
          setAccessToken(refreshed.accessToken);
        }

        const currentUser = await apiFetch('/users/me');
        if (!cancelled) {
          setUser(normalizeUser(currentUser.user));
        }
      } catch {
        clearAccessToken();
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    bootstrapAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      profile: user,
      loading,
      isAuthenticated: Boolean(user),
      async login(payload) {
        const response = await apiFetch('/auth/login', {
          method: 'POST',
          body: payload,
          skipAuthRefresh: true,
        });
        setAccessToken(response.accessToken);
        closeSocket();
        setUser(normalizeUser(response.user));
        return response.user;
      },
      async register(payload) {
        const response = await apiFetch('/auth/register', {
          method: 'POST',
          body: payload,
          skipAuthRefresh: true,
        });
        setAccessToken(response.accessToken);
        closeSocket();
        setUser(normalizeUser(response.user));
        return response.user;
      },
      async logout() {
        try {
          await apiFetch('/auth/logout', { method: 'POST', skipAuthRefresh: true });
        } finally {
          closeSocket();
          clearAccessToken();
          setUser(null);
        }
      },
      refreshProfile,
    }),
    [loading, user],
  );

  return (
    <AuthContext.Provider value={value}>
      <Router>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
          <Route path="/register" element={user ? <Navigate to="/" replace /> : <RegisterPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <FeedPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          {explorePages.map((page) => (
            <Route
              key={page.path}
              path={page.path}
              element={
                <ProtectedRoute>
                  <Layout>
                    <ExploreSectionPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}
