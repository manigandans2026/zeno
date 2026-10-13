import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';
import dotenv from 'dotenv';
dotenv.config();

console.log('Testing Supabase & OpenRouter connections...');

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseSecret = process.env.SUPABASE_SERVICE_ROLE_KEY;
const openRouterKey = process.env.OPENROUTER_API_KEY;
const model = process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat';

console.log('Supabase URL:', supabaseUrl);
console.log('OpenRouter Model:', model);

// 1. Supabase Admin Client
const adminClient = createClient(supabaseUrl, supabaseSecret, {
  auth: { autoRefreshToken: false, persistSession: false },
  realtime: { transport: WebSocket }
});

async function runTests() {
  try {
    console.log('\n--- 1. Testing Supabase Admin (Auth Users & Profiles) ---');
    const { data: usersData, error: usersError } = await adminClient.auth.admin.listUsers();
    if (usersError) {
      console.error('Supabase admin.listUsers error:', usersError.message);
    } else {
      console.log(`Supabase Auth OK! Total registered users: ${usersData.users.length}`);
      usersData.users.forEach(u => console.log(` - ${u.email} (id: ${u.id})`));
    }

    const { data: profiles, error: profError } = await adminClient
      .from('profiles')
      .select('id, email, full_name, role')
      .limit(5);
    if (profError) {
      console.error('Profiles query error:', profError.message);
    } else {
      console.log(`Profiles query OK! Profiles count: ${profiles?.length}`);
    }
  } catch (err) {
    console.error('Supabase test error:', err);
  }

  // 2. OpenRouter Test
  try {
    console.log('\n--- 2. Testing OpenRouter Gateway ---');
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: 'user', content: 'Respond with: "Zuno AI Gateway is active"' }]
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('OpenRouter OK! Response:', data.choices?.[0]?.message?.content);
    } else {
      console.error('OpenRouter error status:', response.status, await response.text());
    }
  } catch (err) {
    console.error('OpenRouter fetch error:', err);
  }
}

runTests();
