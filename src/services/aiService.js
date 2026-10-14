/**
 * Client-side AI service that connects to the Zuno backend OpenRouter service
 */

const API_BASE = (import.meta.env.VITE_API_URL || 'https://zuno-backend1.onrender.com').replace(/\/+$/, '');

export async function askAiAssistant({ prompt, mode = 'dating', userContext = {} }) {
  if (!prompt || !prompt.trim()) {
    throw new Error('Please enter a question or prompt.');
  }

  try {
    const response = await fetch(`${API_BASE}/api/ai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt.trim(),
        mode,
        userContext
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `AI Request failed with status ${response.status}`);
    }

    if (!data.success || !data.completion) {
      throw new Error(data.error || 'No completion returned by AI.');
    }

    return {
      completion: data.completion,
      mode: data.mode,
      model: data.model
    };
  } catch (error) {
    console.error('aiService error:', error);
    throw error;
  }
}
