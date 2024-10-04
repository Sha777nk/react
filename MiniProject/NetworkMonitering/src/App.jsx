// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Navbar from './Navbar';
// import NetworkStats from './NetworkStats';
// import LinePlot from './graph';
// import Cpu from './Cpu';
// import Memory from './Memory';
// import AddNetwork from './AddNetwork';
// import LoadBalancer from './LoadBalancer';
// import { useUser } from '@clerk/clerk-react';

// function App() {
//   const { user } = useUser();

//   return (
    // <Router>
      // <div className="bg-blue-100 h-screen">
      //   <Navbar />
      //   <div className="max-w-6xl mx-auto px-4 py-8">
      //     <div>
      //       Welcome, {user.firstName}!
      //     </div>
      //     <Routes>
      //       <Route
      //         path="/"
      //         element={
      //           <div>
      //             <div className="mb-8">
      //               <NetworkStats />
      //             </div>
      //             <div className="mb-8">
      //               <LinePlot />
      //             </div>
      //             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
      //               <Cpu />
      //               <Memory />
      //             </div>
      //           </div>
      //         }
      //       />
      //       <Route path="/NetworkStats" element={<NetworkStats />} />
      //       <Route path="/graph" element={<LinePlot />} />
      //       <Route path="/LoadBalancer" element={<LoadBalancer />} />
      //       <Route path="/add-network" element={<AddNetwork />} />
      //     </Routes>
      //   </div>
      // </div>
    // </Router>
//   );
// }

// export default App;



import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './Navbar';
import NetworkStats from './NetworkStats';
import LinePlot from './graph';
import Cpu from './Cpu';
import Memory from './Memory';
import AddNetwork from './AddNetwork';
import LoadBalancer from './LoadBalancer';
import { useUser } from '@clerk/clerk-react';

export default function App() {
  const { user } = useUser();

  return (
    <div>
      <SignedOut>
        <div className="flex items-center justify-center h-screen bg-blue-100">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to Network Monitoring System</h1>
            <p className="text-lg mb-8">Monitor your network performance with ease.</p>
            <Link to="/signin" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
              Get Started
            </Link>
          </div>
        </div>
      </SignedOut>
      <SignedIn>
        <div className="bg-blue-100 h-screen">
          <Navbar />
          <div className="max-w-6xl mx-auto px-4 py-8">
            {/* <div>
              Welcome, {user.firstName}!
            </div> */}
            <Routes>
              <Route
                path="/"
                element={
                  <div className="flex items-center justify-center h-screen bg-blue-100">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Welcome to Network Monitoring System</h1>
                    <p className="text-lg mb-8">Monitor your network performance with ease.</p>
                    <Link to="/add-network" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                      Get Started
                    </Link>
                  </div>
                </div>
                }
              />
              <Route path="/NetworkStats" element={<NetworkStats />} />
              <Route path="/graph" element={<LinePlot />} />
              <Route path="/LoadBalancer" element={<LoadBalancer />} />
              <Route path="/add-network" element={<AddNetwork />} />
            </Routes>
          </div>
        </div>
      </SignedIn>
    </div>
  );
}
