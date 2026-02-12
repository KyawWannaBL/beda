import React from 'react';

const LandingPage = () => {
  const downloadAPK = () => {
    // const downloadAPK = () => {
  window.location.href = 'https://[your-project].supabase.co/storage/v1/object/public/app-releases/app-debug.apk';
}; (e.g., Supabase Storage)
    window.location.href = '/path-to-your-apk/app-debug.apk';
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
        <div className="text-2xl font-bold text-orange-600">Britium Express</div>
        <button 
          onClick={downloadAPK}
          className="bg-orange-600 text-white px-5 py-2 rounded-full font-medium hover:bg-orange-700 transition"
        >
          Download App
        </button>
      </nav>

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-6 py-16 lg:py-24 flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 text-center lg:text-left">
          <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Logistics Managed <span className="text-orange-600">Smarter.</span>
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-xl">
            The all-in-one platform for BEDA riders and admins. Track orders, manage fleets, and grow your business with our dedicated Android application.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button 
              onClick={downloadAPK}
              className="flex items-center justify-center gap-3 bg-black text-white px-8 py-4 rounded-xl hover:bg-slate-800 transition shadow-lg"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/d/d7/Android_robot.svg" className="w-6 h-6" alt="Android" />
              <div className="text-left">
                <p className="text-xs uppercase">Download for</p>
                <p className="text-lg font-semibold">Android APK</p>
              </div>
            </button>
          </div>
        </div>

        {/* App Mockup */}
        <div className="lg:w-1/2 mt-12 lg:mt-0 flex justify-center relative">
          <div className="w-64 h-[500px] bg-slate-800 rounded-[3rem] border-[8px] border-slate-900 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 w-full h-6 bg-slate-900 flex justify-center">
                <div className="w-20 h-4 bg-slate-900 rounded-b-xl"></div>
            </div>
            <div className="bg-orange-500 h-full flex items-center justify-center">
               <span className="text-white font-bold text-xl">BEDA App</span>
            </div>
          </div>
          {/* Decorative circles */}
          <div className="absolute -z-10 w-72 h-72 bg-orange-200 rounded-full blur-3xl opacity-50 top-10"></div>
        </div>
      </header>

      {/* Features Section */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          <div className="p-6 rounded-2xl bg-slate-50">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">📦</div>
            <h3 className="text-xl font-bold mb-2">Real-time Tracking</h3>
            <p className="text-slate-600">Monitor your deliveries and riders with live GPS updates.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">🛡️</div>
            <h3 className="text-xl font-bold mb-2">Secure Auth</h3>
            <p className="text-slate-600">Integrated Google Sign-in and Role-based access control.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">Admin Dashboard</h3>
            <p className="text-slate-600">Powerful metrics and user management at your fingertips.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;