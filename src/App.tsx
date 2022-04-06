import React, { useEffect } from 'react';
import AddContact from './components/AddContact';
import Contacts from './components/Contacts';
import ContactStats from './components/ContactStats';
import { DarkModeRounded, LightModeRounded } from '@mui/icons-material';
import { getContactsRef, getTimestampRef } from './FirebaseHandler';
import { onValue, set } from '@firebase/database';
import './styles/style.scss';
import SignIn from './components/SignIn';

function App() {
  const [contacts, setContacts] = React.useState([] as any[]);
  const [theme, setTheme] = React.useState('default');
  const [timestamp, setTimestamp] = React.useState(Date.now());
  const [userInfo, setUserInfo] = React.useState(undefined as any);

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

  function onAddContact(contact: any) {
    set(contactsRef.current, [...contacts, contact]);
    set(timestampRef.current, Date.now());
  }

  function onDeleteContact(id: number) {
    set(
      contactsRef.current,
      contacts.filter((c) => c.id !== id)
    );
    set(timestampRef.current, Date.now());
  }

  function onDeleteAll() {
    setContacts([]); // Deleting all contacts will not trigger onValue
    set(contactsRef.current, []);
    set(timestampRef.current, Date.now());
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
      {!userInfo ? (
        <SignIn onSignIn={onSignIn} />
      ) : (
        <React.Fragment>
          <AddContact onAdd={onAddContact} />
          <ContactStats data={contacts} lastUpdated={timestamp} onDeleteAll={onDeleteAll} user={userInfo} />
          <Contacts data={contacts} onDelete={onDeleteContact} />
        </React.Fragment>
      )}
    </div>
  );
}

export default App;
