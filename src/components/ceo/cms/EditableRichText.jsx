import React, { useState, useEffect } from 'react';
import { useCeoCMS } from '../../../context/CeoCMSContext';
import { db } from '../../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Pencil, Check, X } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EditableRichText = ({ collectionName, documentId, fieldKey, fallbackHtml, className }) => {
  const { isEditMode } = useCeoCMS();
  const [value, setValue] = useState(fallbackHtml);
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
        console.error("Error fetching editable rich text:", error);
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
      console.error("Error saving rich text:", error);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  };

  if (isLoading && !isEditMode) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="animate-pulse bg-slate-800/50 rounded h-4 w-full"></div>
        <div className="animate-pulse bg-slate-800/50 rounded h-4 w-5/6"></div>
        <div className="animate-pulse bg-slate-800/50 rounded h-4 w-4/6"></div>
      </div>
    );
  }

  if (isEditMode && isEditing) {
    return (
      <div className="relative z-50 bg-white text-black rounded shadow-2xl p-2 border-2 border-ceo-gold">
        <div className="flex justify-between items-center mb-2 px-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rich Text Editor</span>
          <div className="flex gap-2">
            <button onClick={handleSave} className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded text-white text-xs font-bold transition-colors">
              <Check size={14} /> Save
            </button>
            <button onClick={() => setIsEditing(false)} className="flex items-center gap-1 px-3 py-1 bg-rose-600 hover:bg-rose-500 rounded text-white text-xs font-bold transition-colors">
              <X size={14} /> Cancel
            </button>
          </div>
        </div>
        <ReactQuill 
          theme="snow" 
          value={tempValue} 
          onChange={setTempValue} 
          modules={modules}
          className="bg-white text-slate-800"
        />
      </div>
    );
  }

  return (
    <div className={`relative group w-full ${isEditMode ? 'hover:outline hover:outline-2 hover:outline-dashed hover:outline-ceo-gold/60 p-2 rounded cursor-pointer transition-all' : ''}`}>
      <div 
        className={`prose prose-invert max-w-none ${className}`}
        dangerouslySetInnerHTML={{ __html: value }} 
      />
      
      {isEditMode && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setTempValue(value);
            setIsEditing(true);
          }}
          className="absolute -top-3 -right-3 p-2 bg-ceo-gold text-ceo-navy rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
          title="Edit Content"
        >
          <Pencil size={14} />
        </button>
      )}
    </div>
  );
};

export default EditableRichText;
