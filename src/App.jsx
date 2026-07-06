import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import EmployeeLayout from './components/layout/EmployeeLayout';
import { SocketProvider } from './context/SocketContext';
import MaintenanceScreen from './components/MaintenanceScreen';
import DesktopPortalSelector from './components/DesktopPortalSelector';

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
import AadhaarSeedingForm from './pages/AadhaarSeedingForm';
import DepositPayInSlip from './pages/DepositPayInSlip';
import ChequeBookRequisitionForm from './pages/ChequeBookRequisitionForm';
import InternetBankingPermissionForm from './pages/InternetBankingPermissionForm';
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
import EmployeeLeaves from './pages/employee/EmployeeLeaves';
import EmployeeAppointments from './pages/employee/EmployeeAppointments';
import ProductDevelopmentCenter from './pages/employee/ProductDevelopmentCenter';
import ManagerLogin from './pages/manager/ManagerLogin';
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
import ManagerAttendance from './pages/manager/ManagerAttendance';
import ManagerAppointments from './pages/manager/ManagerAppointments';
import ProductReviewCenter from './pages/manager/ProductReviewCenter';
import CeoLayout from './pages/ceo/CeoLayout';
import CeoHome from './pages/ceo/CeoHome';
import CeoAbout from './pages/ceo/CeoAbout';
import CeoMessage from './pages/ceo/CeoMessage';
import CeoVision from './pages/ceo/CeoVision';
import CeoStrategy from './pages/ceo/CeoStrategy';
import CeoInnovation from './pages/ceo/CeoInnovation';
import CeoGovernance from './pages/ceo/CeoGovernance';
import CeoESG from './pages/ceo/CeoESG';
import CeoInvestorRelations from './pages/ceo/CeoInvestorRelations';
import CeoMedia from './pages/ceo/CeoMedia';
import CeoPublications from './pages/ceo/CeoPublications';
import CeoAwards from './pages/ceo/CeoAwards';
import CeoEvents from './pages/ceo/CeoEvents';
import CeoGallery from './pages/ceo/CeoGallery';
import CeoContact from './pages/ceo/CeoContact';
import CeoAdmin from './pages/ceo/CeoAdmin';

