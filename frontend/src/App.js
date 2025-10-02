import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

// Components
import { ThemeProvider } from "./components/ThemeProvider";
import SecurityProtection from "./components/SecurityProtection";

// Pages
import HomePage from "./components/HomePage";
import SubjectsPage from "./components/SubjectsPage";
import CheckoutPage from "./components/CheckoutPage";
import OrdersPage from "./components/OrdersPage";
import ProtectedAdmin from "./components/ProtectedAdmin";
import SuccessPage from "./components/SuccessPage";

function App() {
  return (
    <ThemeProvider>
      <SecurityProtection />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-900 transition-colors duration-300">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/subjects/:grade" element={<SubjectsPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/admin" element={<ProtectedAdmin />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;