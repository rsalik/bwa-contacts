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
  clientId: '991159049195-adtotml6212suds3qp8j4lhe6f4ahoqg.apps.googleusercontent.com',
  scopes: ['https://www.googleapis.com/auth/contacts.readonly'],
};

// Initialize Firebase
const fbApp = initializeApp(firebaseConfig);
export const db = getDatabase(fbApp);

export function getContactsRef(uid: string) {
  return ref(db, `${uid}/contacts`);
}

export function getTimestampRef(uid: string) {
  return ref(db, `${uid}/last_updated`);
}

// Initialize Firebase Auth
const provider = new GoogleAuthProvider();
firebaseConfig.scopes.forEach((scope) => provider.addScope(scope));

const auth = getAuth();

export async function signIn() {
  try {
    const res = await signInWithPopup(auth, provider);

    console.log(await getContacts(GoogleAuthProvider.credentialFromResult(res)?.accessToken || ''));
    return { user: res.user, token: GoogleAuthProvider.credentialFromResult(res)?.accessToken };

    // Initialize Google API client
  } catch (err) {
    return null;
  }
}

// Using the REST API because using Firebase Auth with Google APIs is either impossible or just terribly documented
export async function getContacts(accessToken: string) {
  const contacts = [] as any[];

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
