import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import MissionDetails from '@/components/MissionDetails';
import { supabase } from '@/lib/supabase';

export default async function MissionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data, error } = await supabase
    .from('missions')
    .select('*')
    .eq('id', id)
    .single();
  if (error || !data) notFound();
  const mission = {
    id: data.id,
    title: data.title,
    reward: data.reward,
    rewardImage: data.rewardimage || '',
    timeFrame: data.timeframe,
    motivation: data.motivation || '',
  tasks: data.tasks,
  motivationMedia: (data as any).motivationmedia || [],
  };
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
        <Button asChild variant="ghost" size="icon">
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to missions</span>
          </Link>
        </Button>
        <h1 className="font-headline text-xl font-semibold">{mission.title}</h1>
      </header>
      <main className="flex-1 p-4 md:p-8">
        <MissionDetails initialMission={mission} />
      </main>
    </div>
  );
}
