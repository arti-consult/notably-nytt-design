import { useState } from 'react';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

type Language = 'NO' | 'EN';

export default function LanguageSelector() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('NO');

  return (
    <div className="flex items-center space-x-2">
      <Globe className="h-4 w-4 text-gray-500" />
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setSelectedLanguage('NO')}
          className={cn(
            'px-3 py-1 text-sm font-medium rounded-md transition-colors',
            selectedLanguage === 'NO'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          )}
        >
          NO
        </button>
        <button
          onClick={() => setSelectedLanguage('EN')}
          className={cn(
            'px-3 py-1 text-sm font-medium rounded-md transition-colors',
            selectedLanguage === 'EN'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          )}
        >
          EN
        </button>
      </div>
    </div>
  );
}
