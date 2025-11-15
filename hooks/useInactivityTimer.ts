import { useEffect, useRef, useCallback } from 'react';

export function useInactivityTimer(onInactive: () => void, timeout: number) {
  const timeoutRef = useRef<number | null>(null);
  const lastActivityTimestamp = useRef<number>(Date.now());

  // Memoize the callback to avoid re-creating it on every render.
  const onInactiveCallback = useCallback(() => {
    onInactive();
  }, [onInactive]);

  // Resets the inactivity timer. Called on user activity.
  const resetTimer = useCallback(() => {
    lastActivityTimestamp.current = Date.now();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Only set a new timer if a timeout is configured (is > 0).
    if (timeout > 0) { 
      timeoutRef.current = window.setTimeout(onInactiveCallback, timeout);
    }
  }, [timeout, onInactiveCallback]);
  
  // Handles the browser tab becoming visible again.
  const handleVisibilityChange = useCallback(() => {
    // If the tab is now visible and a timeout is set...
    if (document.visibilityState === 'visible' && timeout > 0) {
      // Check if the time since last activity is greater than the allowed timeout.
      // This handles cases where the computer was asleep or the tab was backgrounded.
      if (Date.now() - lastActivityTimestamp.current > timeout) {
        onInactiveCallback();
      } else {
        // If not enough time has passed, just reset the timer to be safe.
        resetTimer();
      }
    }
  }, [timeout, onInactiveCallback, resetTimer]);

  useEffect(() => {
    const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
    
    // Add listeners for user activity and page visibility.
    document.addEventListener('visibilitychange', handleVisibilityChange);
    events.forEach(event => document.addEventListener(event, resetTimer, { passive: true }));
    
    // Start the timer when the hook mounts.
    resetTimer();

    // Cleanup listeners and the timer when the component unmounts or dependencies change.
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      events.forEach(event => document.removeEventListener(event, resetTimer));
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [resetTimer, handleVisibilityChange]);
}
