export default function ContactStats(props: { data: any[]; lastUpdated: number, onDeleteAll: () => void, user: any }) {
  return (
    <div className="contact-stats panel half secondary">
      <div className="content">
        <div className="title">Information</div>
        <div className="row">
          <span className="bold"># of Contacts</span>: {props.data.length}
        </div>
        <div className="row">
          <span className="bold">Last Updated</span>: {new Date(props.lastUpdated).toLocaleString()}
        </div>
        <div className="row">
          <span className="bold">User</span> {props.user.user.email}
        </div>
        <div className="row">
          <span className="bold">Data Hosted By</span> Firebase
        </div>
        <div className="row">
          <span className="bold">Contacts App By</span> Ryan Salik
        </div>
        <div className="btn" onClick={props.onDeleteAll}>Delete All Contacts</div>
      </div>
    </div>
  );
}
