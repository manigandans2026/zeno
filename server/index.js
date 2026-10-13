import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Zuno Core API',
    aiConfigured: Boolean(process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY !== 'your-openrouter-api-key'),
    supabaseConfigured: Boolean(process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL)
  });
});

// System prompts for each AI mode
const SYSTEM_PROMPTS = {
  dating: `You are Zuno's Dating Assistant. Zuno is an intentional dating platform for mindful singles who value emotional chemistry, clear communication, and zero ghosting.
Help the user with captivating icebreakers, smooth conversation starters, and respectful dating advice. Keep your tone thoughtful, stylish, and authentic. Provide 2 to 3 actionable suggestions.`,

  profile: `You are Zuno's Profile Studio Assistant. Help the user craft a magnetic, authentic dating profile. 
Focus on sensory details, authentic interests (like vinyl, design, poetry, coffee rituals), and genuine vulnerability without cliché dating app tropes. Provide concise, compelling bio options and voice prompt talking points.`,

  compatibility: `You are Zuno's Neural Compatibility Engine. Analyze the synergy, shared rhythms, and potential conversational friction between two thoughtful individuals.
Highlight emotional alignment, conversation tempo, and shared values. Keep explanations insightful and psychological rather than generic.`,

  relationship: `You are Zuno's Relationship Coach. Guide the user through slow romance, healthy communication boundaries, attachment dynamics, and mindful dating pacing.
Offer calm, emotionally mature, grounding advice.`,

  conversation: `You are Zuno's Chat Analyst. The user will ask how to reply or analyze a conversation thread.
Provide thoughtful, curious, and engaging replies that move the conversation forward naturally without playing manipulative games.`,

  dates: `You are Zuno's Date Concierge. Design unique, low-pressure, aesthetic date experiences.
Focus on intimate settings like vinyl listening bars, brutalist architecture exhibits, pottery studios, quiet matcha cafes, or scenic nature trails. Avoid loud, chaotic, or superficial venues.`
};

// ==========================================
// UNIFIED AI SERVICE (OPENROUTER)
// ==========================================
app.post('/api/ai', async (req, res) => {
  const { prompt, mode = 'dating', userContext = {} } = req.body;

  // 1. Validation
  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({
      success: false,
      error: 'Prompt is required and must be a non-empty string.'
    });
  }

  if (prompt.length > 1200) {
    return res.status(400).json({
      success: false,
      error: 'Prompt is too long. Please keep questions under 1200 characters.'
    });
  }

  // Server-side safety filter enforcement
  const BANNED_PATTERNS = ['scam', 'crypto', 'cashapp', 'telegram', 'venmo', 'wire transfer', 'sugar baby'];
  const lowerPrompt = prompt.toLowerCase();
  const matchedBanned = BANNED_PATTERNS.find(word => lowerPrompt.includes(word));
  if (matchedBanned) {
    return res.status(400).json({
      success: false,
      error: `Your input contains content prohibited by Zuno safety guidelines ("${matchedBanned}").`
    });
  }

  // 2. Check API Key
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || apiKey === 'your-openrouter-api-key') {
    return res.status(503).json({
      success: false,
      error: 'OpenRouter AI service is not yet configured. Please set OPENROUTER_API_KEY in your server environment variables.'
    });
  }

  const model = process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat';
  const systemPrompt = SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.dating;

  const contextSnippet = userContext.name 
    ? `User Profile Context: Name: ${userContext.name}, Profession: ${userContext.profession || 'N/A'}, Intent: ${userContext.intent || 'Intentional Dating'}, Location: ${userContext.location || 'N/A'}, Interests: ${(userContext.interests || []).join(', ')}.`
    : '';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000); // 25s timeout

    let response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.FRONTEND_URL || 'https://zuno-app.com',
        'X-Title': 'Zuno Intentional Dating',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: `${systemPrompt}\n${contextSnippet}` },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 650
      })
    });

    if (!response.ok && (response.status === 402 || response.status === 404)) {
      console.warn(`Primary model ${model} returned ${response.status}. Retrying with resilient fallback...`);
      response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': process.env.FRONTEND_URL || 'https://zuno-app.com',
          'X-Title': 'Zuno Intentional Dating',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'google/gemma-4-26b-a4b-it:free',
          messages: [
            { role: 'system', content: `${systemPrompt}\n${contextSnippet}` },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 650
        })
      });
    }

    clearTimeout(timeout);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenRouter API error [${response.status}]:`, errorText);
      return res.status(response.status).json({
        success: false,
        error: `OpenRouter API returned error ${response.status}: ${errorText}`
      });
    }

    const data = await response.json();
    const completion = data.choices?.[0]?.message?.content;

    if (!completion) {
      return res.status(502).json({
        success: false,
        error: 'Received empty response from OpenRouter AI model.'
      });
    }

    return res.json({
      success: true,
      completion,
      mode,
      model
    });

  } catch (err) {
    if (err.name === 'AbortError') {
      return res.status(504).json({
        success: false,
        error: 'AI request timed out after 25 seconds. Please try again.'
      });
    }
    console.error('AI Proxy Error:', err);
    return res.status(500).json({
      success: false,
      error: `AI Service Error: ${err.message}`
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Zuno backend server running on http://localhost:${PORT}`);
});
