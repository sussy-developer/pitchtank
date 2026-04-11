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

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      // Re-enable loading buffer exactly when transitioning from logged-out to logged-in
      if (firebaseUser && currentUserUid.current !== firebaseUser.uid) {
        setLoading(true);
      }
      
      currentUserUid.current = firebaseUser?.uid || null;
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Fetch or listen to user document
        const userRef = doc(db, 'users', firebaseUser.uid);
        unsubscribeSnapshot = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            setUserData(null);
          }
          setLoading(false);
        }, (error) => {
          console.error("Error fetching user data:", error);
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