// Secure Executive Office Imports
import { CeoAuthProvider } from './context/CeoAuthContext';
import { CeoCMSProvider } from './context/CeoCMSContext';
import ProtectedRoute from './components/ceo/ProtectedRoute';
import CeoLogin from './pages/ceo/CeoLogin';
import CeoDashboard from './pages/ceo/secure/CeoDashboard';
import EADashboard from './pages/ceo/secure/EADashboard';
import BoardDashboard from './pages/ceo/secure/BoardDashboard';
import InvestorDashboard from './pages/ceo/secure/InvestorDashboard';
import MediaDashboard from './pages/ceo/secure/MediaDashboard';
import AdminDashboardSecure from './pages/ceo/secure/AdminDashboard';
import CeoCalendar from './pages/ceo/secure/CeoCalendar';
import CeoDocVault from './pages/ceo/secure/CeoDocVault';
import CeoProfileEditor from './pages/ceo/secure/CeoProfileEditor';
import CeoCommandCenter from './pages/ceo/secure/CeoCommandCenter';
import CeoAppointments from './pages/ceo/secure/CeoAppointments';
import ExecutiveLaunchControl from './pages/ceo/secure/ExecutiveLaunchControl';
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
  const isDesktopApp = !!window.electronAPI || window.location.protocol === 'file:' || window.navigator.userAgent.includes('Electron');
  
  // Catch portal query parameters
  const queryParams = new URLSearchParams(window.location.search);
  const portalParam = queryParams.get('portal');
  if (portalParam && ['employee', 'manager', 'ceo'].includes(portalParam)) {
    localStorage.setItem('active_portal', portalParam);
    // Clean parameter from browser address bar history
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  const [activePortal, setActivePortal] = useState(() => {
    return localStorage.getItem('active_portal') || null;
  });

  const isEmployeeSite = window.location.hostname.includes('employee-suryabank') || activePortal === 'employee';
  const isManagerSite = window.location.hostname.includes('manager-suryabank') || activePortal === 'manager';
  const isCeoSite = window.location.hostname.includes('ceo-suryabank') || activePortal === 'ceo';
  const isUpdateTriggerSite = window.location.hostname.includes('suryabankupdatetrigger');

  if (isDesktopApp && !activePortal) {
    return <DesktopPortalSelector onSelect={(portal) => {
      localStorage.setItem('active_portal', portal);
      setActivePortal(portal);
    }} />;
  }

  const DesktopSwitchButton = () => {
    if (!isDesktopApp) return null;
    return (
      <button 
        onClick={() => {
          localStorage.removeItem('active_portal');
          setActivePortal(null);
          localStorage.removeItem('employeeToken');
          localStorage.removeItem('managerToken');
          localStorage.removeItem('token');
        }}
        className="fixed bottom-6 right-6 z-[9999] bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-full shadow-lg flex items-center justify-center transition-colors group"
        title="Switch Portal"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 ease-in-out font-medium">
          Switch Portal
        </span>
      </button>
    );
  };

  if (isEmployeeSite) {
    return (
      <SocketProvider>
        <DesktopSwitchButton />
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/employee-login" replace />} />
            <Route path="/employee-login" element={
              <div className="app-container flex flex-col min-h-screen">
                <main className="main-content flex-grow">
                  <EmployeeLogin />
                </main>
              </div>
            } />
            
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
              <Route path="leave" element={<EmployeeLeaves />} />
              <Route path="appointments" element={<EmployeeAppointments />} />
              <Route path="products" element={<ProductDevelopmentCenter />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/employee-login" replace />} />
          </Routes>
        </Router>
      </SocketProvider>
    );
  }

  if (isManagerSite) {
    return (
      <SocketProvider>
        <DesktopSwitchButton />
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/manager" replace />} />
            <Route path="/manager-login" element={<ManagerLogin />} />
            
            <Route path="/manager" element={<ManagerLayout />}>
              <Route index element={<ManagerDashboard />} />
              <Route path="branches" element={<ManagerBranchManagement />} />
              <Route path="customers" element={<ManagerCustomers />} />
              <Route path="loans" element={<ManagerLoans />} />
              <Route path="employees" element={<ManagerEmployees />} />
              <Route path="attendance" element={<ManagerAttendance />} />
              <Route path="transactions" element={<ManagerTransactions />} />
              <Route path="reports" element={<ManagerReports />} />
              <Route path="audit" element={<ManagerAudit />} />
              <Route path="notifications" element={<ManagerNotifications />} />
              <Route path="communication" element={<ManagerCommunication />} />
              <Route path="settings" element={<ManagerSettings />} />
              <Route path="profile" element={<ManagerProfile />} />
              <Route path="appointments" element={<ManagerAppointments />} />
              <Route path="products" element={<ProductReviewCenter />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/manager" replace />} />
          </Routes>
        </Router>
      </SocketProvider>
    );
  }

  if (isCeoSite) {
    return (
      <CeoAuthProvider>
        <CeoCMSProvider>
          <SocketProvider>
          <DesktopSwitchButton />
          <Router>
            <Routes>
              <Route path="/" element={<Navigate to="/ceo" replace />} />
              <Route path="/ceo" element={<CeoLayout />}>
                <Route path="login" element={<CeoLogin />} />
                
                <Route element={<ProtectedRoute allowedRoles={['CEO']} />}>
                  <Route index element={<CeoHome />} />
                  <Route path="about" element={<CeoAbout />} />
                  <Route path="message" element={<CeoMessage />} />
                  <Route path="vision" element={<CeoVision />} />
                  <Route path="strategy" element={<CeoStrategy />} />
                  <Route path="innovation" element={<CeoInnovation />} />
                  <Route path="governance" element={<CeoGovernance />} />
                  <Route path="esg" element={<CeoESG />} />
                  <Route path="investors" element={<CeoInvestorRelations />} />
                  <Route path="media" element={<CeoMedia />} />
                  <Route path="publications" element={<CeoPublications />} />
                  <Route path="awards" element={<CeoAwards />} />
                  <Route path="events" element={<CeoEvents />} />
                  <Route path="gallery" element={<CeoGallery />} />
                  <Route path="contact" element={<CeoContact />} />
                  
                  {/* Secure Executive Paths */}
                  <Route path="dashboard" element={<CeoDashboard />} />
                  <Route path="ea" element={<EADashboard />} />
                  <Route path="board" element={<BoardDashboard />} />
                  <Route path="investor-dashboard" element={<InvestorDashboard />} />
                  <Route path="media-secure" element={<MediaDashboard />} />
                  <Route path="admin" element={<AdminDashboardSecure />} />
                  <Route path="calendar" element={<CeoCalendar />} />
                  <Route path="vault" element={<CeoDocVault />} />
                  <Route path="profile-editor" element={<CeoProfileEditor />} />
                  <Route path="command-center" element={<CeoCommandCenter />} />
                  <Route path="appointments" element={<CeoAppointments />} />
                  <Route path="launch-control" element={<ExecutiveLaunchControl />} />
                </Route>
              </Route>
              <Route path="*" element={<Navigate to="/ceo" replace />} />
            </Routes>
          </Router>
          </SocketProvider>
        </CeoCMSProvider>
      </CeoAuthProvider>
    );
  }

  // Original Public Site Routing with added CEO routes for direct access
  return (
    <CeoAuthProvider>
      <CeoCMSProvider>
        <SocketProvider>
        <DesktopSwitchButton />
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
              <Route path="/aadhaar-seeding-form" element={<AadhaarSeedingForm />} />
              <Route path="/deposit-pay-in-slip" element={<DepositPayInSlip />} />
              <Route path="/cheque-book-requisition-form" element={<ChequeBookRequisitionForm />} />
              <Route path="/internet-banking-permission-form" element={<InternetBankingPermissionForm />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/updates" element={<AdminUpdates />} />
              <Route path="/employee-login" element={<EmployeeLogin />} />
              <Route path="*" element={<LandingPage />} />
            </Route>

            {/* CEO Portal Routes */}
            <Route path="/ceo" element={<CeoLayout />}>
              <Route path="login" element={<CeoLogin />} />
              
              <Route element={<ProtectedRoute allowedRoles={['CEO']} />}>
                <Route index element={<CeoHome />} />
                <Route path="about" element={<CeoAbout />} />
                <Route path="message" element={<CeoMessage />} />
                <Route path="vision" element={<CeoVision />} />
                <Route path="strategy" element={<CeoStrategy />} />
                <Route path="innovation" element={<CeoInnovation />} />
                <Route path="governance" element={<CeoGovernance />} />
                <Route path="esg" element={<CeoESG />} />
                <Route path="investors" element={<CeoInvestorRelations />} />
                <Route path="media" element={<CeoMedia />} />
                <Route path="publications" element={<CeoPublications />} />
                <Route path="awards" element={<CeoAwards />} />
                <Route path="events" element={<CeoEvents />} />
                <Route path="gallery" element={<CeoGallery />} />
                <Route path="contact" element={<CeoContact />} />
                
                {/* Secure Executive Paths */}
                <Route path="dashboard" element={<CeoDashboard />} />
                <Route path="ea" element={<EADashboard />} />
                <Route path="board" element={<BoardDashboard />} />
                <Route path="investor-dashboard" element={<InvestorDashboard />} />
                <Route path="media-secure" element={<MediaDashboard />} />
                <Route path="admin" element={<AdminDashboardSecure />} />
                <Route path="calendar" element={<CeoCalendar />} />
                <Route path="vault" element={<CeoDocVault />} />
                <Route path="profile-editor" element={<CeoProfileEditor />} />
                <Route path="command-center" element={<CeoCommandCenter />} />
                <Route path="launch-control" element={<ExecutiveLaunchControl />} />
              </Route>
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
              <Route path="leave" element={<EmployeeLeaves />} />
              <Route path="appointments" element={<EmployeeAppointments />} />
              <Route path="products" element={<ProductDevelopmentCenter />} />
            </Route>
          </Routes>
        </Router>
        </SocketProvider>
      </CeoCMSProvider>
    </CeoAuthProvider>
  );
}

export default App;
