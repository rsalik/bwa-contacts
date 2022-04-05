import { DeleteRounded } from '@mui/icons-material';

export default function Contacts(props: { data: any[]; onDelete: Function }) {
  return (
    <div className="contacts panel">
      <div className="content">
        <div className="title">Contacts</div>
        {props.data.map((contact) => (
          <Contact
            key={contact.id}
            data={contact}
            onDelete={() => {
              props.onDelete(contact.id);
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function Contact(props: { data: any; onDelete: Function }) {
  return (
    <div className="contact row">
      <div className="contact-info">
        <div className="icon">{generateIconText(`${props.data.firstName} ${props.data.lastName}`)}</div>
        <div className="info">
          <div className="name">
            {props.data.firstName} {props.data.lastName}
          </div>
          <div className="email">
            <span className="bold">Email: </span>
            {props.data.email}
          </div>
          <div className="phone-number">
            <span className="bold">Phone Number: </span>
            {props.data.phone}
          </div>
        </div>
      </div>
      <div className="delete" onClick={() => props.onDelete()}>
        <DeleteRounded />
      </div>
    </div>
  );
}

export function generateIconText(name: string) {
  let spl = name.trim().split(' ');

  if (spl.length === 1) {
    return spl[0].charAt(0);
  }

  return spl[0].charAt(0) + spl[spl.length - 1].charAt(0);
}
