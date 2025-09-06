'use client';

import type { Mission } from '@/lib/types';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import MissionCard from '@/components/MissionCard';
import CreateMissionDialog from '@/components/CreateMissionDialog';


export default function Home() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMissions = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/missions');
        if (!res.ok) throw new Error('Failed to fetch missions');
        const data = await res.json();
        setMissions(data);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchMissions();
  }, []);

  const addMission = async (newMission: Omit<Mission, 'id'>) => {
    try {
      const res = await fetch('/api/missions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMission),
      });
      if (!res.ok) throw new Error('Failed to create mission');
      const created = await res.json();
      setMissions((prev) => [created[0], ...prev]);
    } catch (err: any) {
      setError(err.message || 'Failed to create mission');
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground">
            Your Missions
          </h1>
          <CreateMissionDialog onMissionCreate={addMission}>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
              <span className="hidden sm:inline">Create Mission</span>
            </Button>
          </CreateMissionDialog>
        </div>
        {loading ? (
          <div>Loading missions...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {missions.map((mission) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                onDelete={async (id) => {
                  try {
                    const res = await fetch(`/api/missions?id=${id}`, { method: 'DELETE' });
                    if (!res.ok) throw new Error('Failed to delete mission');
                    setMissions((prev) => prev.filter((m) => m.id !== id));
                  } catch (err: any) {
                    setError(err.message || 'Failed to delete mission');
                  }
                }}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
