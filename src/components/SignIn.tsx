import { signIn } from '../FirebaseHandler';

export default function SignIn() {
  function onSignIn() {
    signIn();
  }

  return (
    <div className="panel accented">
      <div className="content">
        <div className="title">Sign In to Continue</div>
        <div className="btn" onClick={onSignIn}>
          Sign In with Google
        </div>
      </div>
    </div>
  );
}
