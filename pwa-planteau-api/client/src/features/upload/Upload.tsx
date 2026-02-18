import React, { useRef, useState, useEffect } from 'react';
import './Upload.css';

interface UploadProps {
  onFileSelect: (file: File | null) => void;
  previewUrl?: string;
}

const Upload: React.FC<UploadProps> = ({ onFileSelect, previewUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Assigner le stream au video element quand il devient disponible
  useEffect(() => {
    if (stream && videoRef.current && isCameraActive) {
      console.log('✓ Assignement du stream au video element...');
      videoRef.current.srcObject = stream;
      console.log('✓ Stream assigné au video element');
    }
  }, [stream, isCameraActive]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    onFileSelect(file || null);
  };

  const handleStartCamera = async () => {
    try {
      setCameraError(null);
      console.log('Démarrage de la caméra...');

      // Essayer d'abord la caméra arrière (mobile)
      let mediaStream: MediaStream | null = null;
      try {
        console.log('Tentative: caméra arrière (mobile)...');
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });
        console.log('✓ Caméra arrière activée');
      } catch (err) {
        console.log('✗ Caméra arrière non disponible, tentative: caméra avant (desktop)...');
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user' },
            audio: false,
          });
          console.log('✓ Caméra avant activée');
        } catch (userErr) {
          console.log('✗ Caméra avant non disponible, tentative sans facingMode...');
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
          console.log('✓ Caméra par défaut activée');
        }
      }

      console.log('✓ MediaStream reçu:', mediaStream);
      console.log('✓ Nombre de tracks:', mediaStream.getTracks().length);

      setStream(mediaStream);
      setIsCameraActive(true);
    } catch (err: any) {
      const errorMessage = err?.message || 'Erreur inconnue';
      console.error('✗ Erreur caméra:', err);
      setCameraError(`Impossible d'accéder à la caméra: ${errorMessage}`);
    }
  };

  const handleCapturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);

        canvasRef.current.toBlob(blob => {
          if (blob) {
            const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
            onFileSelect(file);
            handleCloseCamera();
          }
        }, 'image/jpeg');
      }
    }
  };

  const handleCloseCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  return (
    <div className="upload-container">
      <div className="upload-buttons">
        <button type="button" className="upload-btn" onClick={() => fileInputRef.current?.click()}>
          Choisir une photo
        </button>
        <button type="button" className="upload-btn" onClick={handleStartCamera}>
          📷 Prendre une photo
        </button>
      </div>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {isCameraActive && (
        <div className="camera-modal">
          {cameraError ? (
            <div className="camera-error">
              <p>{cameraError}</p>
              <button type="button" className="camera-btn camera-close" onClick={handleCloseCamera}>
                Fermer
              </button>
            </div>
          ) : (
            <div className="camera-container">
              <video ref={videoRef} autoPlay playsInline muted className="camera-video" />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              <div className="camera-controls">
                <button
                  type="button"
                  className="camera-btn camera-capture"
                  onClick={handleCapturePhoto}
                >
                  Capturer
                </button>
                <button
                  type="button"
                  className="camera-btn camera-close"
                  onClick={handleCloseCamera}
                >
                  Fermer
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {previewUrl && (
        <div className="upload-preview">
          <img src={previewUrl} alt="Aperçu" />
        </div>
      )}
    </div>
  );
};

export default Upload;
