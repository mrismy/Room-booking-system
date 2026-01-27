import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RoomsPage from "./pages/RoomsPage";
import BookingsPage from "./pages/BookingsPage";
import "./App.css";

const PrivateRoute = () => {
  const { user, isLoading, getToken } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!user && !localStorage.getItem('accessToken')) return <Navigate to="/login" replace />;

  return <Outlet />;
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<PrivateRoute />}>
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/" element={<Navigate to="/rooms" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
