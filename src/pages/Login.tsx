import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, Mail, Lock } from 'lucide-react';

export default function Login() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0B0C10] px-4">
      {/* Decorative Background Element */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-amber-500/5 blur-[120px] rounded-full" />
      </div>

      <Card className="w-full max-w-md border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_32px_64px_-15px_rgba(0,0,0,0.5)]">
        <CardHeader className="text-center space-y-2 pb-8">
          <div className="mx-auto w-12 h-12 bg-amber-400/10 rounded-xl flex items-center justify-center mb-4">
            <ShieldCheck className="text-[#D4AF37] h-7 w-7" />
          </div>
          <CardTitle className="text-3xl font-display font-bold text-white tracking-tight">Britium Express</CardTitle>
          <p className="text-zinc-500 text-xs uppercase tracking-[0.2em]">Luxury Logistics Portal</p>
        </CardHeader>
        
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label className="text-zinc-400 text-[10px] uppercase tracking-widest ml-1">Corporate Email</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-600 group-focus-within:text-amber-500 transition-colors" />
                <Input className="pl-10 bg-white/5 border-zinc-800 text-white placeholder:text-zinc-700 h-12 rounded-lg focus:border-amber-500/50" placeholder="executive@britium.com" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-400 text-[10px] uppercase tracking-widest ml-1">Secure Password</Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-600 group-focus-within:text-amber-500 transition-colors" />
                <Input type="password" className="pl-10 bg-white/5 border-zinc-800 text-white h-12 rounded-lg focus:border-amber-500/50" />
              </div>
            </div>

            <Button className="w-full h-14 bg-[#D4AF37] hover:bg-[#B8962E] text-slate-950 font-bold rounded-lg shadow-lg shadow-amber-900/20 transition-all active:scale-[0.98]">
              AUTHENTICATE
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}