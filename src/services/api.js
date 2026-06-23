const API_BASE_URL = 'https://suryabank.onrender.com/api';
import { collection, query, where, getDocs, addDoc, doc, updateDoc, runTransaction, orderBy, deleteField, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'API request failed');
  }
  return data;
};

// Test Connection
export const testApiConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/test`);
    return await response.json();
  } catch (error) {
    console.error('API Test Error:', error);
    return { success: false, message: 'Failed to connect to API' };
  }
};

// Auth Services
export const registerUser = async (userData) => {
  const usersRef = collection(db, 'users');
  
  // 1. Check for duplicates (case-insensitive email, mobile, governmentId)
  const qEmail = query(usersRef, where('emailLowerCase', '==', userData.email.toLowerCase()));
  const qMobile = query(usersRef, where('mobileNumber', '==', userData.mobileNumber));
  const qGovId = query(usersRef, where('governmentId', '==', userData.governmentId));

  const [emailSnap, mobileSnap, govIdSnap] = await Promise.all([
    getDocs(qEmail), getDocs(qMobile), getDocs(qGovId)
  ]);

  if (!emailSnap.empty) throw new Error('Email already exists');
  if (!mobileSnap.empty) throw new Error('Mobile number already registered');
  if (!govIdSnap.empty) throw new Error('Government ID already registered');

  // 2. Generate Account details
  const role = userData.role || 'customer';
  // Generate 12-digit account number (100000000000 to 999999999999)
  const accNo = role === 'employee' || role === 'admin' ? null : Math.floor(100000000000 + Math.random() * 900000000000).toString();
  // Generate 8-digit IFSC code
  const ifsc = role === 'employee' || role === 'admin' ? null : 'SURY0123';

  const newUser = {
    ...userData,
    emailLowerCase: userData.email.toLowerCase(),
    account_number: accNo,
    ifsc_code: ifsc,
    role: role,
    balance: userData.balance || 0,
    createdAt: new Date().toISOString()
  };

  const docRef = await addDoc(usersRef, newUser);
  
  // Generate dummy token
  const token = btoa(JSON.stringify({ id: docRef.id, role: role }));

  return {
    success: true,
    token,
    user: { id: docRef.id, ...newUser }
  };
};

export const loginUser = async (credentials) => {
  const usersRef = collection(db, 'users');
  const qEmail = query(usersRef, where('emailLowerCase', '==', credentials.email.toLowerCase()));
  const snap = await getDocs(qEmail);

  if (snap.empty) throw new Error('Invalid credentials');
  
  const userDoc = snap.docs[0];
  const user = userDoc.data();

  if (user.isBlocked) {
    throw new Error('This account has been blocked for security reasons. Please contact support.');
  }

  if (user.password !== credentials.password) {
    throw new Error('Invalid credentials');
  }

  const token = btoa(JSON.stringify({ id: userDoc.id, role: user.role }));
  
  const { password, ...userWithoutPassword } = user;

  return {
    success: true,
    token,
    user: { id: userDoc.id, ...userWithoutPassword }
  };
};

// Customer Services
export const getCustomers = async () => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('role', '==', 'customer'));
    const snap = await getDocs(q);
    
    const data = snap.docs.map(doc => {
      const d = doc.data();
      return {
        id: doc.id,
        ...d, // Include all fields for details modal
        fullName: d.fullName,
        email: d.email,
        mobileNumber: d.mobileNumber,
        accountNumber: d.account_number,
        ifscCode: d.ifsc_code,
        accountType: d.accountType,
        balance: d.balance,
        isBlocked: d.isBlocked || false,
        createdAt: d.createdAt
      };
    });
    
    data.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    return { success: true, data };
  } catch (err) {
    throw new Error('Failed to fetch customers: ' + err.message);
  }
};

export const getUserByAccount = async (accountNumber, ifscCode) => {
  const usersRef = collection(db, 'users');
  let q;
  if (ifscCode) {
    q = query(usersRef, where('account_number', '==', accountNumber), where('ifsc_code', '==', ifscCode));
  } else {
    q = query(usersRef, where('account_number', '==', accountNumber));
  }
  const snap = await getDocs(q);
  
  if (snap.empty) {
    return { success: false, message: 'Account not found. Please verify Account Number and IFSC Code.' };
  }
  
  const docSnap = snap.docs[0];
  return { success: true, user: { id: docSnap.id, ...docSnap.data() } };
};

export const updateCustomer = async (customerId, customerData) => {
  try {
    const userRef = doc(db, 'users', customerId);
    await updateDoc(userRef, {
      ...customerData,
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const scheduleUserUpdate = async (userId, instantChanges, pendingChanges) => {
  try {
    const userRef = doc(db, 'users', userId);
    const updates = { ...instantChanges };
    
    if (Object.keys(pendingChanges).length > 0) {
      const executeAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      updates.pendingUpdates = {
        changes: pendingChanges,
        executeAt
      };
    }
    
    await updateDoc(userRef, updates);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const applyPendingUpdates = async () => {
  try {
    const usersRef = collection(db, 'users');
    const now = new Date().toISOString();
    const q = query(usersRef, where('pendingUpdates.executeAt', '<=', now));
    const snap = await getDocs(q);
    
    const updatePromises = snap.docs.map(async (userDoc) => {
      const data = userDoc.data();
      if (data.pendingUpdates && data.pendingUpdates.changes) {
        const userRef = doc(db, 'users', userDoc.id);
        const updates = { ...data.pendingUpdates.changes, pendingUpdates: deleteField() };
        await updateDoc(userRef, updates);
      }
    });
    
    await Promise.all(updatePromises);
    return { success: true, count: snap.docs.length };
  } catch (error) {
    console.error("Error applying pending updates:", error);
    return { success: false, message: error.message };
  }
};

export const updateUserDetails = async (userId, data) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, data);
  return { success: true };
};

export const updateCustomerStatus = async (userId, isBlocked) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, { isBlocked });
  return { success: true };
};

export const deleteCustomer = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    await deleteDoc(userRef);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const processTransaction = async (userId, accountNumber, amount, type, description) => {
  const userRef = doc(db, 'users', userId);
  const transactionsRef = collection(db, 'transactions');
  
  try {
    await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists()) {
        throw new Error("User does not exist!");
      }

      let currentBalance = parseFloat(userDoc.data().balance || 0);
      let parsedAmount = parseFloat(amount);
      
      if (type === 'debit') {
        if (currentBalance < parsedAmount) {
          throw new Error("Insufficient funds!");
        }
        currentBalance -= parsedAmount;
      } else {
        currentBalance += parsedAmount;
      }

      transaction.update(userRef, { balance: currentBalance });

      const newTxRef = doc(transactionsRef);
      transaction.set(newTxRef, {
        accountId: userId,
        accountNumber: accountNumber,
        type: type,
        amount: parsedAmount,
        description: description,
        timestamp: new Date().toISOString()
      });
    });
    return { success: true, message: 'Transaction successful' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getTransactions = async (accountNumber) => {
  const txRef = collection(db, 'transactions');
  const q = query(txRef, where('accountNumber', '==', accountNumber));
  const snap = await getDocs(q);
  
  const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  return { success: true, data };
};

export const getAllTransactions = async () => {
  try {
    const txRef = collection(db, 'transactions');
    const snap = await getDocs(txRef);
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Audit & Compliance Services
export const createAuditLog = async (logData) => {
  try {
    const auditRef = collection(db, 'audit_logs');
    const newLog = {
      ...logData,
      timestamp: new Date().toISOString()
    };
    const docRef = await addDoc(auditRef, newLog);
    return { success: true, data: { id: docRef.id, ...newLog } };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getAuditLogs = async () => {
  try {
    const auditRef = collection(db, 'audit_logs');
    const snap = await getDocs(auditRef);
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Consultation Services
export const createConsultation = async (consultationData) => {
  try {
    const consultRef = collection(db, 'consultations');
    const newConsultation = {
      ...consultationData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    const docRef = await addDoc(consultRef, newConsultation);
    return { success: true, data: { id: docRef.id, ...newConsultation } };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getConsultations = async () => {
  try {
    const consultRef = collection(db, 'consultations');
    const snap = await getDocs(consultRef);
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const approveConsultation = async (id, details) => {
  try {
    const consultRef = doc(db, 'consultations', id);
    await updateDoc(consultRef, { 
      status: 'approved', 
      assignedEmployee: details.assignedEmployee,
      appointmentDate: details.appointmentDate,
      appointmentTime: details.appointmentTime,
      updatedAt: new Date().toISOString() 
    });
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Real Loan Services
export const createLoan = async (loanData) => {
  try {
    const loansRef = collection(db, 'loans');
    const newLoan = {
      ...loanData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const docRef = await addDoc(loansRef, newLoan);
    return { success: true, data: { id: docRef.id, ...newLoan } };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getLoans = async () => {
  try {
    const loansRef = collection(db, 'loans');
    const snap = await getDocs(loansRef);
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const updateLoanStatus = async (id, status, updates = {}) => {
  try {
    const loanRef = doc(db, 'loans', id);
    await updateDoc(loanRef, { status, updatedAt: new Date().toISOString(), ...updates });
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Card Application Services
export const createCardApplication = async (applicationData) => {
  try {
    const cardsRef = collection(db, 'card_applications');
    
    // Check if an active application already exists for this account
    const q = query(cardsRef, where('accountNumber', '==', applicationData.accountNumber));
    const existingSnap = await getDocs(q);
    
    if (!existingSnap.empty) {
      const activeApp = existingSnap.docs.find(d => d.data().status !== 'rejected');
      if (activeApp) {
        return { success: false, message: 'An active card application already exists for this account number.' };
      }
    }

    const newApp = {
      ...applicationData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    const docRef = await addDoc(cardsRef, newApp);
    return { success: true, data: { id: docRef.id, ...newApp } };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getCardApplications = async () => {
  try {
    const cardsRef = collection(db, 'card_applications');
    const snap = await getDocs(cardsRef);
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const updateCardApplicationStatus = async (id, status, updates = {}) => {
  try {
    const cardRef = doc(db, 'card_applications', id);
    await updateDoc(cardRef, { status, updatedAt: new Date().toISOString(), ...updates });
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const wipeAllCardApplications = async () => {
  try {
    const cardsRef = collection(db, 'card_applications');
    const snap = await getDocs(cardsRef);
    for (const document of snap.docs) {
      await deleteDoc(doc(db, 'card_applications', document.id));
    }
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Attendance Services
export const markAttendance = async (employeeName, locationCoords) => {
  try {
    const attRef = collection(db, 'attendance');
    
    // Get today's date string (YYYY-MM-DD) in local time
    const today = new Date().toLocaleDateString('en-CA'); 

    // Check if attendance already marked today
    const q = query(
      attRef, 
      where('employeeName', '==', employeeName),
      where('date', '==', today)
    );
    
    const existingSnap = await getDocs(q);
    
    if (!existingSnap.empty) {
      return { success: false, message: 'Attendance already marked for today.' };
    }

    const newRecord = {
      employeeName,
      date: today,
      timestamp: new Date().toISOString(),
      location: locationCoords,
      status: 'Present'
    };
    
    const docRef = await addDoc(attRef, newRecord);
    return { success: true, data: { id: docRef.id, ...newRecord } };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getEmployeeAttendance = async (employeeName) => {
  try {
    const attRef = collection(db, 'attendance');
    const q = query(attRef, where('employeeName', '==', employeeName));
    const snap = await getDocs(q);
    
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    return { success: true, count: data.length, records: data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getTodayAttendance = async () => {
  try {
    const attRef = collection(db, 'attendance');
    const today = new Date().toLocaleDateString('en-CA'); 
    const q = query(attRef, where('date', '==', today));
    const snap = await getDocs(q);
    
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { success: true, records: data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// ==========================================
// EMPLOYEE MANAGEMENT API
// ==========================================

export const getEmployees = async () => {
  try {
    const employeesRef = collection(db, 'employees');
    const q = query(employeesRef);
    const snap = await getDocs(q);
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching employees:", error);
    return { success: false, message: error.message };
  }
};

export const addEmployee = async (employeeData) => {
  try {
    const employeesRef = collection(db, 'employees');
    const newDoc = await addDoc(employeesRef, {
      ...employeeData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return { success: true, id: newDoc.id };
  } catch (error) {
    console.error("Error adding employee:", error);
    return { success: false, message: error.message };
  }
};

export const updateEmployee = async (employeeId, employeeData) => {
  try {
    const employeeRef = doc(db, 'employees', employeeId);
    await updateDoc(employeeRef, {
      ...employeeData,
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating employee:", error);
    return { success: false, message: error.message };
  }
};

export const deleteEmployee = async (employeeId) => {
  try {
    const employeeRef = doc(db, 'employees', employeeId);
    await deleteDoc(employeeRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting employee:", error);
    return { success: false, message: error.message };
  }
};

// ==========================================
// MANAGER BROADCAST SERVICES
// ==========================================

export const createBroadcast = async (broadcastData) => {
  try {
    const broadcastRef = collection(db, 'broadcasts');
    const newBroadcast = {
      ...broadcastData,
      timestamp: new Date().toISOString()
    };
    const docRef = await addDoc(broadcastRef, newBroadcast);
    return { success: true, data: { id: docRef.id, ...newBroadcast } };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getBroadcasts = async () => {
  try {
    const broadcastRef = collection(db, 'broadcasts');
    const snap = await getDocs(broadcastRef);
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return { success: true, broadcasts: data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// ==========================================
// EMPLOYEE TASKS, LEAVES, PERFORMANCE & WARNINGS
// ==========================================

export const getEmployeeTasks = async (employeeId) => {
  try {
    const tasksRef = collection(db, 'employee_tasks');
    const q = query(tasksRef, where('employeeId', '==', employeeId));
    const snap = await getDocs(q);
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const assignTask = async (taskData) => {
  try {
    const tasksRef = collection(db, 'employee_tasks');
    const newTask = {
      ...taskData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    const docRef = await addDoc(tasksRef, newTask);
    return { success: true, id: docRef.id, data: newTask };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const updateTaskStatus = async (taskId, status) => {
  try {
    const taskRef = doc(db, 'employee_tasks', taskId);
    await updateDoc(taskRef, { status, updatedAt: new Date().toISOString() });
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getEmployeeLeaves = async (employeeId) => {
  try {
    const leavesRef = collection(db, 'employee_leaves');
    const q = query(leavesRef, where('employeeId', '==', employeeId));
    const snap = await getDocs(q);
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const applyLeave = async (leaveData) => {
  try {
    const leavesRef = collection(db, 'employee_leaves');
    const newLeave = {
      ...leaveData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const docRef = await addDoc(leavesRef, newLeave);
    return { success: true, id: docRef.id, data: newLeave };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const updateLeaveStatus = async (leaveId, status) => {
  try {
    const leaveRef = doc(db, 'employee_leaves', leaveId);
    await updateDoc(leaveRef, { status, updatedAt: new Date().toISOString() });
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getEvaluations = async (employeeId) => {
  try {
    const evalRef = collection(db, 'employee_evaluations');
    const q = query(evalRef, where('employeeId', '==', employeeId));
    const snap = await getDocs(q);
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const addEvaluation = async (evalData) => {
  try {
    const evalRef = collection(db, 'employee_evaluations');
    const newEval = {
      ...evalData,
      createdAt: new Date().toISOString()
    };
    const docRef = await addDoc(evalRef, newEval);
    return { success: true, id: docRef.id, data: newEval };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getWarnings = async (employeeId) => {
  try {
    const warnRef = collection(db, 'employee_warnings');
    const q = query(warnRef, where('employeeId', '==', employeeId));
    const snap = await getDocs(q);
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const issueWarning = async (warningData) => {
  try {
    const warnRef = collection(db, 'employee_warnings');
    const newWarning = {
      ...warningData,
      createdAt: new Date().toISOString()
    };
    const docRef = await addDoc(warnRef, newWarning);
    return { success: true, id: docRef.id, data: newWarning };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const updateBranchStatus = async (isOpen) => {
  try {
    const statusRef = doc(db, 'settings', 'branch_status');
    await setDoc(statusRef, { isOpen, updatedAt: new Date().toISOString() }, { merge: true });
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
