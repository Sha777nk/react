import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import NetworkStats from './NetworkStats';
import LinePlot from './graph';
import Cpu from './Cpu';
import Memory from './Memory';
import AddNetwork from './AddNetwork';
import LoadBalancer from './LoadBalancer';

function App() {
  return (
    <Router>
      <div className='bg-blue-100 h-screen'>
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={
              <div>
                <div className="mb-8">
                  <NetworkStats />
                </div>
                <div className="mb-8">
                  <LinePlot />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
                  <Cpu />
                  <Memory />
                </div>
              </div>
            } />
            <Route path="/NetworkStats" element={<NetworkStats />} />
            <Route path="/graph" element={<LinePlot />} />
            <Route path="/LoadBalancer" element={<LoadBalancer />} />
            <Route path="/add-network" element={<AddNetwork />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

