import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseSecret = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseSecret) {
  console.error('Missing Supabase URL or Secret Key in environment.');
  process.exit(1);
}

const adminClient = createClient(supabaseUrl, supabaseSecret, {
  auth: { autoRefreshToken: false, persistSession: false },
  realtime: { transport: WebSocket }
});

async function getOrCreateUser(email, password, metadata = {}) {
  const { data: listData } = await adminClient.auth.admin.listUsers();
  const existing = listData?.users?.find(u => u.email?.toLowerCase() === email.toLowerCase());

  if (existing) {
    console.log(`User ${email} already exists (${existing.id}). Updating password if needed...`);
    await adminClient.auth.admin.updateUserById(existing.id, {
      password,
      email_confirm: true,
      user_metadata: metadata
    });
    return existing;
  }

  console.log(`Creating user ${email}...`);
  const { data, error } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: metadata
  });

  if (error) {
    console.error(`Failed to create ${email}:`, error.message);
    throw error;
  }

  console.log(`User created: ${email} (${data.user.id})`);
  return data.user;
}

async function seedDatabase() {
  console.log('--- Starting Zuno Database Seeding ---');

  // 1. Create Admin Account
  const adminUser = await getOrCreateUser('admin@zuno.com', 'admin123', {
    full_name: 'Zuno Administrator',
    role: 'admin'
  });

  // Ensure Admin Profile
  const { error: adminProfErr } = await adminClient.from('profiles').upsert({
    id: adminUser.id,
    email: 'admin@zuno.com',
    full_name: 'Zuno Administrator',
    username: 'zuno_admin',
    role: 'admin',
    status: 'active',
    profession: 'Head of Intentional Social Systems',
    location: 'Bangalore / NYC',
    intent: 'System Governance',
    bio: 'Platform Overseer for mindful dating and community safety.',
    interests: ['Systems Thinking', 'AI Ethics', 'Aesthetics'],
    is_verified: true,
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    last_active: new Date().toISOString()
  });
  if (adminProfErr) console.warn('Admin profile error:', adminProfErr.message);
  else console.log('Admin profile verified and active.');

  // 2. Create Member Account (Kavya)
  const kavyaUser = await getOrCreateUser('kavya@zuno.com', 'password123', {
    full_name: 'Kavya Sharma',
    role: 'user'
  });

  const { error: kavyaProfErr } = await adminClient.from('profiles').upsert({
    id: kavyaUser.id,
    email: 'kavya@zuno.com',
    full_name: 'Kavya Sharma',
    username: 'kavya_curates',
    role: 'user',
    status: 'active',
    age: 25,
    profession: 'Sensory Experience Curator',
    location: 'Indiranagar, Bangalore',
    intent: 'Slow Romance',
    bio: 'Analog photography, quiet matcha rituals, modular synthesizers, and intentional conversations under dim light.',
    interests: ['Analog Vinyl', 'Pour Over', 'Indie Cinema', 'Ceramics', 'Brutalism'],
    compatibility_score: 96,
    is_verified: true,
    mood: 'Contemplative & Warm',
    spark_level: 4,
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    photos: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80'
    ],
    last_active: new Date().toISOString()
  });
  if (kavyaProfErr) console.warn('Kavya profile error:', kavyaProfErr.message);
  else console.log('Kavya profile verified and active.');

  // Ensure subscription for Kavya (Velvet / VIP member)
  await adminClient.from('subscriptions').upsert({
    user_id: kavyaUser.id,
    plan_name: 'Zuno Velvet',
    billing_cycle: 'annual',
    status: 'active',
    amount: '₹3,499'
  }, { onConflict: 'user_id' });

  // 3. Create Additional Curated Community Profiles for Discovery & Admin Views
  const discoveryProfiles = [
    {
      email: 'aarav.curator@example.com',
      password: 'password123',
      name: 'Aarav Menon',
      age: 28,
      profession: 'Sound Architect & Acoustic Designer',
      location: 'Koramangala, Bangalore (1.2 mi)',
      intent: 'Slow Romance',
      bio: 'Designing auditory sanctuaries. Big fan of Japanese ambient vinyl and evening pour-overs.',
      interests: ['Modular Synths', 'Analog Vinyl', 'Tea Rituals', 'Modernism'],
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      score: 94
    },
    {
      email: 'ananya.architect@example.com',
      password: 'password123',
      name: 'Ananya Sen',
      age: 26,
      profession: 'Biophilic Architect',
      location: 'Bandra West, Mumbai (3.4 mi)',
      intent: 'Deep Talks',
      bio: 'Integrating rainforest flora into concrete forms. Searching for quiet chemistry and shared intellect.',
      interests: ['Brutalism', 'Biophilic Design', 'Matcha', 'Nordic Noir'],
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      score: 91
    },
    {
      email: 'rohan.writer@example.com',
      password: 'password123',
      name: 'Rohan Varma',
      age: 29,
      profession: 'Documentary Filmmaker',
      location: 'Hauz Khas, New Delhi (4.8 mi)',
      intent: 'Creative Spark',
      bio: 'Filming forgotten trade routes on 16mm film. Let us skip small talk and talk about the passage of time.',
      interests: ['16mm Film', 'Indie Cinema', 'Bookbinding', 'Jazz'],
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
      score: 88
    },
    {
      email: 'tara.ceramics@example.com',
      password: 'password123',
      name: 'Tara Deshmukh',
      age: 27,
      profession: 'Ceramics Sculptor & Ceramicist',
      location: 'Jubilee Hills, Hyderabad (2.1 mi)',
      intent: 'Long-term Partner',
      bio: 'Working with stoneware and wood ash glazes. Love Sunday morning farmers markets and intentional pacing.',
      interests: ['Ceramics', 'Slow Cooking', 'Folk Art', 'Architecture'],
      photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
      score: 95
    },
    {
      email: 'sidharth.botany@example.com',
      password: 'password123',
      name: 'Sidharth Roy',
      age: 30,
      profession: 'Botanical Researcher',
      location: 'Lavelle Road, Bangalore (0.8 mi)',
      intent: 'Slow Romance',
      bio: 'Cataloguing alpine flora. High tolerance for awkward silences, zero tolerance for superficial games.',
      interests: ['Trail Running', 'Fermentation', 'Field Recordings', 'Botany'],
      photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80',
      score: 92
    }
  ];

  for (const p of discoveryProfiles) {
    try {
      const u = await getOrCreateUser(p.email, p.password, { full_name: p.name });
      await adminClient.from('profiles').upsert({
        id: u.id,
        email: p.email,
        full_name: p.name,
        username: p.name.toLowerCase().replace(/[^a-z]/g, '_'),
        role: 'user',
        status: 'active',
        age: p.age,
        profession: p.profession,
        location: p.location,
        intent: p.intent,
        bio: p.bio,
        interests: p.interests,
        compatibility_score: p.score,
        is_verified: true,
        photo: p.photo,
        last_active: new Date(Date.now() - Math.floor(Math.random() * 20 * 60 * 1000)).toISOString()
      });
      console.log(`Seeded discover member: ${p.name}`);
    } catch (err) {
      console.warn(`Error seeding ${p.name}:`, err.message);
    }
  }

  // 4. Create a sample verified match and conversation between Kavya and Aarav
  try {
    const { data: users } = await adminClient.auth.admin.listUsers();
    const aarav = users?.users?.find(u => u.email === 'aarav.curator@example.com');
    if (aarav && kavyaUser) {
      // Create match
      await adminClient.from('matches').upsert({
        user_a: kavyaUser.id,
        user_b: aarav.id,
        status: 'matched',
        compatibility_score: 94
      }, { onConflict: 'user_a,user_b' });

      // Create conversation
      const { data: conv } = await adminClient.from('conversations').upsert({
        user_a: kavyaUser.id,
        user_b: aarav.id,
        last_message_text: "I was just listening to that Hiroshi Yoshimura vinyl you mentioned. The spatial atmosphere is sublime.",
        last_message_at: new Date().toISOString()
      }, { onConflict: 'user_a,user_b' }).select().single();

      if (conv) {
        // Create initial messages
        await adminClient.from('messages').insert([
          {
            conversation_id: conv.id,
            sender_id: aarav.id,
            recipient_id: kavyaUser.id,
            text: "Hi Kavya, I noticed your interest in modular synths and sensory spaces.",
            created_at: new Date(Date.now() - 3600000).toISOString()
          },
          {
            conversation_id: conv.id,
            sender_id: kavyaUser.id,
            recipient_id: aarav.id,
            text: "Hello Aarav! Yes, acoustics change everything about how we experience a room.",
            created_at: new Date(Date.now() - 1800000).toISOString()
          },
          {
            conversation_id: conv.id,
            sender_id: aarav.id,
            recipient_id: kavyaUser.id,
            text: "I was just listening to that Hiroshi Yoshimura vinyl you mentioned. The spatial atmosphere is sublime.",
            created_at: new Date().toISOString()
          }
        ]);
        console.log('Seeded active conversation and messages between Kavya and Aarav.');
      }
    }
  } catch (err) {
    console.warn('Match seeding notice:', err.message);
  }

  // 5. Create a sample moderation safety report for Admin view
  try {
    const { data: users } = await adminClient.auth.admin.listUsers();
    const sid = users?.users?.find(u => u.email === 'sidharth.botany@example.com');
    if (sid && kavyaUser) {
      await adminClient.from('safety_reports').insert({
        reporter_id: kavyaUser.id,
        reported_id: sid.id,
        category: 'Spam or Promotion',
        description: 'Mentioned commercial workshop link in opening exchange.',
        status: 'Open'
      });
      console.log('Seeded sample safety report for Admin review.');
    }
  } catch (err) {
    console.warn('Safety report seeding notice:', err.message);
  }

  console.log('--- Database Seeding Complete! ---');
}

seedDatabase();
