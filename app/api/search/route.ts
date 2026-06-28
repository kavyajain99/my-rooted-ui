export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
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

    const FAITH_KEYWORDS = /\b(church|chapel|cathedral|mosque|synagogue|temple|parish|diocese|ministry|sermon|worship|prayer|bible|quran|torah|sabbath|mass|baptis|confirmati|communion|holy spirit|god's|christ|jesus|allah|yahweh|religious service|faith community|congregation|revival|evangel)\b/i
    const QUEER_INTENT_KEYWORDS = /\b(lgbtq\+?|lgbt|queer|lesbian|sapphic|gay\b|wlw|bisexual|trans\b|nonbinary|non-binary|dyke|drag queen|drag night|pride)\b/i
    const QUEER_EVENT_KEYWORDS = /\b(lgbtq\+?|lgbt|queer|lesbian|sapphic|gay bar|wlw|bisexual|trans\b|nonbinary|dyke|drag|pride|queer-friendly|queer women|queer community|queer space)\b/i
    const GENERIC_TITLES = new Set(["unnamed event", "community event", "social gathering", "monthly meetup", "untitled event", "event"])

    const wantsFaith = FAITH_KEYWORDS.test(intentText)
    const wantsQueer = QUEER_INTENT_KEYWORDS.test(intentText)

    // Raise the similarity threshold for queer queries so hallucinated vibe_checks
    // (where GPT added "LGBTQ+" to a generic event) don't clear the bar.
    const match_threshold = wantsQueer ? 0.32 : 0.22

    // 2. Call the RPC match function
    const { data: events, error } = await supabase.rpc('match_events', {
      query_embedding: embedding,
      match_threshold,
      match_count: 20,
    })

    if (error) throw error

    const filtered = (events ?? []).filter((e: any) => {
      if (!e.title || GENERIC_TITLES.has(e.title.trim().toLowerCase())) return false
      const text = `${e.title ?? ""} ${e.vibe_check ?? ""}`
      if (!wantsFaith && FAITH_KEYWORDS.test(text)) return false
      // For queer searches, require that queer keywords appear in the TITLE,
      // not just the vibe_check (which the AI sometimes hallucinates).
      if (wantsQueer) {
        const titleText = (e.title ?? "").toLowerCase()
        return QUEER_EVENT_KEYWORDS.test(titleText) || QUEER_INTENT_KEYWORDS.test(titleText)
      }
      return true
    }).slice(0, 10)

    return NextResponse.json({ events: filtered })
  } catch (error: any) {
    console.error("Search API Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}