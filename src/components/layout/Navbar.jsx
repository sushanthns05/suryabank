import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun } from 'lucide-react';
import Button from '../ui/Button';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('userRole') || 'customer';

  let dashboardPath = '/dashboard';
  let dashboardLabel = 'Dashboard';
  if (userRole === 'admin') {
    dashboardPath = '/admin';
    dashboardLabel = 'Admin Portal';
  } else if (userRole === 'employee') {
    dashboardPath = '/employee';
    dashboardLabel = 'Employee Portal';
  }

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if it's a page with a light background at the top (Dashboard, AuthPage, etc.)
  const hasLightBg = location.pathname.includes('/dashboard') || location.pathname.includes('/admin') || location.pathname.includes('/employee') || location.pathname.includes('/auth');
  const isDarkBg = !hasLightBg && !isScrolled;

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled glass' : ''} ${isDarkBg ? 'navbar-dark' : ''}`}>
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">
          <img src="/logo.png" alt="Surya Bank Logo" className="navbar-logo" />
          <span className="brand-text">Surya<span className="brand-accent">Bank</span></span>
        </Link>

        <div className="navbar-links desktop-only">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/services" className="nav-link">Services</Link>
          <Link to="/about" className="nav-link">About Us</Link>
          {isAuthenticated && <Link to={dashboardPath} className="nav-link">{dashboardLabel}</Link>}
        </div>

        <div className="navbar-actions desktop-only">
          {isAuthenticated ? (
            <Button variant="outline" className="login-btn" onClick={handleLogout}>Logout</Button>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="outline" className="login-btn">Login</Button>
              </Link>
              <Link to="/auth">
                <Button variant="primary">Open Account</Button>
              </Link>
            </>
          )}
        </div>

        <button 
          className="mobile-menu-btn mobile-only" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu glass">
          <Link to="/" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link to="/services" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Services</Link>
          <Link to="/about" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
          {isAuthenticated && <Link to={dashboardPath} className="mobile-link" onClick={() => setMobileMenuOpen(false)}>{dashboardLabel}</Link>}
          <div className="mobile-actions">
            {isAuthenticated ? (
              <Button variant="outline" className="w-full mb-2" onClick={() => { setMobileMenuOpen(false); handleLogout(); }}>Logout</Button>
            ) : (
              <>
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full mb-2">Login</Button>
                </Link>
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full">Open Account</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
