import React from 'react';
import Navbar from './Navbar';
import NetworkStats from './NetworkStats';
import LinePlot from './graph';
import Cpu from './Cpu';
import Memory from './Memory';

function App() {
  return (
    <div className='bg-blue-100 h-screen'>
      <Navbar />
      {/* <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row lg:gap-4">
          <div className="lg:w-1/3">
            <NetworkStats />
          </div>
          <div className="lg:w-2/3">
            <div className="mb-8">
              <LinePlot />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
          <div>
            <Cpu />
          </div>
          <div>
            <Memory />
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default App;
