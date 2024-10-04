// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App.jsx'
// import './index.css'

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// )




import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ClerkProvider, RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignInPage from './SignInPage.jsx'; // Correct import for SignInPage component
import SignUpPage from './SignUpPage.jsx'; // Correct import for SignUpPage component

const clerkFrontendApi = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById('root')).render(
  <ClerkProvider  publishableKey={clerkFrontendApi}>
    <Router>
      <Routes>
        <Route path="/sign-in/*" element={<SignInPage />} /> {/* Use SignInPage here */}
        <Route path="/sign-up/*" element={<SignUpPage />} /> {/* Use SignUpPage here */}
        <Route
          path="/*"
          element={
            <>
              <SignedIn>
                <App />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
      </Routes>
    </Router>
  </ClerkProvider>
);




