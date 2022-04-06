import { initializeApp } from 'firebase/app';
import { getDatabase, ref } from 'firebase/database';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBRP8LjBouuluROgvHdYqDNnlF6pf69opA',
  authDomain: 'bwa-contacts.firebaseapp.com',
  databaseURL: 'https://bwa-contacts-default-rtdb.firebaseio.com',
  projectId: 'bwa-contacts',
  storageBucket: 'bwa-contacts.appspot.com',
  messagingSenderId: '991159049195',
  appId: '1:991159049195:web:135e0690315740cb7ed7ae',
  measurementId: 'G-G2RG6BNCLR',
};

// Initialize Firebase
const fbApp = initializeApp(firebaseConfig);
export const db = getDatabase(fbApp);

export function getContactsRef(uid: string) {
  return ref(db, `${uid}/contacts`)
}

export function getTimestampRef(uid: string) {
  return ref(db, `${uid}/last_updated`)
}

// Initialize Firebase Auth
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
const auth = getAuth();

export async function signIn() {
  try {
    const res = await signInWithPopup(auth, provider);

    return { user: res.user, token: GoogleAuthProvider.credentialFromResult(res)?.accessToken };
  } catch (err) {
    return null;
  }
}
