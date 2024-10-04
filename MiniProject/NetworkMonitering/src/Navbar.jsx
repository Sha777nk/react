// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import NetworkStats from './NetworkStats';
// import Cpu from './Cpu';
// import Memory from './Memory';
// import LinePlot from './graph';
// import AddNetwork from './AddNetwork';

// function Navbar() {
//     const [networks, setNetworks] = useState([]);
//     const [selectedNetwork, setSelectedNetwork] = useState(null);

//     const fetchNetworks = async () => {
//         try {
//             const response = await fetch('http://localhost:3000/networks');
//             const data = await response.json();
//             setNetworks(data);
//             if (data.length > 0) {
//                 setSelectedNetwork(data[0]);
//             }
//         } catch (error) {
//             console.error('Error fetching networks:', error);
//         }
//     };

//     useEffect(() => {
//         fetchNetworks();
//     }, []);

//     return (
//         <Router>
//             <div className="bg-gray-800 text-white p-4">
//                 <div className="max-w-6xl mx-auto flex justify-between items-center">
//                     <h1 className="text-2xl font-bold">Network Monitoring System</h1>
//                     <nav>
//                         <ul className="flex space-x-4">
//                             {networks.map(network => (
//                                 <li key={network}>
//                                     <Link to={`/${network}`} onClick={() => setSelectedNetwork(network)}>
//                                         {network}
//                                     </Link>
//                                 </li>
//                             ))}
//                             <li>
//                                 <Link to="/add-network">Add Network</Link>
//                             </li>
//                         </ul>
//                     </nav>
//                 </div>
//             </div>

//             <div className="max-w-6xl mx-auto px-4 py-8">
//                 <Routes>
//                     <Route path="/" element={
//                         <div>
//                             {selectedNetwork && <NetworkStats networkId={selectedNetwork} />}
//                             <div className="mt-8">
//                                 <LinePlot />
//                                 <br />
//                                 <NetworkStats/>
//                             </div>
//                             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
//                                 <Cpu />
//                                 <Memory />
//                             </div>
//                         </div>
//                     } />
//                     {networks.map(network => (
//                         <Route key={network} path={`/${network}`} element={<NetworkStats networkId={network} />} />
//                     ))}
//                     <Route path="/add-network" element={<AddNetwork onNetworkAdded={fetchNetworks} />} />
//                 </Routes>
//             </div>
//         </Router>
//     );
// }

// export default Navbar;





import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AddNetwork from './AddNetwork';
import { UserButton } from '@clerk/clerk-react';

function Navbar() {
    const [networks, setNetworks] = useState([]);
    const [selectedNetwork, setSelectedNetwork] = useState(null);
    const [showNetworksDropdown, setShowNetworksDropdown] = useState(false);

    const fetchNetworks = async () => {
        try {
            const response = await fetch('http://localhost:3000/networks');
            const data = await response.json();
            setNetworks(data);
            if (data.length > 0) {
                setSelectedNetwork(data[0]);
            }
        } catch (error) {
            console.error('Error fetching networks:', error);
        }
    };

    const fetchNetworkStats = async (networkId) => {
        try {
            const response = await fetch(`http://localhost:3000/network/${networkId}`);
            const data = await response.json();
            console.log(`Stats for ${networkId}:`, data);
        } catch (error) {
            console.error(`Error fetching stats for network ${networkId}:`, error);
        }
    };

    const removeNetwork = async (networkId) => {
        try {
            await fetch(`http://localhost:3000/network/${networkId}`, {
                method: 'DELETE',
            });
            fetchNetworks(); // Refresh the network list
        } catch (error) {
            console.error(`Error removing network ${networkId}:`, error);
        }
    };

    useEffect(() => {
        fetchNetworks();
    }, []);

    const handleNetworkSelect = (network) => {
        setSelectedNetwork(network);
        fetchNetworkStats(network);
        setShowNetworksDropdown(false); // Close dropdown after selection
    };

    const handleRemoveNetwork = (networkId) => {
        removeNetwork(networkId);
    };

    return (
        <div className="bg-gray-800 text-white p-4">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">Network Monitoring System</h1>
                <nav>
                    <ul className="flex space-x-4">
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/NetworkStats">NetworkStats</Link>
                        </li>
                        <li>
                            <Link to="/graph">Graph</Link>
                        </li>
                        <li>
                            <Link to="/LoadBalancer">LoadBalancer</Link>
                        </li>
                        <li className="dropdown">
                            <button className="dropbtn" onClick={() => setShowNetworksDropdown(!showNetworksDropdown)}>
                                Networks
                            </button>
                            {showNetworksDropdown && (
                                <div className="dropdown-content">
                                    {networks.map(network => (
                                        <div key={network}>
                                            <Link
                                                to={`/Networksadded`}
                                                onClick={() => handleNetworkSelect(network)}
                                                className={selectedNetwork === network ? 'active' : ''}
                                            >
                                                {network}
                                            </Link>
                                            <button
                                                onClick={() => handleRemoveNetwork(network)}
                                                    className="bg-white text-black ml-2 px-2  rounded-md"
                                            >
                                                Remove
                                            </button>

                                        </div>
                                    ))}
                                </div>
                            )}
                        </li>
                        <li>
                            <Link to="/add-network">Add Network</Link>
                        </li>
                        <li>
                            <UserButton />
                        </li>
                    </ul>
                </nav>
            </div>
            {selectedNetwork && (
                <div className="network-stats mt-4">
                    <h2>{selectedNetwork} Stats</h2>
                    {/* Display network stats or other content here */}
                </div>
            )}
        </div>
    );
}

export default Navbar;
