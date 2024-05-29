import React from 'react';
import Cpu from './Cpu';
import Memory from './Memory';

function LoadBalancer() {
    return (
        <div>
            <h1>Load Balancer</h1>
            <Cpu />
            <Memory />
        </div>
    );
}

export default LoadBalancer;
