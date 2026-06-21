const API_BASE_URL = 'https://suryabank.onrender.com/api';
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
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return handleResponse(response);
};

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  return handleResponse(response);
};

// Customer Services
export const getCustomers = async () => {
  const response = await fetch(`${API_BASE_URL}/customers`);
  return handleResponse(response);
};

// Consultation Services
export const createConsultation = async (consultationData) => {
  const response = await fetch(`${API_BASE_URL}/consultations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(consultationData)
  });
  return handleResponse(response);
};

export const getConsultations = async () => {
  const response = await fetch(`${API_BASE_URL}/consultations`);
  return handleResponse(response);
};

export const verifyConsultation = async (id) => {
  const response = await fetch(`${API_BASE_URL}/consultations/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'verified' })
  });
  return handleResponse(response);
};

// Mock Loan Services (until backend supports them)
// In a real scenario, these would hit /api/loans
export const getPendingLoans = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: [
          { id: 'L-1001', customerName: 'Rahul Sharma', type: 'Home Loan', amount: 4500000, tenure: 240, status: 'pending', date: '2026-06-18' },
          { id: 'L-1002', customerName: 'Priya Patel', type: 'Personal Loan', amount: 500000, tenure: 36, status: 'pending', date: '2026-06-19' },
          { id: 'L-1003', customerName: 'Amit Kumar', type: 'Car Loan', amount: 800000, tenure: 60, status: 'pending', date: '2026-06-20' },
        ]
      });
    }, 800);
  });
};

export const updateLoanStatus = async (id, newStatus) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: { id, status: newStatus }
      });
    }, 500);
  });
};
