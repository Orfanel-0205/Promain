import { useCallback } from 'react';
import * as Speech from 'expo-speech';

export function useTts() {
  const speak = useCallback((text: string, options?: { language?: string; rate?: number }) => {
    Speech.speak(text, {
      language: options?.language ?? 'fil-PH',
      rate: options?.rate ?? 0.9,
    });
  }, []);

  const stop = useCallback(() => {
    Speech.stop();
  }, []);

  return { speak, stop };
}
