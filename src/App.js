import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import theme from './theme';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import BlogList from './components/BlogList';
import BlogPage from './components/BlogPage';
import BlogForm from './components/BlogForm';
import DropsPage from './components/DropsPage';
import DropDetail from './components/DropDetail';
import DropsForm from './components/DropsForm';
import Login from './components/Login';
import AboutPage from './components/AboutPage';
import AdminDashboard from './components/AdminDashboard';

import './App.css';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="page-wrapper">
            <Navbar />
            <main className="page-content">
              <Routes>
                {/* Home */}
                <Route path="/" element={<Home />} />

                {/* Articles */}
                <Route path="/articles" element={<BlogList />} />
                <Route path="/articles/:id" element={<BlogPage />} />

                {/* Legacy blog routes — redirect to new paths */}
                <Route path="/blogs" element={<Navigate to="/articles" replace />} />
                <Route path="/blogs/:id" element={<LegacyBlogRedirect />} />

                {/* Category pages */}
                <Route path="/category/:category" element={<BlogList />} />

                {/* Drops */}
                <Route path="/drops" element={<DropsPage />} />
                <Route path="/drops/:id" element={<DropDetail />} />

                {/* About */}
                <Route path="/about" element={<AboutPage />} />

                {/* Admin */}
                <Route path="/login" element={<Login />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/create"
                  element={
                    <ProtectedRoute>
                      <BlogForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/edit/:id"
                  element={
                    <ProtectedRoute>
                      <EditBlogWrapper />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/drops/new"
                  element={
                    <ProtectedRoute>
                      <DropsForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/drops/edit/:id"
                  element={
                    <ProtectedRoute>
                      <EditDropWrapper />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

// Redirect /blogs/:id → /articles/:id
const LegacyBlogRedirect = () => {
  const { id } = require('react-router-dom').useParams();
  return <Navigate to={`/articles/${id}`} replace />;
};

// Edit blog — loads post from Firestore then renders BlogForm
const EditBlogWrapper = () => {
  const { id } = require('react-router-dom').useParams();
  const [post, setPost] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const { doc, getDoc } = require('firebase/firestore');
  const { db } = require('./firebase');

  React.useEffect(() => {
    getDoc(doc(db, 'posts', id)).then(snap => {
      if (snap.exists()) setPost({ id: snap.id, ...snap.data() });
      setLoading(false);
    });
  }, [id]);

  if (loading) return null;
  return <BlogForm post={post} />;
};

// Edit drop — loads drop from Firestore then renders DropsForm
const EditDropWrapper = () => {
  const { id } = require('react-router-dom').useParams();
  const [drop, setDrop] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const { doc, getDoc } = require('firebase/firestore');
  const { db } = require('./firebase');

  React.useEffect(() => {
    getDoc(doc(db, 'drops', id)).then(snap => {
      if (snap.exists()) setDrop({ id: snap.id, ...snap.data() });
      setLoading(false);
    });
  }, [id]);

  if (loading) return null;
  return <DropsForm drop={drop} />;
};

export default App;
