import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import HomePageScreen from "./screens/HomePageScreen";
import CreatePostScreen from "./screens/CreatePostScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import PostDetailScreen from "./screens/PostDetailScreen";
import LoadingSpinner from "./components/atoms/LoadingSpinner/LoadingSpinner";

const App = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          !isAuthenticated ? <LoginScreen /> : <Navigate to="/" replace />
        }
      />
      <Route
        path="/register"
        element={
          !isAuthenticated ? <RegisterScreen /> : <Navigate to="/" replace />
        }
      />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <HomePageScreen />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/create"
        element={
          isAuthenticated ? (
            <CreatePostScreen />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/profile/:userId"
        element={
          isAuthenticated ? <ProfileScreen /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/post/:postId"
        element={
          isAuthenticated ? (
            <PostDetailScreen />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
