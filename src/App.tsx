import React, { useEffect } from 'react';
import AddContact from './components/AddContact';
import Contacts from './components/Contacts';
import ContactStats from './components/ContactStats';
import { DarkModeRounded, LightModeRounded } from '@mui/icons-material';
import { getContacts, getContactsRef, getTimestampRef } from './FirebaseHandler';
import { onValue, set } from '@firebase/database';
import './styles/style.scss';
import SignIn from './components/SignIn';
import SyncContactsPopup from './components/SyncContactsPopup';

function App() {
  const [contacts, setContacts] = React.useState([] as any[]);
  const [theme, setTheme] = React.useState('default');
  const [timestamp, setTimestamp] = React.useState(Date.now());
  const [userInfo, setUserInfo] = React.useState(undefined as any);
  const [showSyncContactsPopup, setShowSyncContactsPopup] = React.useState(false);

  // Firebase Refs
  const contactsRef = React.useRef(undefined as any);
  const timestampRef = React.useRef(undefined as any);

  useEffect(() => {
    if (userInfo) {
      // Stop listening to current refs, if they exist
      contactsRef.current?.off?.();
      timestampRef.current?.off?.();

      // Update Refs on User change
      contactsRef.current = getContactsRef(userInfo.user.uid);
      timestampRef.current = getTimestampRef(userInfo.user.uid);

      // Set up Firebase Realtime Database Hooks
      onValue(contactsRef.current, (snapshot) => {
        if (!snapshot.val()) setContacts([]);
        else setContacts([...snapshot.val()].filter((c) => c).map((c, i) => ({ ...c, id: i })));
      });

      onValue(timestampRef.current, (snapshot) => {
        setTimestamp(snapshot.val());
      });
    } else {
      contactsRef.current = undefined;
      timestampRef.current = undefined;
    }
  }, [userInfo]);

  // Update Themes
  useEffect(() => {
    const body = document.querySelector('body');

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
    let contacts = await getContacts(userInfo.token);

    deleteAllContacts();

    set(
      contactsRef.current,
      contacts.map((c) => {
        return {
          firstName: c.names?.[0].givenName || '',
          lastName: c.names?.[0].familyName || '',
          email: c.emailsAddresses?.[0].value || '',
          phone: c.phoneNumbers?.[0].value || '',
        };
      }).sort((a, b) => {
        return a.firstName.localeCompare(b.firstName);
      })
    );
    set(timestampRef.current, Date.now());

    setShowSyncContactsPopup(false);
  }

  function onStartSyncContacts() {
    setShowSyncContactsPopup(true);
  }

  function onSignIn(user: any) {
    setUserInfo(user);
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
      {!userInfo ? (
        <SignIn onSignIn={onSignIn} />
      ) : (
        <React.Fragment>
          <AddContact onAdd={addContact} />
          <ContactStats
            data={contacts}
            lastUpdated={timestamp}
            onDeleteAll={deleteAllContacts}
            onSyncContacts={onStartSyncContacts}
            user={userInfo}
          />
          <Contacts data={contacts} onDelete={deleteContact} />
        </React.Fragment>
      )}
    </div>
  );
}

export default App;
