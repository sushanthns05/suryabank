import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import EmployeeLayout from './components/layout/EmployeeLayout';

import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import CustomerDashboard from './pages/CustomerDashboard';
import AboutUs from './pages/AboutUs';
import Services from './pages/Services';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeeLogin from './pages/EmployeeLogin';
import EmployeeOverview from './pages/employee/EmployeeOverview';
import EmployeeAnalytics from './pages/employee/EmployeeAnalytics';
import EmployeeSearchCustomer from './pages/employee/EmployeeSearchCustomer';
import EmployeeLoanApproval from './pages/employee/EmployeeLoanApproval';
import EmployeeProfile from './pages/employee/EmployeeProfile';

// Public Layout Wrapper
const PublicLayout = () => (
  <div className="app-container flex flex-col min-h-screen">
    <Navbar />
    <main className="main-content flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);

function App() {
  const isEmployeeSite = window.location.hostname.includes('employee-suryabank');

  if (isEmployeeSite) {
    return (
      <Router>
        <Routes>
          {/* Default employee site routes */}
          <Route path="/" element={<Navigate to="/employee-login" replace />} />
          <Route path="/employee-login" element={
            <div className="app-container flex flex-col min-h-screen">
              <main className="main-content flex-grow">
                <EmployeeLogin />
              </main>
            </div>
          } />
          
          {/* Employee Dashboard Routes */}
          <Route path="/employee" element={<EmployeeLayout />}>
            <Route index element={<EmployeeOverview />} />
            <Route path="analytics" element={<EmployeeAnalytics />} />
            <Route path="customers" element={<EmployeeSearchCustomer />} />
            <Route path="open-account" element={<EmployeeDashboard />} />
            <Route path="loans" element={<EmployeeLoanApproval />} />
            <Route path="profile" element={<EmployeeProfile />} />
          </Route>
          
          {/* Fallback to login */}
          <Route path="*" element={<Navigate to="/employee-login" replace />} />
        </Routes>
      </Router>
    );
  }

  // Original Public Site Routing
  return (
    <Router>
      <Routes>
        {/* Public Routes with Navbar/Footer */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<CustomerDashboard />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/services" element={<Services />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/employee-login" element={<EmployeeLogin />} />
          <Route path="*" element={<LandingPage />} />
        </Route>

        {/* Employee Dashboard Routes with specialized Layout */}
        <Route path="/employee" element={<EmployeeLayout />}>
          <Route index element={<EmployeeOverview />} />
          <Route path="analytics" element={<EmployeeAnalytics />} />
          <Route path="customers" element={<EmployeeSearchCustomer />} />
          <Route path="open-account" element={<EmployeeDashboard />} />
          <Route path="loans" element={<EmployeeLoanApproval />} />
          <Route path="profile" element={<EmployeeProfile />} />
          {/* Add more nested routes here in later phases */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
