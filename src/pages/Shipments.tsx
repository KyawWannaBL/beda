export default function Shipments() {
  return (
    <div className="p-12 bg-white min-h-screen max-w-7xl mx-auto">
      <header className="flex justify-between items-end mb-20">
        <div>
          <h1 className="text-5xl font-serif font-bold text-zinc-900 tracking-tighter">Registry</h1>
          <p className="text-zinc-400 mt-3 text-sm tracking-wide">Managing 1,284 high-value global consignments.</p>
        </div>
        <button className="bg-zinc-900 text-white px-10 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-xl shadow-zinc-200">
          + New Consignment
        </button>
      </header>

      <div className="space-y-1">
        <div className="grid grid-cols-6 py-6 border-b border-zinc-100 text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-300 px-8">
          <div className="col-span-2">Reference / Service</div>
          <div>Destination</div>
          <div>Transit Status</div>
          <div>Timestamp</div>
          <div className="text-right">Action</div>
        </div>

        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="grid grid-cols-6 py-10 border-b border-zinc-50 hover:bg-zinc-50/50 transition-all items-center px-8 group cursor-pointer">
            <div className="col-span-2">
              <p className="text-lg font-medium text-zinc-900 group-hover:text-[#D4AF37] transition-colors">BR-99201-EX</p>
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest mt-1 font-bold">Priority Air / 2.5kg</p>
            </div>
            <div className="text-sm text-zinc-500">Yangon Central</div>
            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-tighter border border-emerald-100">
                In Transit
              </span>
            </div>
            <div className="text-sm text-zinc-400 font-mono">14:02:22</div>
            <div className="text-right">
              <ChevronRight className="h-5 w-5 text-zinc-200 inline-block group-hover:text-zinc-900 group-hover:translate-x-2 transition-all" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}