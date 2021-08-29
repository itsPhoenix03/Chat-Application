import { useCallback, useState } from 'react';

export function useModelState(defalutValue = false) {
  const [isOpen, setIsOpen] = useState(defalutValue);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return { isOpen, open, close };
}
