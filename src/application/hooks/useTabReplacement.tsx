import { RefObject, useEffect } from 'react';

const useTabReplacement = (textareaRef: RefObject<HTMLTextAreaElement>, loading: boolean) => {
  useEffect(() => {
    const handleTabPress = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        event.preventDefault();
        const textarea = textareaRef.current;
        if (textarea) {
          const { selectionStart, selectionEnd, value } = textarea;
          const newValue = `${value.substring(0, selectionStart)
          }    ${value.substring(selectionEnd)}`;
          textarea.value = newValue;
          textarea.setSelectionRange(selectionStart + 4, selectionStart + 4);
        }
      }
    };

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener('keydown', handleTabPress);
    }

    return () => {
      if (textarea) {
        textarea.removeEventListener('keydown', handleTabPress);
      }
    };
  }, [textareaRef, loading]);
};

export default useTabReplacement;
