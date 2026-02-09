import React, { useRef } from 'react';
import './Upload.css';

interface UploadProps {
  onFileSelect: (file: File | null) => void;
  previewUrl?: string;
}

const Upload: React.FC<UploadProps> = ({ onFileSelect, previewUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    onFileSelect(file || null);
  };

  return (
    <div className="upload-container">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <button type="button" className="upload-btn" onClick={() => fileInputRef.current?.click()}>
        Choisir une photo
      </button>
      {previewUrl && (
        <div className="upload-preview">
          <img src={previewUrl} alt="Aperçu" />
        </div>
      )}
    </div>
  );
};

export default Upload;
