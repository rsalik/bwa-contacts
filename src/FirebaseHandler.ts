import { initializeApp } from 'firebase/app';
import { getDatabase, ref } from 'firebase/database';

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

export const contactsRef = ref(db, 'contacts');
export const timestampRef = ref(db, 'last_updated');
