import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { intentText, demographics } = await req.json()

    // Create a "Rich Persona String"
    // We combine the identity with the intent so the vector captures both.
    const enrichedQuery = `
      User Identity: ${demographics.gender}, Age Range: ${demographics.age}. 
      Seeking: ${intentText}
    `.trim()

    // 1. Turn the enriched persona into a Vector
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: enrichedQuery,
    })

    const [{ embedding }] = embeddingResponse.data

    // 2. Call the RPC match function
    const { data: events, error } = await supabase.rpc('match_events', {
      query_embedding: embedding,
      match_threshold: 0.22, // Slightly lowered to allow for more nuanced persona matches
      match_count: 10,
    })

    if (error) throw error

    return NextResponse.json({ events })
  } catch (error: any) {
    console.error("Search API Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}