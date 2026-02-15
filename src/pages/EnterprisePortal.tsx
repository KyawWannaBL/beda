import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function EnterprisePortal() {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen w-full overflow-hidden text-white">

      {/* VIDEO BACKGROUND */}
      <video
        autoPlay
        muted
        loop
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/create_animated_video.mp4" type="video/mp4" />
      </video>

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center space-y-6">

        {/* LOGO */}
        <img
          src="/britium-logo.png"
          alt="Britium Logo"
          className="w-40 mb-6"
        />

        <h1 className="text-4xl md:text-6xl font-bold tracking-wide">
          BRITIUM EXPRESS
        </h1>

        <p className="text-white/70 max-w-xl">
          Enterprise Logistics Intelligence Platform  
          Secure. Multi-Branch. Real-Time Operations.
        </p>

        <Button
          size="lg"
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-6 text-lg"
          onClick={() => navigate("/portal")}
        >
          Enter Enterprise Portal
        </Button>
      </div>
    </div>
  );
}
