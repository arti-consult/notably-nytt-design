import { useState } from 'react';
import { X, FileText, FileSpreadsheet, Music, Download, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasSummary: boolean;
  hasTranscription: boolean;
  hasAudio?: boolean;
  meeting: {
    title: string;
    date: string;
    duration: string;
    file_url?: string;
    summary?: {
      text: string;
      topics?: string[];
      actionItems?: string[];
    };
    transcription?: Array<{
      timestamp: string;
      text: string;
    }>;
  };
}

type DownloadType = 'summary-pdf' | 'summary-docx' | 'transcription-pdf' | 'transcription-docx' | 'transcription-csv' | 'audio-mp3';

export default function DownloadModal({
  isOpen,
  onClose,
  hasSummary,
  hasTranscription,
  hasAudio = true, // Default til true for demo
  meeting
}: DownloadModalProps) {
  const [loadingType, setLoadingType] = useState<DownloadType | null>(null);
  const [downloadedType, setDownloadedType] = useState<DownloadType | null>(null);

  if (!isOpen) return null;

  const handleDownload = async (type: DownloadType) => {
    setLoadingType(type);
    setDownloadedType(null);

    // Demo mode - simulate download
    await new Promise(resolve => setTimeout(resolve, 800));

    console.log('Demo: Would download', {
      type,
      meeting: meeting.title
    });

    setLoadingType(null);
    setDownloadedType(type);

    // Reset success state after 2 seconds
    setTimeout(() => setDownloadedType(null), 2000);
  };

  const DownloadButton = ({
    type,
    label,
    variant = 'primary'
  }: {
    type: DownloadType;
    label: string;
    variant?: 'primary' | 'secondary';
  }) => {
    const isLoading = loadingType === type;
    const isDownloaded = downloadedType === type;

    return (
      <button
        onClick={() => handleDownload(type)}
        disabled={loadingType !== null}
        className={cn(
          "px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
          "bg-[#2C64E3] hover:bg-[#1F49C6] text-white",
          loadingType !== null && loadingType !== type && "opacity-50 cursor-not-allowed",
          isDownloaded && "bg-emerald-500 hover:bg-emerald-500"
        )}
      >
        {isLoading ? (
          <>
            <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Laster...
          </>
        ) : isDownloaded ? (
          <>
            <CheckCircle className="h-4 w-4" />
            Lastet ned!
          </>
        ) : (
          <>
            <Download className="h-4 w-4" />
            {label}
          </>
        )}
      </button>
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.3 }}
          className="bg-white rounded-2xl w-full max-w-lg shadow-2xl"
        >
          {/* Header */}
          <div className="p-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Last ned</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Velg innhold og format
                </p>
              </div>
              <button
                onClick={onClose}
                disabled={loadingType !== null}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content Cards */}
          <div className="p-5 space-y-4">
            {/* Sammendrag Card */}
            {hasSummary && (
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-white rounded-xl shadow-sm">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900">Sammendrag</h4>
                    <p className="text-sm text-gray-600 mt-0.5">
                      Oppsummering med hovedpunkter og aksjonspunkter
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <DownloadButton type="summary-pdf" label="PDF" variant="primary" />
                      <DownloadButton type="summary-docx" label="DOCX" variant="secondary" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Transkripsjon Card */}
            {hasTranscription && (
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-white rounded-xl shadow-sm">
                    <FileSpreadsheet className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900">Transkripsjon</h4>
                    <p className="text-sm text-gray-600 mt-0.5">
                      Fullstendig tekst med tidsstempler
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <DownloadButton type="transcription-pdf" label="PDF" variant="primary" />
                      <DownloadButton type="transcription-docx" label="DOCX" variant="secondary" />
                      <DownloadButton type="transcription-csv" label="CSV" variant="secondary" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Lydopptak Card */}
            {hasAudio && (
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-white rounded-xl shadow-sm">
                    <Music className="h-6 w-6 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900">Lydopptak</h4>
                    <p className="text-sm text-gray-600 mt-0.5">
                      Original lydfil fra møtet
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <DownloadButton type="audio-mp3" label="Last ned lydfil" variant="primary" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Demo notice */}
            <p className="text-xs text-center text-gray-400 pt-2">
              Demo-modus: Nedlasting simuleres
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
