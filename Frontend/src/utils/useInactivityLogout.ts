import { useEffect, useRef } from "preact/hooks";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "../config/firebase";

const INACTIVITY_TIMEOUT_MS = 300 * 1000; // 1 minute

const useInactivityLogout = () => {
  // Use ReturnType<typeof setTimeout> for better TS safety
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const user = useRef<User | null>(null);

  const resetTimer = () => {
    if (timeoutId.current !== null) {
      clearTimeout(timeoutId.current);
    }
    if (user.current) {
      timeoutId.current = setTimeout(() => {
        console.log("⏳ User inactive for 1 minute. Logging out...");
        signOut(auth).catch((err) => console.error("Logout error:", err));
      }, INACTIVITY_TIMEOUT_MS);
    }
  };

  useEffect(() => {
    const authUnsubscribe = onAuthStateChanged(auth, (authUser) => {
      user.current = authUser;
      if (authUser) {
        resetTimer();

        // Add listeners once
        document.addEventListener("mousemove", resetTimer);
        document.addEventListener("keypress", resetTimer);
        document.addEventListener("touchstart", resetTimer);
        document.addEventListener("click", resetTimer);
      } else {
        if (timeoutId.current !== null) {
          clearTimeout(timeoutId.current);
        }
        // Clean listeners when logged out
        document.removeEventListener("mousemove", resetTimer);
        document.removeEventListener("keypress", resetTimer);
        document.removeEventListener("touchstart", resetTimer);
        document.removeEventListener("click", resetTimer);
      }
    });

    // Cleanup on unmount
    return () => {
      authUnsubscribe();
      if (timeoutId.current !== null) {
        clearTimeout(timeoutId.current);
      }
      document.removeEventListener("mousemove", resetTimer);
      document.removeEventListener("keypress", resetTimer);
      document.removeEventListener("touchstart", resetTimer);
      document.removeEventListener("click", resetTimer);
    };
  }, []);

  return null; // it's a hook, nothing to render
};

export default useInactivityLogout;
