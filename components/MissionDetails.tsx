'use client';


import type { Mission, ClientTask, IconName, MediaItem } from '@/lib/types';
import { useState, useMemo, useRef } from 'react';
import RewardLockbox from './RewardLockbox';
import TaskChecklist from './TaskChecklist';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Quote, Book, Dumbbell, Feather, Leaf, Repeat, Coffee, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const iconMap = {
  Book,
  Dumbbell,
  Feather,
  Leaf,
  Repeat,
  Coffee,
};

interface MissionDetailsProps {
  initialMission: Mission;
}


export default function MissionDetails({ initialMission }: MissionDetailsProps) {
  const router = useRouter();
  const clientTasks = useMemo(() => initialMission.tasks.map(task => ({
    ...task,
    icon: iconMap[task.icon as IconName] || Feather,
  })), [initialMission.tasks]);

  const [tasks, setTasks] = useState<ClientTask[]>(clientTasks);
  const [editMode, setEditMode] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeFrame, setTimeFrame] = useState<'daily' | 'weekly' | 'monthly'>(initialMission.timeFrame);
  const [media, setMedia] = useState<MediaItem[]>(initialMission.motivationMedia || []);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleTaskCompletionChange = (taskId: string, newCompletions: number) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, completions: newCompletions } : task
      )
    );
  };

  const { progress, completedTasks, totalTasks, totalCompletions, totalTarget } = useMemo(() => {
    const totalC = tasks.reduce((sum, task) => sum + task.completions, 0);
    const totalT = tasks.reduce((sum, task) => sum + task.target, 0);
    const progressPercentage = totalT > 0 ? (totalC / totalT) * 100 : 0;
    const completedT = tasks.filter(t => t.completions >= t.target).length;

    return {
      progress: progressPercentage,
      completedTasks: completedT,
      totalTasks: tasks.length,
      totalCompletions: totalC,
      totalTarget: totalT,
    };
  }, [tasks]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this mission?')) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/missions?id=${initialMission.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete mission');
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Failed to delete mission');
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      // Map camelCase to lowercase keys for Supabase
      const updatePayload = {
        title: initialMission.title,
        reward: initialMission.reward,
        rewardimage: initialMission.rewardImage,
        timeframe: timeFrame,
        motivation: initialMission.motivation,
        tasks,
        motivationmedia: media,
      };
      const res = await fetch(`/api/missions?id=${initialMission.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload),
      });
      if (!res.ok) throw new Error('Failed to update mission');
      setEditMode(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to update mission');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex justify-end gap-2">
        <Button size="sm" variant="outline" onClick={() => setEditMode((v) => !v)}>
          <Pencil className="h-4 w-4 mr-1" /> {editMode ? 'Cancel Edit' : 'Edit'}
        </Button>
        <Button size="sm" variant="destructive" onClick={handleDelete} disabled={saving}>
          <Trash2 className="h-4 w-4 mr-1" /> Delete
        </Button>
      </div>
      {error && <div className="text-red-500">{error}</div>}
      <RewardLockbox
        reward={initialMission.reward}
        rewardImage={initialMission.rewardImage}
        progress={progress}
        completedTasks={completedTasks}
        totalTasks={totalTasks}
        totalCompletions={totalCompletions}
        totalTarget={totalTarget}
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="font-headline">Mission Requirements</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Time frame:</span>
              {editMode ? (
                <Select value={timeFrame} onValueChange={(v: 'daily' | 'weekly' | 'monthly') => setTimeFrame(v)}>
                  <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <span className="capitalize text-sm">{timeFrame}</span>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <TaskChecklist tasks={tasks} onTaskCompletionChange={handleTaskCompletionChange} editable={editMode} />
          {editMode && (
            <Button className="mt-4" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Motivation Media</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {editMode && (
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*,video/*,audio/*"
                  ref={fileInputRef}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setSaving(true);
                    setError(null);
                    try {
                      const formData = new FormData();
                      formData.append('file', file);
                      formData.append('folder', `missions/${initialMission.id}`);
                      const res = await fetch('/api/upload', { method: 'POST', body: formData });
                      if (!res.ok) throw new Error('Upload failed');
                      const data = await res.json();
                      const kind: MediaItem['kind'] = file.type.startsWith('image')
                        ? 'image'
                        : file.type.startsWith('video')
                        ? 'video'
                        : 'audio';
                      setMedia((prev) => [...prev, { kind, url: data.url, name: data.name, mimeType: data.mimeType }]);
                    } catch (err: any) {
                      setError(err.message || 'Upload failed');
                    } finally {
                      setSaving(false);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }
                  }}
                />
              </div>
            )}

            {media.length === 0 ? (
              <p className="text-sm text-muted-foreground">No media yet.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {media.map((m, idx) => (
                  <div key={idx} className="rounded border p-3">
                    {m.kind === 'image' && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.url} alt={m.name || 'image'} className="w-full h-48 object-cover rounded" />
                    )}
                    {m.kind === 'video' && (
                      <video src={m.url} controls className="w-full h-48 object-cover rounded" />
                    )}
                    {m.kind === 'audio' && (
                      <audio src={m.url} controls className="w-full" />
                    )}
                    {editMode && (
                      <div className="mt-2 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setMedia((prev) => prev.filter((_, i) => i !== idx))}
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {editMode && (
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Media Changes'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {initialMission.motivation && (
        <Card className="bg-primary/20 border-primary/50">
          <CardHeader>
            <CardTitle className="font-headline text-primary-foreground flex items-center gap-3">
              <Quote className="h-6 w-6" />
              Your Motivation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <blockquote className="font-body text-lg italic text-primary-foreground/90">
              "{initialMission.motivation}"
            </blockquote>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
