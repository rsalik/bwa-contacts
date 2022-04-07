export default function SyncContactsPopup(props: { onClose: () => void; onSync: () => void }) {
  return (
    <div className="panel popup warning">
      <div className="content">
        <div className="title">Sync Google Contacts</div>
        <div className="warning">
          Syncing contacts will delete all of your existing contacts, and replace them with your Google Contacts. <br />
          <strong>This application will never edit your Google Contacts data.</strong>
        </div>
        <div className="btn" onClick={props.onSync}>
          Confirm
        </div>
        <div className="btn" onClick={props.onClose}>
          Cancel
        </div>
      </div>
    </div>
  );
}
