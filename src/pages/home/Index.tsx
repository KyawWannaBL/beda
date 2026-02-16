import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

/**
 * NOTE:
 * Vite's HTML entrypoint belongs in /index.html (project root), not inside src/pages.
 * This file exists only as a safe React page placeholder.
 */
export default function HomeIndex() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-luxury-obsidian text-white p-6">
      <div className="max-w-lg w-full luxury-glass rounded-[2rem] border border-white/5 p-10 space-y-6">
        <h1 className="text-2xl font-bold text-luxury-gold">Britium Express</h1>
        <p className="text-white/60 text-sm">
          This page is a React placeholder. If you intended to customize the app entry HTML, update the
          project root <code className="text-white/80">index.html</code> instead.
        </p>
        <Button onClick={() => navigate("/portal")} className="w-full">
          Go to Portal
        </Button>
      </div>
    </div>
  );
}
