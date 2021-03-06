import { initializeApp } from 'firebase/app';
import { getDatabase, ref } from 'firebase/database';
import { getAuth, signInWithPopup, GoogleAuthProvider, browserLocalPersistence, setPersistence, NextOrObserver, User } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBRP8LjBouuluROgvHdYqDNnlF6pf69opA',
  authDomain: 'bwa-contacts.firebaseapp.com',
  databaseURL: 'https://bwa-contacts-default-rtdb.firebaseio.com',
  projectId: 'bwa-contacts',
  storageBucket: 'bwa-contacts.appspot.com',
  messagingSenderId: '991159049195',
  appId: '1:991159049195:web:135e0690315740cb7ed7ae',
  measurementId: 'G-G2RG6BNCLR',
  clientId: '991159049195-adtotml6212suds3qp8j4lhe6f4ahoqg.apps.googleusercontent.com',
  scopes: ['https://www.googleapis.com/auth/contacts.readonly'],
};

// Initialize Firebase
const fbApp = initializeApp(firebaseConfig);
export const db = getDatabase(fbApp);

let accessToken = undefined as string | undefined;

export function getContactsRef(uid: string) {
  return ref(db, `${uid}/contacts`);
}

export function getTimestampRef(uid: string) {
  return ref(db, `${uid}/last_updated`);
}

export function getThemeRef(uid: string) {
  return ref(db, `${uid}/prefer_theme`);
}

// Initialize Firebase Auth
const provider = new GoogleAuthProvider();
firebaseConfig.scopes.forEach((scope) => provider.addScope(scope));

const auth = getAuth();
setPersistence(auth, browserLocalPersistence);

export async function signIn() {
  try {
    const res = await signInWithPopup(auth, provider);
    accessToken = GoogleAuthProvider.credentialFromResult(res)?.accessToken;
    // Initialize Google API client
  } catch (err) {
    return null;
  }
}

export function onAuthStateChange(callback: NextOrObserver<User | null>) {
  auth.onAuthStateChanged(callback);
}

// Using the REST API because using Firebase Auth with Google APIs is either impossible or just terribly documented
export async function getContacts() {
  const contacts = [] as any[];

  if (!accessToken) {
    await signIn();

    // If user does not sign in, return empty array
    if (!accessToken) {
      return contacts;
    }
  }

  let nextPageToken = undefined;
  do {
    let res: any = await fetch(
      `https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses,phoneNumbers${
        nextPageToken ? '&pageToken=' + nextPageToken : ''
      }`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    let json = await res.json();
    contacts.push(...json.connections);

    nextPageToken = json.nextPageToken;
  } while (nextPageToken);

  return contacts;
}
