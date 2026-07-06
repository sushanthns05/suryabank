import React, { useState, useEffect } from 'react';
import { useCeoCMS } from '../../../context/CeoCMSContext';
import { db } from '../../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Pencil, Check, X } from 'lucide-react';

const EditableText = ({ collectionName, documentId, fieldKey, fallbackText, className, as: Component = 'span' }) => {
  const { isEditMode } = useCeoCMS();
  const [value, setValue] = useState(fallbackText);
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const docRef = doc(db, collectionName, documentId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data()[fieldKey] !== undefined) {
          setValue(docSnap.data()[fieldKey]);
        }
      } catch (error) {
        console.error("Error fetching editable text:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, [collectionName, documentId, fieldKey]);

  const handleSave = async () => {
    try {
      const docRef = doc(db, collectionName, documentId);
      await setDoc(docRef, { [fieldKey]: tempValue }, { merge: true });
      setValue(tempValue);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving text:", error);
    }
  };

  if (isLoading && !isEditMode) {
    return <span className={`animate-pulse bg-slate-800/50 rounded h-4 inline-block w-24 ${className}`}></span>;
  }

  if (isEditMode && isEditing) {
    return (
      <div className="flex items-center gap-2 relative z-50">
        {Component === 'p' || Component === 'div' ? (
          <textarea
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="bg-slate-900 text-white border border-ceo-gold rounded p-2 w-full text-sm focus:outline-none"
            rows={3}
          />
        ) : (
          <input
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="bg-slate-900 text-white border border-ceo-gold rounded px-2 py-1 w-full text-sm focus:outline-none"
          />
        )}
        <div className="flex gap-1">
          <button onClick={handleSave} className="p-1.5 bg-emerald-600 hover:bg-emerald-500 rounded text-white transition-colors">
            <Check size={14} />
          </button>
          <button onClick={() => setIsEditing(false)} className="p-1.5 bg-rose-600 hover:bg-rose-500 rounded text-white transition-colors">
            <X size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative group inline-block w-full ${isEditMode ? 'hover:outline hover:outline-1 hover:outline-ceo-gold/50 rounded cursor-pointer transition-all' : ''}`}>
      <Component className={className}>
        {value}
      </Component>
      
      {isEditMode && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setTempValue(value);
            setIsEditing(true);
          }}
          className="absolute -top-3 -right-3 p-1.5 bg-ceo-gold text-ceo-navy rounded shadow opacity-0 group-hover:opacity-100 transition-opacity z-10"
          title="Edit Content"
        >
          <Pencil size={12} />
        </button>
      )}
    </div>
  );
};

export default EditableText;
