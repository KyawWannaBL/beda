import React, { useMemo, useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

type City = 'Yangon' | 'Mandalay' | 'Naypyidaw';

export default function DataEntryForm() {
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState<City>('Yangon');
  const [busy, setBusy] = useState(false);

  const detectedCity = useMemo<City>(() => {
    const lower = address.toLowerCase();
    if (lower.includes('mandalay') || lower.includes('mdy')) return 'Mandalay';
    if (lower.includes('naypyidaw') || lower.includes('npw') || lower.includes('nay pyi taw')) return 'Naypyidaw';
    if (lower.includes('yangon') || lower.includes('ygn')) return 'Yangon';
    return city;
  }, [address, city]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);

    try {
      await addDoc(collection(db, 'orders'), {
        customerName: customerName.trim(),
        address: address.trim(),
        city: detectedCity,
        status: 'PENDING',
        createdAt: serverTimestamp(),
      });

      toast.success(`Order registered and planned for ${detectedCity}`);
      setCustomerName('');
      setAddress('');
      setCity('Yangon');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create order');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur text-white">
      <CardHeader>
        <CardTitle>New Delivery Entry</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white/80">Customer Name</Label>
            <Input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              placeholder="Customer Name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white/80">Full Address (include City)</Label>
            <Textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              placeholder="Full address"
              required
            />
            <div className="text-xs text-white/60">Detected City: <span className="text-white">{detectedCity}</span></div>
          </div>

          <Button
            type="submit"
            disabled={busy}
            className="h-12 bg-gradient-to-r from-emerald-500 to-amber-400 text-slate-950 font-semibold"
          >
            {busy ? 'Saving…' : 'Register Order'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
