import { useState, useEffect } from 'react';
import {
  Mic,
  X,
  Activity,
  Clock,
  AlertCircle,
  UserPlus,
  Trash2
} from 'lucide-react';
import { useRecording } from '@/hooks/useRecording';
import { useFolders } from '@/contexts/FolderContext';
import FolderSelect from '@/components/FolderSelect';
import { cn } from '@/lib/utils';
import AudioVisualizer from './AudioVisualizer';

interface RecordingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

interface Participant {
  id: string;
  name: string;
  email: string;
}

export default function RecordingModal({ isOpen, onClose, onComplete }: RecordingModalProps) {
  const { folders } = useFolders();
  const {
    isRecording,
    duration,
    error: recordingError,
    audioBlob,
    isProcessing,
    startRecording,
    stopRecording,
    resetRecording
  } = useRecording();

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [recordingTitle, setRecordingTitle] = useState('');
  const [titleError, setTitleError] = useState<string | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [newParticipant, setNewParticipant] = useState({ name: '', email: '' });
  const [participantError, setParticipantError] = useState<string | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      if (isRecording) {
        stopRecording();
      }
      setIsSaving(false);
      setSaveError(null);
      setRecordingTitle('');
      setTitleError(null);
      setParticipants([]);
      setNewParticipant({ name: '', email: '' });
      setParticipantError(null);
      setSelectedFolder(null);
      setLocalError(null);
      resetRecording();
    }
  }, [isOpen, stopRecording, isRecording, resetRecording]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddParticipant = () => {
    setParticipantError(null);

    const { name, email } = newParticipant;
    if (!name.trim()) {
      setParticipantError('Navn er påkrevd');
      return;
    }

    if (email && !validateEmail(email)) {
      setParticipantError('Ugyldig e-postadresse');
      return;
    }

    setParticipants(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        name: name.trim(),
        email: email.trim()
      }
    ]);
    setNewParticipant({ name: '', email: '' });
  };

  const handleRemoveParticipant = (id: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
  };

  const handleStartRecording = async () => {
    if (!recordingTitle.trim()) {
      setTitleError('Vennligst gi opptaket et navn');
      return;
    }
    setTitleError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      setAudioStream(stream);
      startRecording(stream);
    } catch (error) {
      console.error('Error starting recording:', error);
      setLocalError('Kunne ikke starte opptak. Sjekk mikrofontilgang.');
    }
  };

  const handleStopRecording = async () => {
    try {
      stopRecording();
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
        setAudioStream(null);
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
      setSaveError('Kunne ikke stoppe opptaket');
    }
  };

  const handleSaveRecording = async () => {
    if (!audioBlob) {
      setSaveError('Mangler nødvendig data for å lagre opptaket');
      return;
    }

    // Demo mode - simulate saving
    setIsSaving(true);
    setSaveError(null);

    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('Demo: Recording would be saved', {
      title: recordingTitle,
      participants: participants.length,
      folder: selectedFolder,
      blobSize: audioBlob.size
    });

    setIsSaving(false);
    if (onComplete) {
      onComplete();
    }
    onClose();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  const displayError = recordingError || saveError || localError;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-hidden">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col border border-gray-200">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={cn(
                "p-2 rounded-full",
                isRecording ? 'bg-red-100' : 'bg-gray-100'
              )}>
                <Mic className={cn(
                  "h-5 w-5",
                  isRecording ? 'text-red-600' : 'text-gray-600'
                )} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {isRecording ? 'Opptak pågår' : 'Klar til opptak'}
                </h3>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{formatDuration(duration)}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
              disabled={isRecording || isSaving}
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {displayError && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{displayError}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto flex-1">
          {!isRecording && !audioBlob && (
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="recordingTitle" className="block text-sm font-medium text-gray-700 mb-2">
                  Navn på opptak
                </label>
                <div className="relative">
                  <input
                    id="recordingTitle"
                    type="text"
                    value={recordingTitle}
                    onChange={(e) => {
                      setRecordingTitle(e.target.value);
                      setTitleError(null);
                    }}
                    placeholder="F.eks. Ukentlig møte"
                    className={cn(
                      "w-full rounded-lg border px-4 py-2 bg-white text-gray-900 placeholder-gray-400 focus:border-violet-500 focus:ring-violet-500",
                      titleError ? "border-red-300" : "border-gray-300"
                    )}
                    disabled={isRecording}
                  />
                  {titleError && (
                    <div className="absolute right-0 top-0 h-full flex items-center pr-3">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {titleError && (
                  <p className="mt-2 text-sm text-red-600">{titleError}</p>
                )}
              </div>

              {/* Folder selector */}
              {folders.length > 0 && (
                <div>
                  <FolderSelect
                    currentFolderId={selectedFolder}
                    onFolderChange={async (folderId) => setSelectedFolder(folderId)}
                    disabled={isRecording || isSaving}
                  />
                </div>
              )}

              {/* Participants */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Legg til deltakere (valgfritt)
                </label>

                <div className="space-y-3 mb-4">
                  {participants.map(participant => (
                    <div
                      key={participant.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-full bg-violet-100">
                          <UserPlus className="h-4 w-4 text-violet-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-900">{participant.name}</p>
                          {participant.email && (
                            <p className="text-sm text-gray-600">{participant.email}</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveParticipant(participant.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={newParticipant.name}
                        onChange={(e) => setNewParticipant(prev => ({
                          ...prev,
                          name: e.target.value
                        }))}
                        placeholder="Navn"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-violet-500 focus:ring-violet-500"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="email"
                        value={newParticipant.email}
                        onChange={(e) => setNewParticipant(prev => ({
                          ...prev,
                          email: e.target.value
                        }))}
                        placeholder="E-post (valgfritt)"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-violet-500 focus:ring-violet-500"
                      />
                    </div>
                    <button
                      onClick={handleAddParticipant}
                      className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                    >
                      <UserPlus className="h-5 w-5" />
                    </button>
                  </div>
                  {participantError && (
                    <p className="text-sm text-red-600">{participantError}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col items-center justify-center mt-6">
            {isRecording ? (
              <div className="flex flex-col items-center">
                {audioStream && <AudioVisualizer stream={audioStream} />}
                <p className="text-sm text-gray-500 mt-2">{recordingTitle}</p>
              </div>
            ) : isProcessing || isSaving ? (
              <div className="flex flex-col items-center">
                <Activity className="h-12 w-12 text-violet-600 animate-pulse mb-4" />
                <p className="text-gray-600">
                  {isProcessing ? 'Behandler opptak...' : 'Lagrer opptak...'}
                </p>
              </div>
            ) : audioBlob ? (
              <div className="flex flex-col items-center">
                <p className="text-gray-600 mb-4">Opptak fullført</p>
                <button
                  onClick={handleSaveRecording}
                  disabled={isSaving}
                  className="button-primary px-8 py-4 text-lg flex items-center"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                      Lagrer...
                    </>
                  ) : (
                    'Lagre opptak'
                  )}
                </button>
              </div>
            ) : (
              <button
                onClick={handleStartRecording}
                className="button-primary px-8 py-4 text-lg flex items-center"
              >
                <Mic className="h-6 w-6 mr-2" />
                Start opptak
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            {isRecording && (
              <button
                onClick={handleStopRecording}
                className="button-primary bg-red-600 hover:bg-red-700"
              >
                Stopp opptak
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
