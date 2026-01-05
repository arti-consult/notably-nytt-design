import { useEffect } from 'react';

type ShortcutHandler = (e: KeyboardEvent) => void;

interface Shortcuts {
  [key: string]: ShortcutHandler;
}

export function useKeyboardShortcuts(shortcuts: Shortcuts) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Build shortcut key string
      let key = '';

      if (e.metaKey || e.ctrlKey) {
        key += e.metaKey ? 'cmd+' : 'ctrl+';
      }
      if (e.shiftKey) {
        key += 'shift+';
      }
      if (e.altKey) {
        key += 'alt+';
      }

      // Add the actual key (lowercase)
      key += e.key.toLowerCase();

      // Execute handler if exists
      if (shortcuts[key]) {
        e.preventDefault();
        shortcuts[key](e);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}
