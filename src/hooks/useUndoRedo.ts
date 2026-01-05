import { useState, useCallback } from 'react';

export interface UndoAction {
  type: 'delete' | 'move' | 'tag' | 'rename';
  description: string;
  undo: () => void;
  redo: () => void;
}

export function useUndoRedo() {
  const [history, setHistory] = useState<UndoAction[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const addAction = useCallback((action: UndoAction) => {
    // Remove any redo history when adding a new action
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(action);
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  }, [history, currentIndex]);

  const undo = useCallback(() => {
    if (currentIndex < 0) return false;

    const action = history[currentIndex];
    action.undo();
    setCurrentIndex(currentIndex - 1);
    return true;
  }, [history, currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex >= history.length - 1) return false;

    const action = history[currentIndex + 1];
    action.redo();
    setCurrentIndex(currentIndex + 1);
    return true;
  }, [history, currentIndex]);

  const canUndo = currentIndex >= 0;
  const canRedo = currentIndex < history.length - 1;

  const clear = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
  }, []);

  return {
    addAction,
    undo,
    redo,
    canUndo,
    canRedo,
    clear,
    currentAction: currentIndex >= 0 ? history[currentIndex] : null
  };
}
