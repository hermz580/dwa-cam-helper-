// Hands-free Clinical Audio Narration Utility using Web Speech API

let currentUtterance: SpeechSynthesisUtterance | null = null;

export const speakClinicalText = (text: string, onEnd?: () => void, onError?: () => void): boolean => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    return false;
  }

  // Cancel any ongoing speech
  stopSpeech();

  try {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.96; // Measured, educated clinical pacing
    utterance.pitch = 1.0;
    
    // Pick an English natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(v => (v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Premium'))))
      || voices.find(v => v.lang.startsWith('en'));
      
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onend = () => {
      currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      currentUtterance = null;
      if (onError) onError();
    };

    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.warn('Failed to initiate speech:', err);
    return false;
  }
};

export const stopSpeech = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
};

export const isSpeaking = (): boolean => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    return window.speechSynthesis.speaking;
  }
  return false;
};
