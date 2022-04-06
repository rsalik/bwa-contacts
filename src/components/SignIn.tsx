import { signIn } from '../FirebaseHandler';

export default function SignIn(props: { onSignIn: Function }) {
  function onSignIn() {
    signIn().then((res) => {
      if (res) {
        props.onSignIn(res);
      }
    });
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
