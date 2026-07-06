import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  sendEmailVerification
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { auth, db } from '../firebase';

const CeoAuthContext = createContext(null);

export const CeoAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [mfaVerified, setMfaVerified] = useState(
    localStorage.getItem('mfa_verified') === 'true' || 
    sessionStorage.getItem('mfa_verified') === 'true'
  );
  const [loginHistory, setLoginHistory] = useState([]);

  // Inactivity timeout: 15 minutes (900000ms)
  const INACTIVITY_TIMEOUT = 900000; 

  // Write a secure audit log for logins
  const logSessionHistory = async (firebaseUser, assignedRole) => {
    try {
      let ip = '103.241.12.8'; // Default mock IP
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        if (response.ok) {
          const data = await response.json();
          ip = data.ip || ip;
        }
      } catch (ipErr) {
        console.warn("Could not retrieve client IP, using secure route mock IP", ipErr);
      }

      const logData = {
        email: firebaseUser.email,
        role: assignedRole,
        timestamp: new Date().toISOString(),
        ipAddress: ip,
        userAgent: navigator.userAgent,
        country: 'IN' // Default mock location
      };

      await addDoc(collection(db, 'ceo_session_logs'), logData);
      
      // Add notification for the log
      await addDoc(collection(db, 'ceo_notifications'), {
        title: 'New Secure Login Detected',
        message: `Account ${firebaseUser.email} logged in from IP ${ip}.`,
        type: 'security',
        read: false,
        timestamp: new Date().toISOString(),
        role: assignedRole
      });

      // Update local history cache
      setLoginHistory(prev => [logData, ...prev].slice(0, 10));
    } catch (err) {
      console.error("Failed to write login session logs:", err);
    }
  };

  useEffect(() => {
    let timeoutId;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (user && mfaVerified) {
        timeoutId = setTimeout(handleAutoLogout, INACTIVITY_TIMEOUT);
      }
    };

    const handleAutoLogout = async () => {
      await signOut(auth);
      setSessionExpired(true);
      setUser(null);
      setRole(null);
      setMfaVerified(false);
      localStorage.removeItem('active_role');
      localStorage.removeItem('mfa_verified');
      sessionStorage.removeItem('mfa_verified');
      
      // Write system log
      try {
        await addDoc(collection(db, 'ceo_notifications'), {
          title: 'Session Timeout',
          message: 'Secure session closed due to 15 minutes inactivity.',
          type: 'warning',
          read: false,
          timestamp: new Date().toISOString(),
          role: 'CEO'
        });
      } catch (e) {
        console.error(e);
      }
    };

    // User activity listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    if (user && mfaVerified) {
      events.forEach(evt => window.addEventListener(evt, resetTimer));
      resetTimer(); // Start timer
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(evt => window.removeEventListener(evt, resetTimer));
    };
  }, [user, mfaVerified]);

  // Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        
        try {
          // Fetch or assign role in Firestore
          const userDocRef = doc(db, 'ceo_users', firebaseUser.uid);
          let userSnap = await getDoc(userDocRef);
          let assignedRole = '';

          if (!userSnap.exists()) {
            assignedRole = 'Investor'; // default fallback
            if (firebaseUser.email.includes('ceo') || firebaseUser.email.includes('founder')) {
              assignedRole = 'CEO';
            } else if (firebaseUser.email.includes('assistant')) {
              assignedRole = 'Executive Assistant';
            } else if (firebaseUser.email.includes('board')) {
              assignedRole = 'Board Member';
            } else if (firebaseUser.email.includes('admin')) {
              assignedRole = 'Administrator';
            } else if (firebaseUser.email.includes('media')) {
              assignedRole = 'Media';
            }

            // Create Firestore profile
            await setDoc(userDocRef, {
              email: firebaseUser.email,
              role: assignedRole,
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString()
            });
          } else {
            const userData = userSnap.data();
            assignedRole = userData.role;
            
            // Update last login
            await updateDoc(userDocRef, {
              lastLogin: new Date().toISOString()
            });
          }
          
          setRole(assignedRole);
          localStorage.setItem('active_role', assignedRole);

          // Fetch login history logs
          try {
            const q = query(collection(db, 'ceo_session_logs'), orderBy('timestamp', 'desc'), limit(10));
            const querySnap = await getDocs(q);
            const history = [];
            querySnap.forEach(d => history.push(d.data()));
            setLoginHistory(history);
          } catch (historyErr) {
            console.error(historyErr);
          }
        } catch (err) {
          console.error("Error fetching CEO user data:", err);
          // If Firestore fails, default to safe fallback so the screen doesn't stay blank
          setRole('Investor');
        }

      } else {
        setUser(null);
        setRole(null);
        setMfaVerified(false);
        localStorage.removeItem('mfa_verified');
        sessionStorage.removeItem('mfa_verified');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Login handler supporting automatic creation of ceo credentials if not present
  const login = async (emailOrUsername, password, rememberMe = true) => {
    let email = emailOrUsername;
    if (!email.includes('@')) {
      email = `${emailOrUsername}@suryabank.com`;
    }

    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      setSessionExpired(false);
      return credential;
    } catch (error) {
      if ((error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') && email === 'ceosuryabank@suryabank.com') {
        try {
          const newCredential = await createUserWithEmailAndPassword(auth, email, password);
          setSessionExpired(false);
          return newCredential;
        } catch (signUpErr) {
          throw signUpErr;
        }
      }
      throw error;
    }
  };

  // Verify custom OTP for MFA
  const verifyMfa = async (code, rememberMe = false) => {
    if (code === '482910') { // Default golden secure code
      setMfaVerified(true);
      if (rememberMe) {
        localStorage.setItem('mfa_verified', 'true');
      } else {
        sessionStorage.setItem('mfa_verified', 'true');
      }

      if (user && role) {
        await logSessionHistory(user, role);
      }
      return true;
    }
    throw new Error('Invalid authentication code.');
  };

  // Google Provider Sign In
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  // Microsoft Provider Sign In
  const loginWithMicrosoft = async () => {
    const provider = new OAuthProvider('microsoft.com');
    return signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setRole(null);
    setMfaVerified(false);
    localStorage.removeItem('active_role');
    localStorage.removeItem('mfa_verified');
    sessionStorage.removeItem('mfa_verified');
  };

  const resetPassword = async (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const sendVerification = async () => {
    if (auth.currentUser) {
      return sendEmailVerification(auth.currentUser);
    }
  };

  // Check role permission helper
  const hasPermission = (allowedRoles) => {
    return role && allowedRoles.includes(role);
  };

  const value = {
    user,
    role,
    loading,
    sessionExpired,
    setSessionExpired,
    mfaVerified,
    setMfaVerified,
    verifyMfa,
    loginHistory,
    login,
    loginWithGoogle,
    loginWithMicrosoft,
    logout,
    resetPassword,
    sendVerification,
    hasPermission
  };

  return (
    <CeoAuthContext.Provider value={value}>
      {!loading && children}
    </CeoAuthContext.Provider>
  );
};

export const useCeoAuth = () => {
  return useContext(CeoAuthContext);
};

