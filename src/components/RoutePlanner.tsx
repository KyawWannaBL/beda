import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const RoutePlanner = () => {
  const [loading, setLoading] = useState(false);

  const optimizeRoutes = async (city: string) => {
    setLoading(true);
    
    // 1. Fetch all pending orders for the selected city
    const { data: orders, error: fetchError } = await supabase
      .from('orders')
      .select('id, township, address')
      .eq('city', city)
      .eq('status', 'pending');

    if (fetchError || !orders) {
      alert("Error fetching orders");
      setLoading(false);
      return;
    }

    // 2. Simple Optimization Logic: Sort by Township name 
    // (In a real scenario, you'd use a distance matrix API here)
    const sortedOrders = [...orders].sort((a, b) => 
      (a.township || "").localeCompare(b.township || "")
    );

    // 3. Update the route_sequence in Supabase
    const updates = sortedOrders.map((order, index) => ({
      id: order.id,
      route_sequence: index + 1,
    }));

    const { error: updateError } = await supabase
      .from('orders')
      .upsert(updates);

    if (updateError) {
      alert("Planning failed: " + updateError.message);
    } else {
      alert(`Successfully planned ${orders.length} orders for ${city}!`);
    }
    
    setLoading(false);
  };

  return (
    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-bold mb-4">Route Optimization Panel</h3>
      <p className="text-sm text-slate-600 mb-6">
        Click a city to automatically sequence pending deliveries by township.
      </p>
      
      <div className="flex flex-wrap gap-4">
        {['Yangon', 'Mandalay', 'Naypyidaw'].map((city) => (
          <button
            key={city}
            disabled={loading}
            onClick={() => optimizeRoutes(city)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium transition disabled:bg-slate-400"
          >
            {loading ? 'Planning...' : `Plan ${city}`}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RoutePlanner;