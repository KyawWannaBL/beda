import React, { useState } from 'react';
import { supabase } from '../supabaseClient'; // Adjust path as needed

const DataEntryForm = () => {
  const [formData, setFormData] = useState({
    customer_name: '',
    address: '',
    city: 'Yangon',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Logic: Automatically suggest city based on address keywords
    let detectedCity = formData.city;
    const lowerAddress = formData.address.toLowerCase();
    
    if (lowerAddress.includes('mandalay') || lowerAddress.includes('mdy')) detectedCity = 'Mandalay';
    if (lowerAddress.includes('naypyidaw') || lowerAddress.includes('npw')) detectedCity = 'Naypyidaw';
    if (lowerAddress.includes('yangon') || lowerAddress.includes('ygn')) detectedCity = 'Yangon';

    const { error } = await supabase
      .from('orders')
      .insert([{ ...formData, city: detectedCity, status: 'pending' }]);

    if (error) alert(error.message);
    else alert('Order registered and planned for ' + detectedCity);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-bold">New Delivery Entry</h2>
      <input 
        className="w-full p-2 border rounded"
        placeholder="Customer Name"
        onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
      />
      <textarea 
        className="w-full p-2 border rounded"
        placeholder="Full Address (include City name)"
        onChange={(e) => setFormData({...formData, address: e.target.value})}
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Register Order
      </button>
    </form>
  );
};

export default DataEntryForm;