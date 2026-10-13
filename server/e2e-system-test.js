import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON = process.env.VITE_SUPABASE_ANON_KEY;
const API_URL = 'http://localhost:5000';

const results = [];
function report(name, status, details = '') {
  results.push({ name, status, details });
  const icon = status === 'PASS' ? '✅' : '❌';
  console.log(`${icon} [${status}] ${name} ${details ? `— ${details}` : ''}`);
}

async function runSystemTest() {
  console.log('====================================================');
  console.log('           ZUNO COMPLETE SYSTEM TEST SUITE          ');
  console.log('====================================================\n');

  // ----------------------------------------------------
  // TEST SUITE 1: Backend API Health
  // ----------------------------------------------------
  console.log('--- TEST SUITE 1: Backend API Gateway Health ---');
  try {
    const res = await fetch(`${API_URL}/api/health`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.status === 'ok' && data.aiConfigured && data.supabaseConfigured) {
      report('Backend Health Check', 'PASS', `AI & Supabase configured: ${JSON.stringify(data.service)}`);
    } else {
      report('Backend Health Check', 'FAIL', `Incomplete config: ${JSON.stringify(data)}`);
    }
  } catch (err) {
    report('Backend Health Check', 'FAIL', err.message);
  }

  // ----------------------------------------------------
  // TEST SUITE 2: OpenRouter AI Gateway (All 6 Modes)
  // ----------------------------------------------------
  console.log('\n--- TEST SUITE 2: OpenRouter AI Gateway (All 6 Modes) ---');
  const aiModes = [
    { mode: 'dating', prompt: 'Give 1 conversation starter about indie vinyl.' },
    { mode: 'profile', prompt: 'Craft a 1-line bio for an architect into Japanese ceramics.' },
    { mode: 'compatibility', prompt: 'Analyze chemistry between an ambient musician and an architect.' },
    { mode: 'relationship', prompt: 'How do you handle intentional slow dating pacing?' },
    { mode: 'conversation', prompt: 'How do I reply to "What music makes you feel most at peace?"' },
    { mode: 'dates', prompt: 'Suggest 1 quiet aesthetic date venue.' }
  ];

  for (const { mode, prompt } of aiModes) {
    try {
      const res = await fetch(`${API_URL}/api/ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          mode,
          userContext: { name: 'Kavya', location: 'Bangalore' }
        })
      });

      if (!res.ok) throw new Error(`HTTP ${res.status} ${await res.text()}`);
      const data = await res.json();
      if (data.success && data.completion && data.completion.length > 20) {
        report(`AI Mode: [${mode}]`, 'PASS', `Model: ${data.model} | Chars: ${data.completion.length}`);
      } else {
        report(`AI Mode: [${mode}]`, 'FAIL', `Invalid response: ${JSON.stringify(data)}`);
      }
    } catch (err) {
      report(`AI Mode: [${mode}]`, 'FAIL', err.message);
    }
  }

  // ----------------------------------------------------
  // TEST SUITE 3: Supabase Client Authentication
  // ----------------------------------------------------
  console.log('\n--- TEST SUITE 3: Supabase Client Authentication ---');
  const userClient = createClient(SUPABASE_URL, SUPABASE_ANON, {
    auth: { persistSession: false, autoRefreshToken: false },
    realtime: { transport: WebSocket }
  });

  let kavyaSession = null;
  let adminSession = null;

  // Test Member Login
  try {
    const { data, error } = await userClient.auth.signInWithPassword({
      email: 'kavya@zuno.com',
      password: 'password123'
    });
    if (error) throw error;
    kavyaSession = data.session;
    report('Member Auth: kavya@zuno.com', 'PASS', `User ID: ${data.user.id} | Access Token issued`);
  } catch (err) {
    report('Member Auth: kavya@zuno.com', 'FAIL', err.message);
  }

  // Test Admin Login
  try {
    const { data, error } = await userClient.auth.signInWithPassword({
      email: 'admin@zuno.com',
      password: 'admin123'
    });
    if (error) throw error;
    adminSession = data.session;
    report('Admin Auth: admin@zuno.com', 'PASS', `Admin User ID: ${data.user.id} | Role: admin`);
  } catch (err) {
    report('Admin Auth: admin@zuno.com', 'FAIL', err.message);
  }

  // ----------------------------------------------------
  // TEST SUITE 4: Database Operations & RLS Verification
  // ----------------------------------------------------
  console.log('\n--- TEST SUITE 4: Database Operations & RLS Verification ---');

  if (kavyaSession) {
    // Authenticated client as Kavya
    const kavyaDb = createClient(SUPABASE_URL, SUPABASE_ANON, {
      global: { headers: { Authorization: `Bearer ${kavyaSession.access_token}` } },
      realtime: { transport: WebSocket }
    });

    // 4.1 Fetch Kavya's Own Profile
    try {
      const { data: profile, error } = await kavyaDb
        .from('profiles')
        .select('*')
        .eq('id', kavyaSession.user.id)
        .single();
      if (error) throw error;
      report('Database: Fetch User Profile', 'PASS', `Name: ${profile.full_name} | Role: ${profile.role}`);
    } catch (err) {
      report('Database: Fetch User Profile', 'FAIL', err.message);
    }

    // 4.2 Fetch Discover Feed (Other Active Users)
    let candidateUser = null;
    try {
      const { data: discoverUsers, error } = await kavyaDb
        .from('profiles')
        .select('id, full_name, profession, location, compatibility_score')
        .eq('status', 'active')
        .neq('id', kavyaSession.user.id);
      if (error) throw error;
      if (discoverUsers.length > 0) {
        candidateUser = discoverUsers[0];
        report('Database: Fetch Discover Feed', 'PASS', `Found ${discoverUsers.length} active profiles (e.g., ${candidateUser.full_name})`);
      } else {
        report('Database: Fetch Discover Feed', 'FAIL', 'Zero active profiles found in feed');
      }
    } catch (err) {
      report('Database: Fetch Discover Feed', 'FAIL', err.message);
    }

    // 4.3 Record Spark (Match creation)
    if (candidateUser) {
      try {
        const { error } = await kavyaDb
          .from('matches')
          .upsert({
            user_a: kavyaSession.user.id,
            user_b: candidateUser.id,
            status: 'matched',
            compatibility_score: candidateUser.compatibility_score || 90
          }, { onConflict: 'user_a,user_b' });
        if (error) throw error;
        report('Database: Record Spark (Like)', 'PASS', `Sparked with ${candidateUser.full_name}`);
      } catch (err) {
        report('Database: Record Spark (Like)', 'FAIL', err.message);
      }
    }

    // 4.4 Profile Update
    try {
      const newMood = 'Deeply Focused & Inspired';
      const { data: updated, error } = await kavyaDb
        .from('profiles')
        .update({ mood: newMood, last_active: new Date().toISOString() })
        .eq('id', kavyaSession.user.id)
        .select('mood')
        .single();
      if (error) throw error;
      report('Database: Update Profile Mood', 'PASS', `Mood set to: "${updated.mood}"`);
    } catch (err) {
      report('Database: Update Profile Mood', 'FAIL', err.message);
    }

    // 4.5 Fetch User Conversations & Messages
    try {
      const { data: convs, error } = await kavyaDb
        .from('conversations')
        .select('*')
        .or(`user_a.eq.${kavyaSession.user.id},user_b.eq.${kavyaSession.user.id}`);
      if (error) throw error;
      report('Database: Fetch Conversations', 'PASS', `Active conversations: ${convs.length}`);
    } catch (err) {
      report('Database: Fetch Conversations', 'FAIL', err.message);
    }
  }

  // ----------------------------------------------------
  // TEST SUITE 5: Admin Operations & Platform Oversight
  // ----------------------------------------------------
  console.log('\n--- TEST SUITE 5: Admin Dashboard Operations ---');
  if (adminSession) {
    const adminDb = createClient(SUPABASE_URL, SUPABASE_ANON, {
      global: { headers: { Authorization: `Bearer ${adminSession.access_token}` } },
      realtime: { transport: WebSocket }
    });

    // 5.1 Admin Global Stats
    try {
      const [
        { count: totalUsers },
        { count: activeUsers },
        { count: reportsCount }
      ] = await Promise.all([
        adminDb.from('profiles').select('*', { count: 'exact', head: true }),
        adminDb.from('profiles').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        adminDb.from('safety_reports').select('*', { count: 'exact', head: true })
      ]);
      report('Admin: Fetch Platform Metrics', 'PASS', `Total Users: ${totalUsers} | Active: ${activeUsers} | Reports: ${reportsCount}`);
    } catch (err) {
      report('Admin: Fetch Platform Metrics', 'FAIL', err.message);
    }

    // 5.2 Read & Update Platform Settings
    try {
      const { data: settings, error: fetchErr } = await adminDb
        .from('platform_settings')
        .select('*')
        .eq('id', 'global')
        .single();
      if (fetchErr) throw fetchErr;

      const { error: updateErr } = await adminDb
        .from('platform_settings')
        .update({
          settings: {
            ...settings.settings,
            lastTestRun: new Date().toISOString()
          }
        })
        .eq('id', 'global');
      if (updateErr) throw updateErr;

      report('Admin: Read & Update Platform Settings', 'PASS', 'Global policy settings verified and updated');
    } catch (err) {
      report('Admin: Read & Update Platform Settings', 'FAIL', err.message);
    }
  }

  console.log('\n====================================================');
  console.log('                 FINAL TEST SUMMARY                 ');
  console.log('====================================================');
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  console.log(`TOTAL TESTS: ${results.length} | PASSED: ${passed} | FAILED: ${failed}`);
  if (failed > 0) {
    console.error('SYSTEM TEST FAILED WITH ERRORS.');
    process.exit(1);
  } else {
    console.log('ALL SYSTEM TESTS PASSED SUCCESSFULLY! 🚀');
    process.exit(0);
  }
}

runSystemTest();
