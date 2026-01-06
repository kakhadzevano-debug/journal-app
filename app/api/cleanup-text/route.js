// API Route for cleaning up text using Google Gemini API
// SECURITY: This route requires authentication - only logged-in users can access it
// The API key stays on the server and is never exposed to the browser

import { GoogleGenerativeAI } from '@google/generative-ai'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request) {
  try {
    // ========================================
    // SECURITY CHECK: Verify user is authenticated
    // ========================================
    // Create Supabase client with server-side cookies
    const cookieStore = await cookies()
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Supabase environment variables not configured')
      return Response.json(
        { error: 'Service configuration error. Please try again later.' },
        { status: 500 }
      )
    }
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            const cookie = cookieStore.get(name)
            return cookie?.value
          },
          set(name, value, options) {
            try {
              cookieStore.set(name, value, options)
            } catch (error) {
              // Ignore cookie setting errors in API routes
            }
          },
          remove(name, options) {
            try {
              cookieStore.set(name, '', { ...options, maxAge: 0 })
            } catch (error) {
              // Ignore cookie removal errors in API routes
            }
          },
        },
      }
    )

    // Verify user session exists
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
      // User is not authenticated - return 401 Unauthorized
      console.warn('Unauthorized API access attempt to /api/cleanup-text')
      return Response.json(
        { error: 'Authentication required. Please log in to use this feature.' },
        { status: 401 }
      )
    }

    // User is authenticated - proceed with request
    // ========================================

    // Validate Content-Type (additional security check)
    const contentType = request.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      return Response.json(
        { error: 'Content-Type must be application/json' },
        { status: 400 }
      )
    }

    // Get the API key from environment variables (stored in .env.local)
    const apiKey = process.env.GEMINI_API_KEY
    
    if (!apiKey) {
      console.error('GEMINI_API_KEY not configured')
      return Response.json(
        { error: 'Service configuration error. Please try again later.' },
        { status: 500 }
      )
    }

    // Initialize the Gemini client with the API key
    const genAI = new GoogleGenerativeAI(apiKey)

    // Get the text from the request body
    const body = await request.json()
    const { text } = body

    // Validate input - ensure text is present and is a string
    if (!text || typeof text !== 'string') {
      return Response.json(
        { error: 'Text field is required and must be a string' },
        { status: 400 }
      )
    }

    // Validate text length (prevent abuse with extremely long inputs)
    const MAX_TEXT_LENGTH = 50000 // 50k characters max
    if (text.length > MAX_TEXT_LENGTH) {
      return Response.json(
        { error: `Text is too long. Maximum length is ${MAX_TEXT_LENGTH.toLocaleString()} characters.` },
        { status: 400 }
      )
    }

    // Get the Gemini model (using gemini-1.5-flash for fast, cost-effective responses)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.3, // Lower = more consistent, less creative (better for grammar fixes)
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4096,
      },
    })

    // Create the prompt with enhanced sentence structure detection
    const prompt = `You are a professional editor specializing in voice-to-text transcription cleanup. You are editing a personal journal entry.

CONTEXT: Journal entries are:
- Personal and reflective
- Often use first person ("I", "me", "my")
- May have emotional or casual language
- Should feel authentic and genuine

YOUR TASK - Sentence Structure Analysis:

STEP 1: Analyze sentence structure
- Identify complete thoughts and independent clauses
- Detect dependent clauses and subordinate phrases
- Recognize sentence fragments that need to be connected
- Find run-on sentences that need to be split
- Identify missing subjects or predicates

STEP 2: Add periods at the end of EACH complete sentence
CRITICAL: Add a period at the end of EVERY complete sentence. Detect where each sentence naturally ends.

Rules:
- Identify where each complete sentence ends (subject + verb + complete thought)
- Add a period at the end of EACH sentence, not just one at the very end
- A sentence ends when: a complete thought is finished, the idea is complete, or a new subject/topic begins
- For questions, add question marks instead of periods
- Look for natural pauses and complete thoughts - these indicate sentence endings
- Add periods after complete independent clauses that form full thoughts
- Do NOT add periods in the middle of a continuing thought or clause
- Do NOT add periods after conjunctions like "and", "but", "or" that connect ideas
- When you detect a complete sentence has ended, add a period before the next sentence begins

STEP 3: Improve sentence structure and add periods to each sentence
- Identify where each complete sentence ends
- Add a period at the end of EACH sentence (not just one at the end)
- Break run-on sentences into separate sentences if they have multiple complete thoughts
- Do NOT break sentences in the middle - only at clear sentence endings
- Combine fragments that belong together
- Ensure each sentence has a clear subject and predicate
- Make sure EVERY sentence ends with proper punctuation (. ! or ?)

STEP 4: Grammar and mechanics
- Fix ALL grammar errors (subject-verb agreement, verb tenses, etc.)
- Correct ALL spelling mistakes
- Add proper punctuation (periods, commas, semicolons, colons, apostrophes)
- Fix capitalization (proper nouns, sentence starts, "I")
- Fix common voice-to-text errors (e.g., "u" → "you", "cuz" → "because")
- Add missing articles (a, an, the) where needed
- Fix contractions (e.g., "dont" → "don't", "cant" → "can't")

CRITICAL RULES:
- Keep the EXACT same meaning and tone
- Don't add or remove any information
- Don't change the style (keep it personal/journal-like)
- Preserve all specific details, names, and numbers
- Keep the same level of formality
- Maintain the authentic, personal voice
- Every sentence MUST end with proper punctuation (. ! or ?)
- Sentences should be clear and complete, but not overly formal

Here's the text to fix:
${text}

Return ONLY the corrected text, nothing else.`

    // Two-pass cleanup for better results
    // First pass: Sentence structure analysis and basic fixes
    const firstPassPrompt = `Analyze and fix the sentence structure of this voice-to-text journal entry.

STEP 1: Identify where EACH sentence ends
- Find where EVERY complete sentence ends (subject + verb + complete thought)
- Mark ALL sentence endings - not just one at the end
- Look for natural breaks: complete thoughts, finished ideas, topic changes
- Identify where each sentence naturally ends so you can add periods
- Be confident but careful - only mark true sentence endings

STEP 2: Basic corrections
- Fix spelling, basic grammar, punctuation, capitalization, contractions
- Add periods at the end of EACH complete sentence (identify all sentence endings)
- Capitalize the start of each sentence

Keep the exact same meaning and tone. Text: ${text}`
    
    let firstPassResult = await model.generateContent(firstPassPrompt)
    let firstPassResponse = await firstPassResult.response
    let firstPassText = firstPassResponse.text()
    
    // Second pass: Advanced sentence structure refinement
    const secondPassPrompt = `You are a professional editor doing advanced sentence structure refinement on this journal entry.

ANALYZE SENTENCE STRUCTURE:
1. Check each sentence has:
   - Clear subject and predicate
   - Complete thought (not a fragment)
   - Proper length (not too long/run-on, not too short/fragment)

2. Improve sentence flow:
   - Vary sentence length for rhythm
   - Ensure logical progression between sentences
   - Fix parallel structure in lists
   - Properly connect related ideas

3. Verify sentence endings (at the end of EACH sentence):
   - EVERY complete sentence ends with . ! or ? - add periods at the end of each sentence
   - Identify all sentence endings and add periods to each one
   - Make sure each sentence has proper ending punctuation
   - Do NOT add periods in the middle of sentences - only at true sentence endings
   - If the text doesn't end with punctuation, add a period at the very end

4. Final polish:
   - Perfect grammar, punctuation, capitalization
   - Natural, readable flow
   - Maintains personal, journal-like tone

Keep the EXACT same meaning, tone, and all details. Only improve structure and clarity.

Text: ${firstPassText}`
    
    const result = await model.generateContent(secondPassPrompt)
    const response = await result.response
    const cleanedText = response.text()

    // Return the cleaned text
    return Response.json({ cleanedText })
  } catch (error) {
    // Log error for monitoring (server-side only)
    console.error('Error in /api/cleanup-text:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })
    
    // Return user-friendly error (don't expose internal details)
    return Response.json(
      { error: 'Failed to clean up text. Please try again.' },
      { status: 500 }
    )
  }
}

