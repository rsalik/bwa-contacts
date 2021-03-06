export default function ContactStats(props: { data: any[]; lastUpdated: number, onDeleteAll: () => void, onSyncContacts: () => void, user: any }) {
  return (
    <div className="contact-stats panel half secondary">
      <div className="content">
        <div className="title">Account</div>
        <div className="row">
          <span className="bold"># of Contacts</span> {props.data.length}
        </div>
        <div className="row">
          <span className="bold">Last Updated</span> {new Date(props.lastUpdated).toLocaleString()}
        </div>
        <div className="row">
          <span className="bold">User</span> {props.user.email}
        </div>
        <div className="row">
          <span className="bold">Contacts App By</span> Ryan Salik
        </div>
        <div className="btn" onClick={props.onDeleteAll}>Delete All Contacts</div>
        <div className="btn" onClick={props.onSyncContacts}>Sync Google Contacts</div>
      </div>
    </div>
  );
}
