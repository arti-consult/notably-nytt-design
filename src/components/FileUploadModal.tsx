import { useState } from 'react';
import { X, Upload, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
}

// Simple audio file validation for demo
const validateAudioFile = (file: File): { isValid: boolean; error?: string } => {
  const maxSize = 500 * 1024 * 1024; // 500MB
  const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/webm', 'audio/ogg', 'audio/m4a', 'audio/x-m4a'];

  if (file.size > maxSize) {
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      isValid: false,
      error: `Filen er for stor (${fileSizeMB} MB). Prøv å komprimere filen eller del den opp i mindre deler. Maksimalt 500 MB.`
    };
  }

  if (!allowedTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|webm|ogg|m4a)$/i)) {
    return {
      isValid: false,
      error: `Filtypen "${file.name.split('.').pop()?.toUpperCase()}" støttes ikke. Vennligst velg en av: MP3, WAV, WebM, OGG, M4A`
    };
  }

  return { isValid: true };
};

export default function FileUploadModal({
  isOpen,
  onClose,
  onUploadComplete
}: FileUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  if (!isOpen) return null;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateAudioFile(file);
    if (!validation.isValid) {
      setError(validation.error || 'Ugyldig fil');
      return;
    }

    setSelectedFile(file);
    setError(null);
    // Sett standard tittel basert på filnavn, fjern extension
    setTitle(file.name.replace(/\.[^/.]+$/, ''));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (isUploading) return;

    const files = Array.from(e.dataTransfer.files);
    const audioFile = files.find(f =>
      f.type.startsWith('audio/') ||
      f.name.match(/\.(mp3|wav|webm|ogg|m4a)$/i)
    );

    if (audioFile) {
      const validation = validateAudioFile(audioFile);
      if (validation.isValid) {
        setSelectedFile(audioFile);
        setTitle(audioFile.name.replace(/\.[^/.]+$/, ''));
        setError(null);
      } else {
        setError(validation.error || 'Ugyldig fil');
      }
    } else {
      setError('Vennligst dra inn en lydfil');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Vennligst velg en lydfil først');
      return;
    }

    if (!title.trim()) {
      setError('Vennligst gi opptaket en tittel for å gjøre det lett å finne igjen senere');
      return;
    }

    // Demo mode - simulate upload with progress
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    // Simulate progressive upload
    const totalSteps = 100;
    const fileSizeMB = selectedFile.size / (1024 * 1024);
    // Longer delay for larger files (realistic simulation)
    const totalDuration = Math.min(3000 + (fileSizeMB * 100), 8000);
    const stepDuration = totalDuration / totalSteps;

    for (let i = 0; i <= totalSteps; i++) {
      await new Promise(resolve => setTimeout(resolve, stepDuration));
      setUploadProgress(i);
    }

    console.log('Demo: File would be uploaded', {
      fileName: selectedFile.name,
      fileSize: selectedFile.size,
      title: title
    });

    setIsUploading(false);
    setUploadProgress(0);
    onUploadComplete();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md border border-gray-200">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Last opp lydopptak</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
              disabled={isUploading}
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Fil velger med drag & drop */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Velg lydfil
              </label>
              <label
                onDragEnter={handleDragEnter}
                onDragOver={handleDrag}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  "block w-full border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all",
                  isDragging
                    ? "border-[#2C64E3] bg-[#F0F5FF] scale-105"
                    : selectedFile
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400",
                  isUploading && "opacity-50 cursor-not-allowed"
                )}
              >
                <input
                  type="file"
                  className="hidden"
                  accept="audio/*"
                  onChange={handleFileSelect}
                  disabled={isUploading}
                />
                <Upload className={cn(
                  "h-10 w-10 mx-auto mb-3 transition-all",
                  isDragging && "scale-110 text-[#2C64E3]",
                  selectedFile && !isDragging && "text-blue-500",
                  !selectedFile && !isDragging && "text-gray-400"
                )} />
                {isDragging ? (
                  <span className="text-sm font-medium text-[#2C64E3]">
                    Slipp filen her
                  </span>
                ) : selectedFile ? (
                  <div>
                    <span className="text-sm font-medium text-blue-600 block">
                      {selectedFile.name}
                    </span>
                    <span className="text-xs text-gray-500 mt-1 block">
                      {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="text-sm font-medium text-gray-700 block mb-1">
                      Dra og slipp lydfil her
                    </span>
                    <span className="text-xs text-gray-500">
                      eller klikk for å velge
                    </span>
                  </div>
                )}
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Støttede formater: MP3, WAV, WebM, OGG, M4A (maks 500MB)
              </p>
            </div>

            {/* Tittel */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Tittel
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Gi opptaket en tittel"
                disabled={isUploading}
              />
            </div>

            {/* Progress Bar */}
            {isUploading && (
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Laster opp...</span>
                  <span className="font-medium text-[#2C64E3]">{uploadProgress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2C64E3] transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                {selectedFile && (
                  <p className="text-xs text-gray-500">
                    Filstørrelse: {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isUploading}
            >
              Avbryt
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || !title.trim() || isUploading}
              className={cn(
                "px-4 py-2 rounded-lg text-white transition-colors",
                isUploading || !selectedFile || !title.trim()
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              )}
            >
              {isUploading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Laster opp...
                </div>
              ) : (
                'Last opp'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
