import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import NetworkStats from './NetworkStats';
import Cpu from './Cpu';
import Memory from './Memory';
import LinePlot from './graph';

function Card({ title, children }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      {children}
    </div>
  );
}

function Navbar() {
  return (
    <Router>
      <div className="bg-gray-800 text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Network Monitoring System</h1>
          <nav>
            <ul className="flex space-x-4">
              <li><Link to="/">Home </Link></li>
              <li><Link to="/network-stats">Network Stats</Link></li>
              <li><Link to="/cpu-memory">Load Balancer</Link></li>
              <li><Link to="/graph">Graph</Link></li>
            </ul>
          </nav>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={
            <div>
              <div className="mb-8">
                <LinePlot />
              </div>
              <NetworkStats />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
                <div>
                  <Cpu />
                </div>
                <div>
                  <Memory />
                </div>
              </div>
            </div>
          } />
          <Route path="/network-stats" element={<NetworkStats />} />
          <Route path="/cpu-memory" element={
            <div className="max-w-6xl mx-auto grid grid-cols-2 gap-4">
              <Card title="CPU">
                <Cpu />
              </Card>
              <Card title="Memory">
                <Memory />
              </Card>
            </div>
          } />
          <Route path="/graph" element={<LinePlot />} />
        </Routes>
      </div>
    </Router>
  );
}

export default Navbar;
