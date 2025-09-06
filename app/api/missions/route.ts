import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

type DbMission = {
  id: string;
  title: string;
  reward: string;
  rewardimage: string | null;
  timeframe: 'daily' | 'weekly' | 'monthly';
  motivation: string | null;
  tasks: any;
  motivationmedia?: any;
};

const dbToClient = (m: DbMission) => ({
  id: m.id,
  title: m.title,
  reward: m.reward,
  rewardImage: m.rewardimage || '',
  timeFrame: m.timeframe,
  motivation: m.motivation || '',
  tasks: m.tasks,
  motivationMedia: m.motivationmedia || [],
});

// GET /api/missions?id=123 for single, or all if no id
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  let query = supabase.from('missions').select('*').order('created_at', { ascending: false });
  if (id) query = query.eq('id', id);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const mapped = Array.isArray(data) ? (data as DbMission[]).map(dbToClient) : dbToClient(data as DbMission);
  return NextResponse.json(mapped);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  // Map camelCase to lowercase keys for Supabase
  const mapped = {
    title: body.title,
    reward: body.reward,
    rewardimage: body.rewardImage,
    timeframe: body.timeFrame,
    motivation: body.motivation,
    tasks: body.tasks,
  motivationmedia: body.motivationMedia || [],
  };
  const { data, error } = await supabase.from('missions').insert([mapped]).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const result = Array.isArray(data) ? (data as DbMission[]).map(dbToClient) : dbToClient(data as DbMission);
  return NextResponse.json(result);
}

// PATCH /api/missions?id=123
export async function PATCH(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const updates = await req.json();
  const { data, error } = await supabase.from('missions').update(updates).eq('id', id).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const result = Array.isArray(data) ? (data as DbMission[]).map(dbToClient) : dbToClient(data as DbMission);
  return NextResponse.json(result);
}

// DELETE /api/missions?id=123
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const { error } = await supabase.from('missions').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
