import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import { checkAuth } from "../slices/userSlice";

import SignUp from "./Pages/Signup";
import Home from "./Pages/Home";
import VerifyOTP from "./Pages/VerifyOTP";
import ShimmerEffect from "./Pages/ShimmerEffect";

export default function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (loading) {
    return <ShimmerEffect />;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <Home /> : <Navigate to="/signup" replace />}
      />
      <Route
        path="/signup"
        element={!isAuthenticated ? <SignUp /> : <Navigate to="/" replace />}
      />
      <Route
        path="/verifyOTP"
        element={!isAuthenticated ? <VerifyOTP /> : <Navigate to="/" replace />}
      />

      {/* 🔴 Catch-all route: redirect unknown paths */}
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/" : "/signup"} replace />}
      />
    </Routes>
  );
}
