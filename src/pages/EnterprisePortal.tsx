import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

/**
 * Enterprise Landing Portal - Final Version
 * Resolves Hydration Error #419 and the Navigation Loop bug.
 */
export default function EnterprisePortal() {
  const navigate = useNavigate();
  const [isMounted, setIsMounted] = useState(false);

  // FIX: Wait for client-side mount to prevent hydration mismatch (#419)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden text-white bg-black">
      {/* HYDRATION GUARD: 
        Only render the video tag once the component is mounted in the browser.
        This prevents the mismatch between Vercel's server HTML and the browser render.
      */}
      {isMounted && (
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/create_animated_video.mp4" type="video/mp4" />
        </video>
      )}

      {/* LUXURY VISUAL OVERLAY */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* PORTAL INTERFACE */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center space-y-8 px-4">
        <img 
          src="/britium-logo.png" 
          alt="Britium Logo" 
          className="w-40 md:w-48 mb-4 animate-in fade-in zoom-in duration-1000" 
        />
        
        <div className="space-y-4">
          <h1 className="text-4xl md:text-7xl font-bold tracking-tighter text-white">
            BRITIUM <span className="text-emerald-500">EXPRESS</span>
          </h1>
          <p className="text-sm md:text-lg text-white/60 max-w-2xl mx-auto uppercase tracking-[0.3em] font-light">
            Enterprise Logistics Intelligence Platform
          </p>
        </div>

        <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

        <p className="text-white/50 max-w-md text-sm md:text-base leading-relaxed">
          Secure. Multi-Branch. Real-Time Operations.<br />
          Professional logistics protocol for the Britium network.
        </p>

        {/* FIX: POINT TO LOGIN
          Redirecting to /login ensures the user can authenticate. 
          Pointing to /dashboard while unauthenticated causes a silent redirect back to this page.
        */}
        <Button
          size="lg"
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-12 py-7 text-xl font-bold rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-emerald-600/20"
          onClick={() => navigate("/login")} 
        >
          Enter Enterprise Portal
        </Button>
      </div>
    </div>
  );
}