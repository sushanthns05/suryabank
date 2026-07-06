import React, { useState, useEffect, useRef } from 'react';
import { useCeoCMS } from '../../../context/CeoCMSContext';
import { db } from '../../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Image as ImageIcon, Check, X, UploadCloud, Loader2 } from 'lucide-react';

const EditableImage = ({ collectionName, documentId, fieldKey, fallbackSrc, alt, className }) => {
  const { isEditMode } = useCeoCMS();
  const [src, setSrc] = useState(fallbackSrc);
  const [isEditing, setIsEditing] = useState(false);
  const [tempSrc, setTempSrc] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const fileInputRef = useRef(null);
  const storage = getStorage();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const docRef = doc(db, collectionName, documentId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data()[fieldKey] !== undefined) {
          setSrc(docSnap.data()[fieldKey]);
        }
      } catch (error) {
        console.error("Error fetching editable image:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, [collectionName, documentId, fieldKey]);

  const handleSave = async () => {
    try {
      const docRef = doc(db, collectionName, documentId);
      await setDoc(docRef, { [fieldKey]: tempSrc }, { merge: true });
      setSrc(tempSrc);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving image:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const storageRef = ref(storage, `cms_media/${documentId}_${fieldKey}_${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      }, 
      (error) => {
        console.error("Upload error:", error);
        setIsUploading(false);
      }, 
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setTempSrc(downloadURL);
        setIsUploading(false);
      }
    );
  };

  if (isLoading && !isEditMode) {
    return <div className={`animate-pulse bg-slate-800/50 rounded ${className}`}></div>;
  }

  if (isEditMode && isEditing) {
    return (
      <div className={`relative z-50 p-4 bg-slate-900 border-2 border-ceo-gold rounded-xl shadow-2xl ${className}`}>
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Replace Image</span>
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={isUploading} className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded text-white text-xs font-bold transition-colors disabled:opacity-50">
              <Check size={14} /> Save
            </button>
            <button onClick={() => setIsEditing(false)} className="flex items-center gap-1 px-3 py-1 bg-rose-600 hover:bg-rose-500 rounded text-white text-xs font-bold transition-colors">
              <X size={14} /> Cancel
            </button>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-lg p-6 bg-slate-950 hover:bg-slate-900/80 transition-colors">
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="animate-spin text-ceo-gold" size={32} />
              <span className="text-xs text-slate-400">Uploading... {Math.round(uploadProgress)}%</span>
            </div>
          ) : (
            <>
              {tempSrc ? (
                <div className="relative group">
                  <img src={tempSrc} alt="Preview" className="max-h-48 object-contain rounded" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded">
                    <button onClick={() => fileInputRef.current.click()} className="px-4 py-2 bg-ceo-gold text-ceo-navy font-bold rounded-lg text-sm flex items-center gap-2">
                      <UploadCloud size={16} /> Change Image
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => fileInputRef.current.click()}>
                  <UploadCloud size={32} className="text-slate-500" />
                  <span className="text-sm text-slate-400">Click to upload an image from device</span>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
            </>
          )}
        </div>
        
        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs text-slate-500 font-bold whitespace-nowrap">OR URL:</span>
          <input 
            type="text" 
            value={tempSrc}
            onChange={(e) => setTempSrc(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full bg-slate-950 text-white border border-slate-700 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-ceo-gold"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative group inline-block ${className} ${isEditMode ? 'hover:outline hover:outline-4 hover:outline-ceo-gold/60 rounded cursor-pointer transition-all' : ''}`}>
      <img src={src} alt={alt} className={className} />
      
      {isEditMode && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setTempSrc(src);
            setIsEditing(true);
          }}
          className="absolute inset-0 m-auto w-12 h-12 flex items-center justify-center bg-ceo-gold text-ceo-navy rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:scale-110"
          title="Edit Image"
        >
          <ImageIcon size={20} />
        </button>
      )}
    </div>
  );
};

export default EditableImage;
