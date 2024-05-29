import React, { useState } from 'react';

function AddNetwork({ onNetworkAdded }) {
    const [networkName, setNetworkName] = useState('');
    const [ip, setIP] = useState('');
    const [mac, setMac] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:3000/add-network', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ networkName, ip, mac }),
        });
        if (response.ok) {
            onNetworkAdded();
        } else {
            console.error('Failed to add network');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl mb-4">Add Network</h2>
            <div className="mb-4">
                <label className="block text-gray-700">Network Name</label>
                <input
                    type="text"
                    value={networkName}
                    onChange={(e) => setNetworkName(e.target.value)}
                    className="mt-1 p-2 border rounded w-full"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">IP Address</label>
                <input
                    type="text"
                    value={ip}
                    onChange={(e) => setIP(e.target.value)}
                    className="mt-1 p-2 border rounded w-full"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">MAC Address</label>
                <input
                    type="text"
                    value={mac}
                    onChange={(e) => setMac(e.target.value)}
                    className="mt-1 p-2 border rounded w-full"
                />
            </div>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Network</button>
        </form>
    );
}

export default AddNetwork;
