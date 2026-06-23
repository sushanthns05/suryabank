import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import EmployeeLayout from './components/layout/EmployeeLayout';
import { SocketProvider } from './context/SocketContext';
import MaintenanceScreen from './components/MaintenanceScreen';

import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import NetbankingLogin from './pages/NetbankingLogin';
import CustomerDashboard from './pages/CustomerDashboard';
import AboutUs from './pages/AboutUs';
import Services from './pages/Services';
import RecurringDeposit from './pages/RecurringDeposit';
import AccountOpeningForm from './pages/AccountOpeningForm';
import OfflineAccountOpening from './pages/OfflineAccountOpening';
import CardApplicationForm from './pages/CardApplicationForm';
import AdminDashboard from './pages/AdminDashboard';
import AdminUpdates from './pages/admin/AdminUpdates';
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeeLogin from './pages/EmployeeLogin';
import EmployeeOverview from './pages/employee/EmployeeOverview';
import EmployeeAnalytics from './pages/employee/EmployeeAnalytics';
import EmployeeSearchCustomer from './pages/employee/EmployeeSearchCustomer';
import EmployeeLoanApproval from './pages/employee/EmployeeLoanApproval';
import EmployeeProfile from './pages/employee/EmployeeProfile';
import EmployeeNotifications from './pages/employee/EmployeeNotifications';
import EmployeeAttendance from './pages/employee/EmployeeAttendance';

import ManagerLayout from './components/layout/ManagerLayout';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import ManagerBranchManagement from './pages/manager/ManagerBranchManagement';
import ManagerCustomers from './pages/manager/ManagerCustomers';
import ManagerLoans from './pages/manager/ManagerLoans';
import ManagerEmployees from './pages/manager/ManagerEmployees';
import ManagerTransactions from './pages/manager/ManagerTransactions';
import ManagerReports from './pages/manager/ManagerReports';
import ManagerAudit from './pages/manager/ManagerAudit';
import ManagerNotifications from './pages/manager/ManagerNotifications';
import ManagerCommunication from './pages/manager/ManagerCommunication';
import ManagerSettings from './pages/manager/ManagerSettings';
import ManagerProfile from './pages/manager/ManagerProfile';

// Public Layout Wrapper
const PublicLayout = () => (
  <div className="app-container flex flex-col min-h-screen relative">
    <MaintenanceScreen />
    <Navbar />
    <main className="main-content flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);

function App() {
  const isEmployeeSite = window.location.hostname.includes('employee-suryabank');
  const isManagerSite = window.location.hostname.includes('manager-suryabank');
  const isUpdateTriggerSite = window.location.hostname.includes('suryabankupdatetrigger');

  if (isEmployeeSite) {
    return (
      <SocketProvider>
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
            <Route path="download-form" element={<OfflineAccountOpening />} />
            <Route path="loans" element={<EmployeeLoanApproval />} />
            <Route path="profile" element={<EmployeeProfile />} />
            <Route path="notifications" element={<EmployeeNotifications />} />
            <Route path="attendance" element={<EmployeeAttendance />} />
          </Route>
          
          {/* Fallback to login */}
          <Route path="*" element={<Navigate to="/employee-login" replace />} />
        </Routes>
      </Router>
      </SocketProvider>
    );
  }

  if (isManagerSite) {
    return (
      <SocketProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/manager" replace />} />
            
            {/* Manager Dashboard Routes */}
            <Route path="/manager" element={<ManagerLayout />}>
              <Route index element={<ManagerDashboard />} />
              <Route path="branches" element={<ManagerBranchManagement />} />
              <Route path="customers" element={<ManagerCustomers />} />
              <Route path="loans" element={<ManagerLoans />} />
              <Route path="employees" element={<ManagerEmployees />} />
              <Route path="transactions" element={<ManagerTransactions />} />
              <Route path="reports" element={<ManagerReports />} />
              <Route path="audit" element={<ManagerAudit />} />
              <Route path="notifications" element={<ManagerNotifications />} />
              <Route path="communication" element={<ManagerCommunication />} />
              <Route path="settings" element={<ManagerSettings />} />
              <Route path="profile" element={<ManagerProfile />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/manager" replace />} />
          </Routes>
        </Router>
      </SocketProvider>
    );
  }

  // Original Public Site Routing
  return (
    <SocketProvider>
      <Router>
        <Routes>
        {/* Public Routes with Navbar/Footer */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={isUpdateTriggerSite ? <Navigate to="/admin/updates" replace /> : <LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/netbanking-login" element={<NetbankingLogin />} />
          <Route path="/dashboard" element={<CustomerDashboard />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/services" element={<Services />} />
          <Route path="/recurring-deposit" element={<RecurringDeposit />} />
          <Route path="/account-opening-form" element={<AccountOpeningForm />} />
          <Route path="/offline-account-opening" element={<OfflineAccountOpening />} />
          <Route path="/card-application-form" element={<CardApplicationForm />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/updates" element={<AdminUpdates />} />
          <Route path="/employee-login" element={<EmployeeLogin />} />
          <Route path="*" element={<LandingPage />} />
        </Route>

        {/* Employee Dashboard Routes with specialized Layout */}
        <Route path="/employee" element={<EmployeeLayout />}>
          <Route index element={<EmployeeOverview />} />
          <Route path="analytics" element={<EmployeeAnalytics />} />
          <Route path="customers" element={<EmployeeSearchCustomer />} />
          <Route path="open-account" element={<EmployeeDashboard />} />
          <Route path="download-form" element={<OfflineAccountOpening />} />
          <Route path="loans" element={<EmployeeLoanApproval />} />
          <Route path="profile" element={<EmployeeProfile />} />
          <Route path="notifications" element={<EmployeeNotifications />} />
          <Route path="attendance" element={<EmployeeAttendance />} />
          {/* Add more nested routes here in later phases */}
        </Route>
      </Routes>
    </Router>
    </SocketProvider>
  );
}

export default App;
