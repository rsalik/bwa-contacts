import { useState } from 'react';

export default function AddContact(props: { onAdd: (contact: any) => void }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState(0);
  const [email, setEmail] = useState('');

  function submitContact() {
    props.onAdd({
      firstName,
      lastName,
      phone,
      email,
    });

    setFirstName('');
    setLastName('');
    setPhone(0);
    setEmail('');
  }

  return (
    <div className="add-contact half panel accented">
      <div className="content">
        <div className="title">Add A Contact</div>
        <InputRow label="First Name" value={firstName} onChange={(value) => setFirstName(value)} />
        <InputRow label="Last Name" value={lastName} onChange={(value) => setLastName(value)} />
        <InputRow
          label="Phone Number"
          value={phone === 0 ? '' : phone.toString()}
          onChange={(value) => setPhone(parseInt(value.replaceAll(/[^0-9]/gm, '') || '0'))}
        />
        <InputRow label="Email" value={email} onChange={(value) => setEmail(value)} />
        <div className="btn" onClick={submitContact}>
          + Add
        </div>
      </div>
    </div>
  );
}

function InputRow(props: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div className="input-row row">
      {props.label}
      <input type="text" value={props.value} autoComplete={'off'} onChange={(e) => props.onChange(e.target.value)} />
    </div>
  );
}
