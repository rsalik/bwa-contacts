import React, { useEffect } from 'react';
import AddContact from './components/AddContact';
import Contacts from './components/Contacts';
import ContactStats from './components/ContactStats';
import { DarkModeRounded, LightModeRounded } from '@mui/icons-material';
import { contactsRef, timestampRef } from './FirebaseHandler';
import { onValue, set } from '@firebase/database';
import './styles/style.scss';

function App() {
  const [contacts, setContacts] = React.useState([] as any[]);
  const [theme, setTheme] = React.useState('default');
  const [timestamp, setTimestamp] = React.useState(Date.now());

  useEffect(() => {
    // Setup Firebase
    onValue(contactsRef, (snapshot) => {
      if (!snapshot.val()) setContacts([])
      else setContacts([...snapshot.val()].filter((c) => c).map((c, i) => ({ ...c, id: i })));
    });

    onValue(timestampRef, (snapshot) => {
      setTimestamp(snapshot.val());
    });
  }, []);

  useEffect(() => {
    const body = document.querySelector('body');

    if (body) {
      body.classList.forEach((c) => body.classList.remove(c));
      body.classList.add('theme--' + theme);
    }
  }, [theme]);

  function onAddContact(contact: any) {
    set(contactsRef, [...contacts, contact]);
    set(timestampRef, Date.now());
  }

  function onDeleteContact(id: number) {
    set(
      contactsRef,
      contacts.filter((c) => c.id !== id)
    );
    set(timestampRef, Date.now());
  }

  function onDeleteAll() {
    setContacts([]); // Deleting all contacts will not trigger onValue
    set(contactsRef, []);
    set(timestampRef, Date.now());
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
      <AddContact onAdd={onAddContact} />
      <ContactStats data={contacts} lastUpdated={timestamp} onDeleteAll={onDeleteAll} />
      <Contacts data={contacts} onDelete={onDeleteContact} />
    </div>
  );
}

export default App;
