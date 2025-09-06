import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file');
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'Missing file' }, { status: 400 });
  }
  const folder = (formData.get('folder') as string) || 'motivation';
  const fileName = `${folder}/${Date.now()}-${file.name}`;

  const arrayBuffer = await file.arrayBuffer();
  const { data, error } = await supabase.storage
    .from('media')
    .upload(fileName, arrayBuffer, {
      contentType: file.type || 'application/octet-stream',
      upsert: false,
    });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: pub } = supabase.storage.from('media').getPublicUrl(fileName);
  return NextResponse.json({
    url: pub?.publicUrl,
    path: data?.path,
    name: file.name,
    mimeType: file.type,
  });
}