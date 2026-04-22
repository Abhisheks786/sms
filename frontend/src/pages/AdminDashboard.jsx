import { useState } from 'react';
import { createUser } from '../services/api';

function AdminDashboard() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUser(formData);
      setMessage(`Successfully created ${formData.role}: ${formData.name}`);
      setFormData({ name: '', email: '', password: '', role: 'student' });
    } catch (err) {
      setMessage('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">Admin Portal</h2>
      <p className="text-gray-600 mb-6">Add new Teachers and Students to the system.</p>
      
      {message && <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded border border-blue-200">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <select 
            value={formData.role} 
            onChange={(e) => setFormData({...formData, role: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input 
            type="text" required 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input 
            type="email" required 
            value={formData.email} 
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input 
            type="text" required minLength="6"
            value={formData.password} 
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" 
          />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 font-semibold transition">
          Create User
        </button>
      </form>
    </div>
  );
}

export default AdminDashboard;
