import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function EnterprisePortal() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">

      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute w-full h-full object-cover opacity-30"
      >
        <source src="/create_animated_video.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10 text-center space-y-6">
        <img
          src="/britium-logo.png"
          alt="Britium Logo"
          className="mx-auto h-24"
        />

        <h1 className="text-4xl font-bold text-white tracking-wide">
          BRITIUM ENTERPRISE PORTAL
        </h1>

        <Button
          onClick={() => navigate("/dashboard")}
          className="px-8 py-6 text-lg bg-blue-600 hover:bg-blue-700"
        >
          Enter Enterprise Portal
        </Button>
      </div>
    </div>
  );
}
