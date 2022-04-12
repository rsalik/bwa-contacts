import React, { useEffect } from 'react';
import AddContact from './components/AddContact';
import Contacts from './components/Contacts';
import ContactStats from './components/ContactStats';
import { DarkModeRounded, LightModeRounded } from '@mui/icons-material';
import { getContacts, getContactsRef, getThemeRef, getTimestampRef, onAuthStateChange } from './FirebaseHandler';
import { onValue, set, get } from '@firebase/database';
import './styles/style.scss';
import SignIn from './components/SignIn';
import SyncContactsPopup from './components/SyncContactsPopup';

function App() {
  const [contacts, setContacts] = React.useState([] as any[]);
  const [theme, setTheme] = React.useState('default');
  const [timestamp, setTimestamp] = React.useState(Date.now());
  const [user, setUser] = React.useState(undefined as any);
  const [showSyncContactsPopup, setShowSyncContactsPopup] = React.useState(false);

  // Firebase Refs
  const contactsRef = React.useRef(undefined as any);
  const timestampRef = React.useRef(undefined as any);
  const themeRef = React.useRef(undefined as any);

  // Create authStateChange hook
  useEffect(() => {
    onAuthStateChange((user) => {
      console.log(user);

      if (user) {
        setUser(user);
      } else {
        setUser(undefined);
      }
    });
  }, []);

  useEffect(() => {
    if (user) {
      // Stop listening to current refs, if they exist
      contactsRef.current?.off?.();
      timestampRef.current?.off?.();
      themeRef.current?.off?.();

      // Update Refs on User change
      contactsRef.current = getContactsRef(user.uid);
      timestampRef.current = getTimestampRef(user.uid);
      themeRef.current = getThemeRef(user.uid);

      // Set up Firebase Realtime Database Hooks
      onValue(contactsRef.current, (snapshot) => {
        if (!snapshot.val()) setContacts([]);
        else setContacts([...snapshot.val()].filter((c) => c).map((c, i) => ({ ...c, id: i })));
      });

      onValue(timestampRef.current, (snapshot) => {
        setTimestamp(snapshot.val());
      });

      // Theme ref once
      get(themeRef.current).then((snapshot) => {
        if (snapshot.val()) setTheme(snapshot.val());
      });
    } else {
      contactsRef.current = undefined;
      timestampRef.current = undefined;
    }
  }, [user]);

  // Update Themes
  useEffect(() => {
    const body = document.querySelector('body');

    if (themeRef.current) set(themeRef.current, theme);

    if (body) {
      body.classList.forEach((c) => body.classList.remove(c));
      body.classList.add('theme--' + theme);
    }
  }, [theme]);

  function addContact(contact: any) {
    set(contactsRef.current, [...contacts, contact]);
    set(timestampRef.current, Date.now());
  }

  function deleteContact(id: number) {
    set(
      contactsRef.current,
      contacts.filter((c) => c.id !== id)
    );
    set(timestampRef.current, Date.now());
  }

  function deleteAllContacts() {
    setContacts([]); // Deleting all contacts will not trigger onValue
    set(contactsRef.current, []);
    set(timestampRef.current, Date.now());
  }

  async function syncContacts() {
    let contacts = await getContacts();

    setShowSyncContactsPopup(false);

    if (!contacts.length) return;

    deleteAllContacts();

    set(
      contactsRef.current,
      contacts
        .map((c) => {
          return {
            firstName: c.names?.[0].givenName || '',
            lastName: c.names?.[0].familyName || '',
            email: c.emailsAddresses?.[0].value || '',
            phone: c.phoneNumbers?.[0].value || '',
          };
        })
        .sort((a, b) => {
          return a.firstName.localeCompare(b.firstName);
        })
    );
    set(timestampRef.current, Date.now());
  }

  function onStartSyncContacts() {
    setShowSyncContactsPopup(true);
  }

  return (
    <div className={`App theme--${theme}`}>
      <div className="header-title">
        Firebase Contacts
        <span className="theme">
          {theme === 'default' ? (
            <DarkModeRounded fontSize="large" onClick={() => setTheme('dark')} />
          ) : (
            <LightModeRounded fontSize="large" onClick={() => setTheme('default')} />
          )}
        </span>
      </div>
      {showSyncContactsPopup && <SyncContactsPopup onClose={() => setShowSyncContactsPopup(false)} onSync={syncContacts} />}
      {!user ? (
        <SignIn />
      ) : (
        <React.Fragment>
          <AddContact onAdd={addContact} />
          <ContactStats
            data={contacts}
            lastUpdated={timestamp}
            onDeleteAll={deleteAllContacts}
            onSyncContacts={onStartSyncContacts}
            user={user}
          />
          <Contacts data={contacts} onDelete={deleteContact} />
        </React.Fragment>
      )}
    </div>
  );
}

export default App;
