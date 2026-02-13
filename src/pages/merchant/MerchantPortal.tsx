const MetricCard: React.FC<{...}> = ({ title, value, change, icon, description }) => (
  <Card className="bg-white/5 border-white/10 backdrop-blur-xl rounded-[1.5rem] overflow-hidden hover:border-[#D4AF37]/50 transition-all duration-500">
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
          {icon}
        </div>
        {change && (
          <Badge variant="outline" className="border-[#D4AF37]/20 bg-[#D4AF37]/10 text-[#D4AF37] font-mono">
            {change}
          </Badge>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-3xl font-serif font-bold text-white">{value}</h3>
        <p className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-[0.2em]">
          {title}
        </p>
        <p className="text-xs text-white/50">{description}</p>
      </div>
    </CardContent>
  </Card>
);