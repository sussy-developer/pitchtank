import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithPopup, 
  GoogleAuthProvider,
  OAuthProvider
} from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentUserUid = useRef(null);

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  function googleSignIn() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }

  function linkedInSignIn() {
    const provider = new OAuthProvider('linkedin.com');
    return signInWithPopup(auth, provider);
  }

  useEffect(() => {
    let unsubscribeSnapshot = null;
    let safetyTimeout = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      currentUserUid.current = firebaseUser?.uid || null;
      setUser(firebaseUser);
      
      // Clear any previous safety timeout
      if (safetyTimeout) clearTimeout(safetyTimeout);

      if (firebaseUser) {
        // Safety: if Firestore doesn't respond in 3s, stop waiting
        safetyTimeout = setTimeout(() => {
          setLoading(false);
        }, 3000);

        const userRef = doc(db, 'users', firebaseUser.uid);
        unsubscribeSnapshot = onSnapshot(userRef, (docSnap) => {
          clearTimeout(safetyTimeout);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            setUserData(null);
          }
          setLoading(false);
        }, (error) => {
          clearTimeout(safetyTimeout);
          console.warn("Firestore unavailable:", error.message);
          setLoading(false);
        });
      } else {
        setUserData(null);
        setLoading(false);
        if (unsubscribeSnapshot) {
          unsubscribeSnapshot();
        }
      }
    });

    return () => {
      unsubscribeAuth();
      if (safetyTimeout) clearTimeout(safetyTimeout);
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
      }
    };
  }, []);

  const value = {
    user,
    userData,
    signup,
    login,
    logout,
    googleSignIn,
    linkedInSignIn,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
