import { collection, query, where, getDocs, addDoc, doc, updateDoc, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Submit a new product for lifecycle management.
 */
export const requestProductLaunch = async (payload) => {
  try {
    const productsRef = collection(db, 'productReleases');
    const newRequest = {
      ...payload,
      status: 'Submitted to Manager',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      auditHistory: [
        {
          action: 'Product Submitted',
          timestamp: new Date().toISOString(),
          actor: payload.requesterName || 'Employee',
          role: 'Employee',
          ip: '10.0.0.4', // Mocked IP for simulation
          device: 'Employee Desktop'
        }
      ]
    };
    
    const docRef = await addDoc(productsRef, newRequest);
    return { success: true, data: { id: docRef.id, ...newRequest } };
  } catch (error) {
    console.error("Error submitting product:", error);
    return { success: false, message: error.message };
  }
};

/**
 * Real-time subscription for an Employee's own products.
 */
export const subscribeToUserProducts = (employeeId, callback) => {
  if (!employeeId) return () => {};

  const productsRef = collection(db, 'productReleases');
  const q = query(
    productsRef, 
    where('requesterId', '==', employeeId)
  );
  
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort client-side if missing index
    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    callback(data);
  }, (error) => {
    console.error("Error subscribing to employee products:", error);
    callback([]);
  });
};

/**
 * Real-time subscription for a Manager's team products.
 */
export const subscribeToManagerTeamProducts = (managerId, callback) => {
  if (!managerId) return () => {};

  const productsRef = collection(db, 'productReleases');
  const q = query(
    productsRef, 
    where('managerId', '==', managerId)
  );
  
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    callback(data);
  }, (error) => {
    console.error("Error subscribing to manager products:", error);
    callback([]);
  });
};

/**
 * Real-time subscription for the CEO (only products that passed Manager).
 */
export const subscribeToCEOProducts = (callback) => {
  const productsRef = collection(db, 'productReleases');
  // For CEO, we only want products that have been at least Manager Approved.
  // To avoid complex composite queries without composite indexes, 
  // we fetch all that have managerStatus === 'Approved'
  const q = query(
    productsRef,
    where('managerStatus', '==', 'Approved')
  );
  
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    callback(data);
  }, (error) => {
    console.error("Error subscribing to CEO products:", error);
    callback([]);
  });
};

/**
 * Update the status of a product release (handles approvals, launches, etc).
 */
export const updateProductStatus = async (productId, payload) => {
  try {
    const productRef = doc(db, 'productReleases', productId);
    await updateDoc(productRef, {
      ...payload,
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating product status:", error);
    return { success: false, message: error.message };
  }
};
