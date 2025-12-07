// src/config/useAuth.tsx
import { useState, useEffect } from 'preact/hooks';
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "./firebase";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This listener watches for any changes in the user's authentication state
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return { user, loading };
};
