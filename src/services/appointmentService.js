import { collection, query, where, getDocs, addDoc, doc, updateDoc, deleteDoc, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

// ==========================================
// MEETING SLOT MANAGEMENT
// ==========================================

export const getAvailableSlots = async (dateRange) => {
  try {
    const slotsRef = collection(db, 'meetingSlots');
    const q = query(slotsRef, where('status', '==', 'Available'));
    const snap = await getDocs(q);
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Filter by date range if provided
    return { success: true, data: data.sort((a, b) => new Date(a.date) - new Date(b.date)) };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const addMeetingSlot = async (slotData) => {
  try {
    const slotsRef = collection(db, 'meetingSlots');
    const newSlot = {
      ...slotData,
      status: 'Available',
      createdAt: new Date().toISOString()
    };
    const docRef = await addDoc(slotsRef, newSlot);
    return { success: true, data: { id: docRef.id, ...newSlot } };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const updateMeetingSlot = async (slotId, slotData) => {
  try {
    const slotRef = doc(db, 'meetingSlots', slotId);
    await updateDoc(slotRef, {
      ...slotData,
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const deleteMeetingSlot = async (slotId) => {
  try {
    const slotRef = doc(db, 'meetingSlots', slotId);
    await deleteDoc(slotRef);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// ==========================================
// APPOINTMENT REQUESTS
// ==========================================

export const requestAppointment = async (requestData) => {
  try {
    const reqRef = collection(db, 'meetingRequests');
    const newRequest = {
      ...requestData,
      status: requestData.status || 'Pending',
      createdAt: new Date().toISOString()
    };
    const docRef = await addDoc(reqRef, newRequest);
    return { success: true, data: { id: docRef.id, ...newRequest } };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getCEOAppointments = async () => {
  try {
    const reqRef = collection(db, 'meetingRequests');
    const q = query(reqRef, orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const subscribeToCEOAppointments = (callback) => {
  const reqRef = collection(db, 'meetingRequests');
  const q = query(reqRef, orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback({ success: true, data });
  }, (error) => {
    callback({ success: false, message: error.message });
  });
};

export const getUserAppointments = async (userId) => {
  try {
    const reqRef = collection(db, 'meetingRequests');
    // We can filter by employeeId or email
    const q = query(reqRef, where('employeeId', '==', userId));
    const snap = await getDocs(q);
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const subscribeToUserAppointments = (userId, callback) => {
  const reqRef = collection(db, 'meetingRequests');
  const q = query(reqRef, where('employeeId', '==', userId));
  return onSnapshot(q, (snap) => {
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    callback({ success: true, data });
  }, (error) => {
    callback({ success: false, message: error.message });
  });
};

export const subscribeToManagerTeamRequests = (managerId, callback) => {
  const reqRef = collection(db, 'meetingRequests');
  const q = query(reqRef, where('managerId', '==', managerId));
  return onSnapshot(q, (snap) => {
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    callback({ success: true, data });
  }, (error) => {
    callback({ success: false, message: error.message });
  });
};

export const updateAppointmentStatus = async (requestId, updateData) => {
  try {
    const reqRef = doc(db, 'meetingRequests', requestId);
    await updateDoc(reqRef, {
      ...updateData,
      updatedAt: new Date().toISOString()
    });
    
    // If we're updating a meeting history record, we should also write to meetingHistory
    if (updateData.status === 'Completed' || updateData.status === 'Cancelled' || updateData.status === 'Approved') {
        const historyRef = collection(db, 'meetingHistory');
        await addDoc(historyRef, {
            requestId,
            status: updateData.status,
            reason: updateData.reason || '',
            timestamp: new Date().toISOString()
        });
    }

    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// ==========================================
// EXECUTIVE NOTES & TASKS
// ==========================================

export const addMeetingNotes = async (notesData) => {
  try {
    const notesRef = collection(db, 'meetingNotes');
    const newNote = {
      ...notesData,
      createdAt: new Date().toISOString()
    };
    const docRef = await addDoc(notesRef, newNote);
    return { success: true, data: { id: docRef.id, ...newNote } };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const addMeetingTasks = async (taskData) => {
  try {
    const tasksRef = collection(db, 'meetingTasks');
    const newTask = {
      ...taskData,
      createdAt: new Date().toISOString()
    };
    const docRef = await addDoc(tasksRef, newTask);
    return { success: true, data: { id: docRef.id, ...newTask } };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
