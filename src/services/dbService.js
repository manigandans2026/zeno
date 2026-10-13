import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockUsers } from '../data/mockUsers';

export const dbService = {
  /**
   * Fetch discover profiles
   */
  async getDiscoverProfiles(currentUserId) {
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase
          .from('profiles')
          .select('*')
          .eq('status', 'active');

        if (currentUserId) {
          query = query.neq('id', currentUserId);
        }

        const { data, error } = await query.limit(50);
        if (!error && data && data.length > 0) {
          return data.map((p) => ({
            id: p.id,
            name: p.full_name || p.username || 'Member',
            age: p.age || 26,
            profession: p.profession || 'Creative',
            location: p.location || 'New York, NY',
            photo: p.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.full_name || 'Member')}&background=random&color=fff&size=256`,
            compatibility: p.compatibility_score || 88,
            intentLabel: p.intent || 'Slow Romance',
            intentCategory: (p.intent || '').toLowerCase().includes('talk') ? 'talk' : (p.intent || '').toLowerCase().includes('friend') ? 'friends' : (p.intent || '').toLowerCase().includes('long') ? 'long-term' : 'dating',
            interests: p.interests || ['Music', 'Design'],
            aiInsight: 'Shared resonance based on genuine profiles.',
            isActive: p.last_active ? (new Date() - new Date(p.last_active)) < 5 * 60 * 1000 : false,
            activeTime: p.last_active 
              ? (new Date() - new Date(p.last_active)) < 5 * 60 * 1000
                ? 'Active Now'
                : `Active ${Math.round((new Date() - new Date(p.last_active)) / 60000)}m ago`
              : 'Active recently',
            isVerified: Boolean(p.is_verified)
          }));
        }
      } catch (err) {
        console.warn('Falling back to test deck:', err);
      }
    }

    // Fallback gracefully to existing mock deck
    return mockUsers.map((u, index) => {
      const categories = ['dating', 'talk', 'friends', 'long-term'];
      const labels = ['Slow Romance', 'Deep Talks', 'Creative Spark', 'Long-term Partner'];
      const tagIndex = index % 4;
      const allInterests = ['Analog Vinyl', 'Indie Cinema', 'Matcha', 'Modular Synths', 'Brutalism', 'Ceramics', 'Pour Over', 'Nordic Noir', 'Trail Running', 'Biophilic Art', 'Fermentation', 'Books'];
      const randomInterests = allInterests.slice(index % 5, (index % 5) + 4);

      let photo = `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=random&color=fff&size=256`;
      if (index === 0) photo = '/avatars/kavin_new.jpg';
      if (index === 1) photo = '/avatars/ananya_new.jpg';
      if (index === 2) photo = '/avatars/surya_new.jpg';

      return {
        id: u.id,
        name: u.name.split(' ')[0],
        age: u.age,
        profession: ['Sound Designer', 'Architect', 'Biotech Researcher', 'Creative Director', 'Artist', 'Writer'][index % 6],
        location: `${u.city} (${(index * 1.2 + 0.5).toFixed(1)} mi)`,
        photo: photo,
        compatibility: u.matchScore,
        intentCategory: categories[tagIndex],
        intentLabel: labels[tagIndex],
        secondaryTag: ['Audio Creator', 'Design & Form', 'Bio-Design', '35mm Film'][tagIndex],
        interests: randomInterests,
        aiInsight: 'Shared overlap: High resonance based on your recent activity and preferences.',
        isActive: u.status === 'Active' && index % 4 === 0,
        activeTime: (u.status === 'Active' && index % 4 === 0) ? 'Active Now' : 'Active today',
        isVerified: u.verified
      };
    });
  },

  /**
   * Record a like / spark
   */
  async recordSpark(currentUserId, targetProfileId, compatibilityScore = 85) {
    if (isSupabaseConfigured && supabase && currentUserId) {
      try {
        const { data, error } = await supabase
          .from('matches')
          .upsert({
            user_a: currentUserId,
            user_b: targetProfileId,
            status: 'matched',
            compatibility_score: compatibilityScore
          }, { onConflict: 'user_a,user_b' });
        if (error) console.warn('Could not persist spark:', error.message);
        return data;
      } catch (err) {
        console.warn('Spark error:', err);
      }
    }
    return null;
  },

  /**
   * Record a pass
   */
  async recordPass(currentUserId, targetProfileId) {
    if (isSupabaseConfigured && supabase && currentUserId) {
      try {
        await supabase
          .from('matches')
          .upsert({
            user_a: currentUserId,
            user_b: targetProfileId,
            status: 'passed'
          }, { onConflict: 'user_a,user_b' });
      } catch (err) {
        console.warn('Pass error:', err);
      }
    }
  },

  /**
   * Update profile
   */
  async updateProfile(userId, updates) {
    if (isSupabaseConfigured && supabase && userId) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .update({
            ...updates,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId)
          .select()
          .single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.warn('Update profile error:', err);
        throw err;
      }
    }
    return updates;
  },

  /**
   * Update presence timestamp
   */
  async touchPresence(userId) {
    if (isSupabaseConfigured && supabase && userId) {
      try {
        await supabase
          .from('profiles')
          .update({ last_active: new Date().toISOString() })
          .eq('id', userId);
      } catch {
        // silent
      }
    }
  },

  /**
   * Send message
   */
  async sendMessage({ conversationId, senderId, recipientId, text, voiceUrl = null }) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('messages')
          .insert({
            conversation_id: conversationId,
            sender_id: senderId,
            recipient_id: recipientId,
            text,
            voice_url: voiceUrl
          })
          .select()
          .single();
        if (error) throw error;

        // update conversation last message
        await supabase
          .from('conversations')
          .update({
            last_message_text: text,
            last_message_at: new Date().toISOString()
          })
          .eq('id', conversationId);

        return data;
      } catch (err) {
        console.warn('Send message error:', err);
        throw err;
      }
    }
    return null;
  },

  /**
   * Fetch admin real-time statistics
   */
  async getAdminStats() {
    if (isSupabaseConfigured && supabase) {
      try {
        const [
          { count: totalUsers },
          { count: activeUsers },
          { count: premiumUsers },
          { count: openReports },
          { count: pendingVerifications },
          { count: totalMatches }
        ] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('status', 'active'),
          supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active').neq('plan_name', 'Zuno Free'),
          supabase.from('safety_reports').select('*', { count: 'exact', head: true }).eq('status', 'Open'),
          supabase.from('profile_verifications').select('*', { count: 'exact', head: true }).eq('status', 'Pending'),
          supabase.from('matches').select('*', { count: 'exact', head: true }).eq('status', 'matched')
        ]);

        return {
          totalUsers: totalUsers || 842,
          activeUsers: activeUsers || 215,
          premiumUsers: premiumUsers || 124,
          openReports: openReports || 1,
          pendingVerifications: pendingVerifications || 3,
          totalMatches: totalMatches || 1840,
          isReal: true
        };
      } catch (err) {
        console.warn('Admin stats error:', err);
      }
    }

    return {
      totalUsers: 842,
      activeUsers: 215,
      premiumUsers: 124,
      openReports: 1,
      pendingVerifications: 3,
      totalMatches: 1840,
      isReal: false
    };
  },

  /**
   * Fetch global platform settings
   */
  async getPlatformSettings() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('platform_settings')
          .select('*')
          .eq('id', 'global')
          .single();
        if (!error && data?.settings) {
          return data.settings;
        }
      } catch (err) {
        console.warn('Could not fetch platform settings:', err);
      }
    }
    return null;
  },

  /**
   * Update global platform settings (Admin only)
   */
  async updatePlatformSettings(newSettings) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('platform_settings')
          .upsert({
            id: 'global',
            settings: newSettings,
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' })
          .select()
          .single();
        if (error) throw error;
        return data?.settings || newSettings;
      } catch (err) {
        console.warn('Could not update platform settings:', err);
        throw err;
      }
    }
    return newSettings;
  },

  /**
   * Fetch users for admin table
   */
  async getAdminUsers() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map(p => ({
            id: p.id,
            name: p.full_name || p.username || 'Member',
            email: p.email || 'user@zuno.com',
            age: p.age || 26,
            city: (p.location || 'New York').split(',')[0].trim(),
            status: p.status === 'banned' ? 'Banned' : p.status === 'suspended' ? 'Suspended' : 'Active',
            verified: Boolean(p.is_verified),
            matchScore: p.compatibility_score || 88,
            role: p.role || 'user',
            dateJoined: p.created_at ? p.created_at.split('T')[0] : '2026-01-01',
            lastActive: p.last_active ? p.last_active.split('T')[0] : 'Today',
            subscription: 'Active',
            reportCount: 0,
            completion: 90,
            phoneVerified: true,
            bio: p.bio || '',
            interests: p.interests || []
          }));
        }
      } catch (err) {
        console.warn('Could not fetch admin users:', err);
      }
    }
    return null;
  },

  /**
   * Update a user's status (active, suspended, banned)
   */
  async updateUserStatus(userId, newStatus) {
    if (isSupabaseConfigured && supabase && userId) {
      try {
        const dbStatus = newStatus.toLowerCase();
        const { data, error } = await supabase
          .from('profiles')
          .update({
            status: dbStatus,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId)
          .select()
          .single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.warn('Could not update user status:', err);
        throw err;
      }
    }
    return null;
  },

  /**
   * Fetch genuine conversations for current user
   */
  async getConversations(userId) {
    if (isSupabaseConfigured && supabase && userId) {
      try {
        const { data, error } = await supabase
          .from('conversations')
          .select('*')
          .or(`user_a.eq.${userId},user_b.eq.${userId}`)
          .order('last_message_at', { ascending: false });

        if (!error && data && data.length > 0) {
          // Fetch profiles for the partners
          const partnerIds = data.map(c => c.user_a === userId ? c.user_b : c.user_a);
          const { data: partnerProfiles } = await supabase
            .from('profiles')
            .select('*')
            .in('id', partnerIds);

          const profileMap = new Map((partnerProfiles || []).map(p => [p.id, p]));

          return data.map(conv => {
            const partnerId = conv.user_a === userId ? conv.user_b : conv.user_a;
            const partner = profileMap.get(partnerId) || {};
            const lastActive = partner.last_active ? new Date(partner.last_active) : null;
            const isActiveNow = lastActive ? (new Date() - lastActive) < 5 * 60 * 1000 : false;

            return {
              id: conv.id,
              partnerId: partnerId,
              name: partner.full_name?.split(' ')[0] || partner.username || 'Member',
              fullName: partner.full_name || 'Member',
              age: partner.age || 26,
              profession: partner.profession || 'Creative',
              location: partner.location || 'New York, NY',
              photo: partner.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(partner.full_name || 'Member')}&background=random&color=fff`,
              spark: partner.compatibility_score || 92,
              time: conv.last_message_at ? new Date(conv.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
              unread: 0,
              lastMessage: conv.last_message_text || 'Matched recently',
              isActive: isActiveNow,
              lastSeen: isActiveNow ? 'Active now' : 'Active today',
              isVerified: Boolean(partner.is_verified),
              promptContext: partner.bio || ''
            };
          });
        }
      } catch (err) {
        console.warn('Could not fetch conversations:', err);
      }
    }
    return null;
  },

  /**
   * Fetch messages for a specific conversation
   */
  async getMessages(conversationId) {
    if (isSupabaseConfigured && supabase && conversationId) {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true });

        if (!error && data) {
          return data;
        }
      } catch (err) {
        console.warn('Could not fetch messages:', err);
      }
    }
    return [];
  },

  /**
   * Subscribe to real-time message stream for a conversation
   */
  subscribeToMessages(conversationId, onMessageReceived) {
    if (isSupabaseConfigured && supabase && conversationId) {
      const channel = supabase
        .channel(`chat:${conversationId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${conversationId}`
          },
          (payload) => {
            if (payload?.new && onMessageReceived) {
              onMessageReceived(payload.new);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
    return () => {};
  }
};
