import { OpenAI } from 'openai';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const { intentText } = await req.json();

    // 1. Turn the user's feeling into a Vector
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: intentText,
    });
    const embedding = embeddingResponse.data[0].embedding;

    // 2. Call your Supabase function (the one we wrote in the SQL editor!)
    const { data, error } = await supabase.rpc('match_events', {
      query_embedding: embedding,
      match_threshold: 0.3, // Matches that are at least 30% similar
      match_count: 5,       // Top 5 results
    });

    if (error) throw error;

    return NextResponse.json({ events: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}