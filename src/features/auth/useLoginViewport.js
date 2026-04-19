import { useEffect, useRef, useState } from 'react';

export function useLoginViewport({ enabled }) {
  const [focusedField, setFocusedField] = useState('');
  const blurTimeoutRef = useRef(null);

  useEffect(
    () => () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (!enabled) {
      setFocusedField('');
    }
  }, [enabled]);

  const handleFieldFocus = (field) => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }

    setFocusedField(field);
  };

  const handleFieldBlur = () => {
    blurTimeoutRef.current = window.setTimeout(() => {
      setFocusedField('');
      blurTimeoutRef.current = null;
    }, 80);
  };

  return {
    focusedField,
    handleFieldBlur,
    handleFieldFocus,
  };
}
