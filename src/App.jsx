import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './components/Login';
import Register from './components/Register';
import BookmarkList from './components/BookmarkList';
import AddBookmark from './components/AddBookmark';
import Navbar from './components/Navbar';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent"
        />
      </div>
    );
  }

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-dark-900 transition-colors duration-300">
          {isAuthenticated && <Navbar setIsAuthenticated={setIsAuthenticated} />}
          <div className="container mx-auto px-4 py-8 mt-24">
            <AnimatePresence mode="wait">
              <Routes>
                <Route
                  path="/login"
                  element={
                    !isAuthenticated ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Login setIsAuthenticated={setIsAuthenticated} />
                      </motion.div>
                    ) : (
                      <Navigate to="/" />
                    )
                  }
                />
                <Route
                  path="/register"
                  element={
                    !isAuthenticated ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Register setIsAuthenticated={setIsAuthenticated} />
                      </motion.div>
                    ) : (
                      <Navigate to="/" />
                    )
                  }
                />
                <Route
                  path="/"
                  element={
                    isAuthenticated ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-8"
                      >
                        <AddBookmark />
                        <BookmarkList />
                      </motion.div>
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
              </Routes>
            </AnimatePresence>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
