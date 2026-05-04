import { useCallback, useState, useSyncExternalStore } from 'react';

export function useWidth() {
  const [element, setElement] = useState<HTMLElement | null>(null);

  const subscribe = useCallback(
    (callback: () => void) => {
      if (!element) return () => {};
      const observer = new ResizeObserver(callback);
      observer.observe(element);
      return () => observer.disconnect();
    },
    [element]
  );

  const getSnapshot = useCallback(() => {
    return element?.clientWidth ?? 0;
  }, [element]);

  const width = useSyncExternalStore(subscribe, getSnapshot, () => 0);

  return [setElement, width] as const;
}
