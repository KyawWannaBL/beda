import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function EnterprisePortal() {
  const navigate = useNavigate();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden text-white bg-black">
      {isMounted && (
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-40">
          <source src="/create_animated_video.mp4" type="video/mp4" />
        </video>
      )}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center space-y-8 px-4">
        <img src="/britium-logo.png" alt="Britium Logo" className="w-48 mb-4 animate-in fade-in zoom-in duration-1000" />
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
            BRITIUM <span className="text-emerald-500">EXPRESS</span>
          </h1>
          <p className="text-sm md:text-lg text-white/60 uppercase tracking-[0.3em] font-light">
            Enterprise Logistics Intelligence Platform
          </p>
        </div>
       // Inside EnterprisePortal component
// Inside EnterprisePortal.tsx
<Button
  size="lg"
  className="bg-emerald-600 hover:bg-emerald-500 text-white px-12 py-7 text-xl font-bold rounded-2xl transition-all shadow-xl"
  onClick={() => navigate("/login")} // Go straight to the gatekeeper
>
  Enter Enterprise Portal
</Button>      </div>
    </div>
  );
}