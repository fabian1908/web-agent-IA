import React, { useState } from 'react';

const SystemForm = () => {
  const [systemName, setSystemName] = useState('');
  const [systemData, setSystemData] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implement API call to create system and upload data
    console.log('System Name:', systemName);
    console.log('System Data:', systemData);
  };

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Create New System</h2>
      <form onSubmit={handleSubmit} className="max-w-lg">
        <div className="mb-4">
          <label htmlFor="systemName" className="block text-gray-700 text-sm font-bold mb-2">
            System Name:
          </label>
          <input
            type="text"
            id="systemName"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={systemName}
            onChange={(e) => setSystemName(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="systemData" className="block text-gray-700 text-sm font-bold mb-2">
            System Data:
          </label>
          <textarea
            id="systemData"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={systemData}
            onChange={(e) => setSystemData(e.target.value)}
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Create System
        </button>
      </form>
    </div>
  );
};

export default SystemForm;
