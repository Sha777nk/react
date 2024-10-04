import React from 'react';
import { SignUp } from '@clerk/clerk-react';

function SignUpPage() {
  return (
    <div className="sign-up-page">
      <h1>Sign Up</h1>
      <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
    </div>
  );
}

export default SignUpPage;
