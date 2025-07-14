import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: 'student' | 'faculty';
  createdAt: Date;
  studentId?: string;
  facultyId?: string;
}

export const signUp = async (
  email: string, 
  password: string, 
  name: string, 
  role: 'student' | 'faculty',
  id?: string
) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  const userProfile: UserProfile = {
    uid: user.uid,
    email: user.email!,
    name,
    role,
    createdAt: new Date(),
    ...(role === 'student' ? { studentId: id } : { facultyId: id })
  };
  
  await setDoc(doc(db, 'users', user.uid), userProfile);
  return userProfile;
};

export const signIn = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const signOut = () => firebaseSignOut(auth);

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  }
  return null;
};