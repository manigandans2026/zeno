import React, { useState, useRef, useEffect } from 'react';
import { askAiAssistant } from '../../services/aiService';
import { dbService } from '../../services/dbService';

const DEFAULT_CONVERSATIONS = [
  {
    id: 'sora-2',
    name: 'Ananya',
    age: 27,
    profession: 'Ceramist & Architect',
    location: 'Brooklyn, NY',
    photo: '/avatars/ananya_new.jpg',
    spark: 94,
    time: 'Just now',
    unread: 0,
    lastMessage: 'Ananya: Wheel throwing gives me absolute headspace...',
    isActive: true,
    lastSeen: 'Active now',
    isVerified: true,
    promptContext: 'Elena shared: My favorite Saturday is wheel throwing until 2 PM, then getting lost inside a brutalist archive.'
  },
  {
    id: 'julian-1',
    name: 'Kavin',
    age: 29,
    profession: 'Sound Design',
    location: 'Brooklyn, NY',
    photo: '/avatars/kavin_new.jpg',
    spark: 97,
    time: '14m ago',
    unread: 1,
    lastMessage: 'Have you heard that ambient set from Berlin?',
    isActive: false,
    lastSeen: 'Active 14m ago',
    isVerified: true,
    promptContext: 'Julian shared: Looking for vinyl digging buddies in Red Hook & sound design installations.'
  },
  {
    id: 'maya',
    name: 'Maya',
    age: 26,
    profession: 'Visual Poet',
    location: 'Manhattan, NY',
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCW52aPx5UixEhiNRHqJQeKj_KUERJRwkJGo7DvMsNYcHPxyBgqbO5g8NlOOSUG8FP5tdeMStFMW4rpzvG8f_Xv8P9lOuMjMZS-NH8j1r1ZHpVrwt93mTysByr9GBt6OSCTknHT5oZLJ8ZGkYef_R8U_DIanxR0Bk8SJTKxlE-_B7IYUgJwiez0il8_7CXev_rIvnjCMqS4q_ZRQdW0cRSLsMsByf72uhbAkNXH8zycfoPpdABsgRb1Aw',
    spark: 98,
    time: '2h ago',
    unread: 2,
    lastMessage: "Let's check out the neon gallery opening this Friday!",
    isActive: false,
    lastSeen: 'Active 2h ago',
    isVerified: false,
    promptContext: 'Maya shared: Intimate visual poetry & neon photography exhibitions in Soho.'
  },
  {
    id: 'kenzo',
    name: 'Kenzo',
    age: 28,
    profession: 'Spatial Design',
    location: 'Bushwick, NY',
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDY84Sb85JPD90c9dGc22lOH28t0nz0dUD19lFEkqBSHKK5u44uSyQba3zJxwH3U5RmHwRHjIiUa3f-1gdzJkYsz5SmP3TdfTd8kj2q21spJ84r1eQw_l58l0oRQZruJfQLDYTBwqlF0I04JTrBuOtyZcx6S6zcHs-TUNXrckspnWNcWopif9NduRxGzOUIUCLZ8uIbXkCghCJs7Lt0HQBVsQwvpc_3Vu_8K1AV4vyk2trv-XLzrXL9Jw',
    spark: 89,
    time: 'Yesterday',
    unread: 0,
    lastMessage: 'Sent you a venue pin in Bushwick.',
    isActive: false,
    lastSeen: 'Active yesterday',
    isVerified: true,
    promptContext: 'Kenzo shared: Raw concrete brutalism & sustainable spatial installations.'
  }
];

export default function ChatView({ selectedProfile = null, onViewCompatibility, currentUser = null }) {
  
  const [conversations, setConversations] = useState(() => {
    if (selectedProfile) {
      const selectedConv = {
        id: selectedProfile.id,
        partnerId: selectedProfile.id,
        name: selectedProfile.name,
        age: selectedProfile.age || 26,
        profession: selectedProfile.profession || 'Creative',
        location: selectedProfile.location || 'New York, NY',
        photo: selectedProfile.photo,
        spark: selectedProfile.compatibility || 92,
        time: 'Just now',
        unread: 0,
        lastMessage: 'Mutual spark recorded!',
        isActive: selectedProfile.isActive ?? true,
        lastSeen: selectedProfile.activeTime || 'Active recently',
        isVerified: selectedProfile.isVerified ?? true,
        promptContext: selectedProfile.bio || ''
      };
      return [selectedConv, ...DEFAULT_CONVERSATIONS.filter(c => c.id !== selectedProfile.id)];
    }
    return DEFAULT_CONVERSATIONS;
  });

  const [activePartnerId, setActivePartnerId] = useState(selectedProfile?.id || 'sora-2');
  const activePartner = conversations.find(c => c.id === activePartnerId) || conversations[0];

  const [searchQuery, setSearchQuery] = useState('');
  const [directoryFilter, setDirectoryFilter] = useState('all'); 

  const [chatMessages, setChatMessages] = useState({
    'sora-2': [
      {
        id: 101,
        sender: 'them',
        text: 'That archive in DUMBO has the best natural lighting! I usually run there after my ceramics kiln cycle cools down. Have you ever tried pottery yourself?',
        time: '10:42 AM',
        status: 'read'
      },
      {
        id: 102,
        sender: 'me',
        text: 'Only once during a residency in Kyoto! It felt meditative, though my first bowl ended up looking more like abstract brutalist geometry haha.',
        time: '10:44 AM',
        status: 'read'
      },
      {
        id: 103,
        sender: 'them',
        type: 'voice',
        audioDuration: '0:42',
        time: '10:45 AM',
        status: 'read'
      },
      {
        id: 104,
        sender: 'them',
        text: "Haha abstract brutalist pottery is honestly the highest compliment! I'm finishing up a raw terracotta vase series right now.",
        time: '10:46 AM',
        status: 'read'
      }
    ],
    'julian-1': [
      {
        id: 201,
        sender: 'them',
        text: 'Hey Elena! I saw you resonated with vinyl listening bars. I was actually sound engineering an spatial installation in Red Hook last Sunday!',
        time: '10:14 AM',
        status: 'read'
      },
      {
        id: 202,
        sender: 'me',
        text: 'That sounds incredible! I spent my Sunday digging for Japanese ambient jazz vinyls in Brooklyn. Would love to hear about the Red Hook setup.',
        time: '10:20 AM',
        status: 'read'
      },
      {
        id: 203,
        sender: 'them',
        text: 'Japanese ambient jazz is top tier! Have you heard that ambient set from Berlin?',
        time: '10:22 AM',
        status: 'read'
      }
    ],
    maya: [
      {
        id: 301,
        sender: 'them',
        text: 'Hey Elena! Love your architectural portfolio photos. Are you free this weekend?',
        time: '08:15 AM',
        status: 'read'
      },
      {
        id: 302,
        sender: 'them',
        text: "Let's check out the neon gallery opening this Friday! It features responsive light projections.",
        time: '08:30 AM',
        status: 'read'
      }
    ],
    kenzo: [
      {
        id: 401,
        sender: 'me',
        text: 'Hi Kenzo, love your spatial design work in Bushwick!',
        time: 'Yesterday',
        status: 'read'
      },
      {
        id: 402,
        sender: 'them',
        text: 'Sent you a venue pin in Bushwick. Check out the timber joinery when you get a chance.',
        time: 'Yesterday',
        status: 'read'
      }
    ]
  });

  const [typingUsers, setTypingUsers] = useState({
    'sora-2': false,
    'julian-1': false,
    maya: false,
    kenzo: false
  });

  const [inputText, setInputText] = useState('');
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [smartDraft, setSmartDraft] = useState('');
  
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef(null);
  const emojis = ['😊', '😂', '🥰', '😍', '😎', '🥺', '😭', '✨', '🔥', '💯', '👍', '🙏'];

  const messagesEndRef = useRef(null);

  const defaultDrafts = {
    'sora-2': '“That terracotta series sounds incredible — do you work mostly with raw unglazed finishes or oxide glazes? Would love to see the shapes.”',
    'julian-1': '“I haven’t heard that Berlin set yet! Send over a link. Have you checked out the acoustic setup at Public Records in Red Hook?”',
    maya: '“The neon gallery opening on Friday sounds amazing! What time are you heading over?”',
    kenzo: '“Thanks for the Bushwick venue pin! The spatial timber joinery in that space looks stunning.”'
  };

  const handleSelectPartner = (partnerId) => {
    setActivePartnerId(partnerId);
    setIsAiPanelOpen(false);
    setConversations(prev => prev.map(c => c.id === partnerId ? { ...c, unread: 0 } : c));
    setSmartDraft(defaultDrafts[partnerId] || defaultDrafts['sora-2']);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, activePartnerId, typingUsers]);

  // Load genuine database conversations for current user
  useEffect(() => {
    let isMounted = true;
    async function loadRealConversations() {
      if (!currentUser?.id) return;
      try {
        const liveConvs = await dbService.getConversations(currentUser.id);
        if (isMounted && liveConvs && liveConvs.length > 0) {
          setConversations(prev => {
            const liveIds = new Set(liveConvs.map(c => c.id));
            const filteredMock = prev.filter(m => !liveIds.has(m.id));
            return [...liveConvs, ...filteredMock];
          });
        }
      } catch (err) {
        console.warn('Live conversations load notice:', err);
      }
    }
    loadRealConversations();
    return () => { isMounted = false; };
  }, [currentUser?.id]);

  // Handle selectedProfile switch
  const prevSelectedIdRef = useRef(selectedProfile?.id);
  useEffect(() => {
    if (selectedProfile && selectedProfile.id !== prevSelectedIdRef.current) {
      prevSelectedIdRef.current = selectedProfile.id;
      setActivePartnerId(selectedProfile.id);
    }
  }, [selectedProfile]);

  // Load live messages & subscribe to real-time updates for active conversation
  useEffect(() => {
    let isMounted = true;
    async function loadLiveMessages() {
      if (!activePartnerId || activePartnerId.length < 30) return;
      try {
        const msgs = await dbService.getMessages(activePartnerId);
        if (isMounted && msgs && msgs.length > 0) {
          const formatted = msgs.map(m => ({
            id: m.id,
            sender: m.sender_id === currentUser?.id ? 'me' : 'them',
            text: m.text,
            time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: m.is_read ? 'read' : 'sent',
            type: m.voice_url ? 'voice' : 'text'
          }));
          setChatMessages(prev => ({
            ...prev,
            [activePartnerId]: formatted
          }));
        }
      } catch (err) {
        console.warn('Live messages load notice:', err);
      }
    }
    loadLiveMessages();

    let unsubscribe = () => {};
    if (activePartnerId && activePartnerId.length >= 30) {
      unsubscribe = dbService.subscribeToMessages(activePartnerId, (newMsg) => {
        if (!isMounted) return;
        const formatted = {
          id: newMsg.id,
          sender: newMsg.sender_id === currentUser?.id ? 'me' : 'them',
          text: newMsg.text,
          time: new Date(newMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: newMsg.is_read ? 'read' : 'sent'
        };
        setChatMessages(prev => {
          const list = prev[activePartnerId] || [];
          if (list.some(m => m.id === newMsg.id)) return prev;
          return { ...prev, [activePartnerId]: [...list, formatted] };
        });
      });
    }

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [activePartnerId, currentUser?.id]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const applyToneChip = (toneKey) => {
    const name = activePartner.name;
    const toneDrafts = {
      friendly: `“Hey ${name}! That sounds so gorgeous! What inspired the design? I’d love to see a preview sometime.”`,
      natural: `“yeah that looks clean for sure! Are you free to check out a coffee spot this week?”`,
      shorter: `“Love that! Are you free Thursday evening?”`,
      flirty: `“Great taste and amazing headspace? You might just be the most interesting connector in Brooklyn.”`
    };

    if (toneDrafts[toneKey]) {
      setSmartDraft(toneDrafts[toneKey]);
      triggerToast(`AI draft updated to ${toneKey} tone`);
    }
  };

  const insertSmartDraftToInput = () => {
    const textToInsert = smartDraft.replace(/^[\u201C"]|[\u201D"]$/g, '').trim();
    setInputText(textToInsert);
    triggerToast("Draft inserted into composer (Review before sending)");
  };

  const handleSendVoice = () => {
    const currentPartnerId = activePartnerId;
    const currentTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg = {
      id: Date.now(),
      sender: 'me',
      type: 'voice',
      audioDuration: '0:12',
      time: currentTimeStr,
      status: 'sent'
    };

    setChatMessages(prev => ({ ...prev, [currentPartnerId]: [...(prev[currentPartnerId] || []), newMsg] }));
    setConversations(prev => prev.map(c => c.id === currentPartnerId ? { ...c, lastMessage: `You: Voice message`, time: 'Just now' } : c));
  };

  const handleSendPhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const currentPartnerId = activePartnerId;
      const currentTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const newMsg = {
        id: Date.now(),
        sender: 'me',
        type: 'photo',
        photoUrl: event.target.result,
        time: currentTimeStr,
        status: 'sent'
      };

      setChatMessages(prev => ({ ...prev, [currentPartnerId]: [...(prev[currentPartnerId] || []), newMsg] }));
      setConversations(prev => prev.map(c => c.id === currentPartnerId ? { ...c, lastMessage: `You: Photo`, time: 'Just now' } : c));
    };
    reader.readAsDataURL(file);
    e.target.value = null; 
  };

  const getPersonaFallbackReply = (partnerId, text) => {
    const lower = (text || '').toLowerCase();
    if (partnerId === 'julian-1') {
      if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey')) {
        return "Hey! Good to hear from you. Just adjusting some audio stems in Red Hook—how's your day going?";
      }
      if (lower.includes('music') || lower.includes('track') || lower.includes('listen') || lower.includes('sound')) {
        return "Currently got this gorgeous Japanese ambient vinyl spinning. The acoustic separation on it is insane!";
      }
      if (lower.includes('meet') || lower.includes('coffee') || lower.includes('when') || lower.includes('free')) {
        return "Let's grab a warm tea at Public Records this week! Their sound lounge is legendary.";
      }
      return "I love that perspective! Honestly Red Hook has been keeping me inspired all week.";
    }
    if (partnerId === 'sora-2') {
      if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey')) {
        return "Hey Elena! Just finished trimming a batch of terracotta vases. How has your week been treating you?";
      }
      if (lower.includes('pottery') || lower.includes('ceramic') || lower.includes('clay')) {
        return "Wheel throwing has been so therapeutic lately! I'm experimenting with raw ash glazes this week.";
      }
      return "That sounds so lovely! We definitely need to compare notes over coffee soon.";
    }
    if (partnerId === 'maya') {
      if (lower.includes('art') || lower.includes('gallery') || lower.includes('friday')) {
        return "The neon light installations at that Soho pop-up are going to be mesmerizing! Definitely let's go.";
      }
      return "Hey! Loving the energy. Friday night can't come soon enough ✨";
    }
    return "Thanks for checking in! Really appreciate connecting with you here.";
  };

  const fetchRealTimePersonaReply = async (partner, userText, _chatHistory) => {
    try {
      const systemPrompts = {
        'sora-2': 'You are Ananya, 27, a warm and mindful ceramist and architect in Brooklyn on Zuno dating app chatting with Elena. You love pottery, brutalist architecture, tea, and thoughtful slow conversations. Keep replies natural, warm, and concise like real text messages (1-2 sentences). Do not use quotation marks, bullet points, or formal assistant phrasing. If user texts in Tanglish or Tamil, respond naturally in friendly English or mixed Tanglish.',
        'julian-1': 'You are Kavin, 29, a sound designer and audio engineer in Red Hook, Brooklyn on Zuno dating app chatting with Elena. You love ambient vinyl listening bars, acoustic engineering, synthesizers, and relaxed conversations. Keep replies natural, chilled, and concise like real text messages (1-2 sentences). Do not use quotation marks, bullet points, or formal assistant phrasing. If user texts in Tanglish or Tamil, respond naturally in friendly English or mixed Tanglish.',
        maya: 'You are Maya, 26, a visual poet and neon photographer in Soho on Zuno dating app chatting with Elena. You love experimental art galleries, responsive light projections, and late night coffee. Keep replies lively, artistic, and concise like real text messages (1-2 sentences). Do not use quotation marks, bullet points, or formal assistant phrasing. If user texts in Tanglish or Tamil, respond naturally in friendly English or mixed Tanglish.',
        kenzo: 'You are Kenzo, 28, a spatial designer in Bushwick on Zuno dating app chatting with Elena. You love raw concrete, sustainable timber architecture, and quiet gallery spaces. Keep replies grounded, thoughtful, and concise like real text messages (1-2 sentences). Do not use quotation marks, bullet points, or formal assistant phrasing. If user texts in Tanglish or Tamil, respond naturally in friendly English or mixed Tanglish.'
      };

      const systemPrompt = systemPrompts[partner.id] || `You are ${partner.name}, ${partner.age}, a ${partner.profession} in ${partner.location} on Zuno dating app chatting with Elena. Respond naturally, casually, and briefly like a real text message (1-2 sentences).`;

      const result = await askAiAssistant({
        prompt: `${systemPrompt}\nUser says: "${userText}". Respond naturally and briefly (1-2 sentences) in character:`,
        mode: 'conversation',
        userContext: partner
      });

      const text = result.completion.replace(/^["']|["']$/g, '').trim();
      if (text && text.length > 1) return text;
      throw new Error('Empty AI response');
    } catch (err) {
      console.warn('Real-time AI fallback engaged:', err);
      return getPersonaFallbackReply(partner.id, userText);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const currentPartnerId = activePartnerId;
    const currentPartner = activePartner;
    const sentText = inputText.trim();
    const currentTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg = {
      id: Date.now(),
      sender: 'me',
      text: sentText,
      time: currentTimeStr,
      status: 'sent'
    };

    setChatMessages(prev => ({
      ...prev,
      [currentPartnerId]: [...(prev[currentPartnerId] || []), newMsg]
    }));

    setConversations(prev => prev.map(c => c.id === currentPartnerId ? {
      ...c,
      lastMessage: `You: ${sentText}`,
      time: 'Just now'
    } : c));

    setInputText('');

    // Persist to Supabase if genuine conversation
    if (currentPartnerId && currentPartnerId.length >= 30 && currentUser?.id) {
      dbService.sendMessage({
        conversationId: currentPartnerId,
        senderId: currentUser.id,
        recipientId: currentPartner.partnerId || currentPartner.id,
        text: sentText
      }).catch(err => console.warn('Could not persist message to Supabase:', err));
    }

    // Fetch real-time AI reply from free API in background
    const history = chatMessages[currentPartnerId] || [];
    const replyPromise = fetchRealTimePersonaReply(currentPartner, sentText, history);

    // If partner was offline, simulate receiving push notification & coming online
    setTimeout(() => {
      setChatMessages(prev => ({
        ...prev,
        [currentPartnerId]: (prev[currentPartnerId] || []).map(m => m.id === newMsg.id ? { ...m, status: 'read' } : m)
      }));
      setConversations(prev => prev.map(c => c.id === currentPartnerId ? { ...c, isActive: true, lastSeen: 'Active now' } : c));
    }, 1200);

    // Start typing indicator
    setTimeout(() => {
      setTypingUsers(prev => ({ ...prev, [currentPartnerId]: true }));
    }, 1800);

    // Wait for the real API reply with a natural human reading/typing delay
    const [replyText] = await Promise.all([
      replyPromise,
      new Promise(res => setTimeout(res, 3400))
    ]);

    setTypingUsers(prev => ({ ...prev, [currentPartnerId]: false }));

    const replyTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const partnerMsg = {
      id: Date.now() + 1,
      sender: 'them',
      text: replyText,
      time: replyTimeStr,
      status: 'read'
    };

    setChatMessages(prev => ({
      ...prev,
      [currentPartnerId]: [...(prev[currentPartnerId] || []), partnerMsg]
    }));

    setConversations(prev => prev.map(c => c.id === currentPartnerId ? {
      ...c,
      lastMessage: `${c.name}: ${replyText}`,
      time: replyTimeStr,
      isActive: true,
      lastSeen: 'Active now'
    } : c));
  };

  const filteredConversations = conversations.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.profession.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (directoryFilter === 'high') return c.spark >= 90;
    if (directoryFilter === 'unread') return c.unread > 0;
    return true;
  });

  const activeMessages = chatMessages[activePartnerId] || [];
  const isCurrentPartnerTyping = !!typingUsers[activePartnerId];

  return (
    <div className="flex flex-col w-full h-[calc(100vh-6.5rem)] max-w-[1440px] mx-auto text-slate-800 relative">
      
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <span className="material-symbols-outlined text-pink-400 text-sm">info</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-12 gap-6 w-full h-full min-h-0">
        
        <div className="col-span-12 lg:col-span-4 flex flex-col h-full bg-white rounded-2xl p-4 relative border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
          
          <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-cyan-100/40 blur-3xl pointer-events-none"></div>

          <div className="flex flex-col gap-3 pb-3 relative z-10 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Signals</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-pink-100/70 text-pink-600 text-xs font-bold">
                  {conversations.length} Synced
                </span>
              </div>

              <button 
                onClick={() => triggerToast("Directory filtered by High Resonance & Unread signals.")}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all border border-slate-200/50 cursor-pointer"
                title="Filter Directory"
              >
                <span className="material-symbols-outlined text-base">tune</span>
              </button>
            </div>

            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                search
              </span>
              <input 
                type="text"
                placeholder="Search contacts, messages, aura tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs pl-9 pr-3 py-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all font-medium"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <button 
                onClick={() => setDirectoryFilter('all')}
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  directoryFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Matches
              </button>

              <button 
                onClick={() => setDirectoryFilter('high')}
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  directoryFilter === 'high'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                High Resonance (&gt;90%)
              </button>

              <button 
                onClick={() => setDirectoryFilter('unread')}
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  directoryFilter === 'unread'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Unread
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 relative z-10 pt-2">
            {filteredConversations.map((item) => {
              const isSelected = activePartnerId === item.id;
              const isItemTyping = !!typingUsers[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectPartner(item.id)}
                  className={`p-3 rounded-xl transition-all cursor-pointer relative shadow-sm ${
                    isSelected
                      ? 'bg-pink-50/80 border border-pink-300'
                      : 'bg-white hover:bg-slate-50 border border-transparent hover:border-slate-200/80'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute left-0 top-2.5 bottom-2.5 w-1 bg-gradient-to-b from-cyan-500 to-pink-500 rounded-r-full"></div>
                  )}

                  <div className="flex items-start gap-3 pl-1">
                    <div className="relative shrink-0">
                      <img 
                        alt={item.name}
                        className={`w-12 h-12 rounded-full object-cover ring-2 ${
                          isSelected ? 'ring-cyan-400 shadow-md' : 'ring-slate-200'
                        }`}
                        src={item.photo}
                      />
                      {item.isActive ? (
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white shadow-sm" title="Active now"></span>
                      ) : (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-slate-300 ring-2 ring-white" title={item.lastSeen || 'Offline'}></span>
                      )}
                    </div>

                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-slate-900 truncate">{item.name}</span>
                          {item.isVerified && (
                            <span className="material-symbols-outlined text-cyan-600 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                              verified
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-pink-600">{item.time}</span>
                      </div>

                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-extrabold text-pink-600">{item.spark}% Spark</span>
                        <span className="text-slate-300 text-[10px]">•</span>
                        <span className="text-[11px] text-slate-500 truncate font-medium">{item.profession}</span>
                      </div>

                      <div className="flex items-center justify-between mt-1">
                        {isItemTyping ? (
                          <p className="text-xs text-cyan-600 font-bold animate-pulse truncate flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">edit</span>
                            <span>typing...</span>
                          </p>
                        ) : (
                          <p className="text-xs text-slate-600 truncate font-medium">
                            {item.lastMessage}
                          </p>
                        )}

                        {item.unread > 0 && !isSelected && (
                          <span className="px-1.5 py-0.5 rounded-full bg-pink-500 text-white text-[10px] font-extrabold leading-none shrink-0 shadow-sm">
                            {item.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        <div className="col-span-12 lg:col-span-8 flex flex-col h-full bg-white rounded-2xl relative border border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden">
          
          <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-pink-100/40 blur-[100px] pointer-events-none"></div>

          <div className="shrink-0 px-6 py-3.5 bg-white/95 backdrop-blur-xl flex items-center justify-between z-20 border-b border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="relative shrink-0">
                <img 
                  alt={activePartner.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-cyan-400/50 shadow-sm"
                  src={activePartner.photo}
                />
                {activePartner.isActive ? (
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white shadow-sm" title="Active now"></span>
                ) : (
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-slate-400 ring-2 ring-white" title={activePartner.lastSeen || 'Offline'}></span>
                )}
              </div>

              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-slate-900 truncate">
                    {activePartner.name}, {activePartner.age}
                  </h3>
                  {activePartner.isVerified && (
                    <span className="material-symbols-outlined text-cyan-600 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                      verified
                    </span>
                  )}
                  {activePartner.isActive ? (
                    <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Active now
                    </span>
                  ) : (
                    <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 text-[10px] font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                      {activePartner.lastSeen || 'Offline'}
                    </span>
                  )}
                </div>

              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button 
                onClick={() => triggerToast(`Zuno encrypted voice call initiated with ${activePartner.name}.`)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all border border-slate-200/60 cursor-pointer"
                title="Voice Call"
              >
                <span className="material-symbols-outlined text-lg">call</span>
              </button>

              <button 
                onClick={() => triggerToast(`Zuno video encounter initiated with ${activePartner.name}.`)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all border border-slate-200/60 cursor-pointer"
                title="Video Aura Encounter"
              >
                <span className="material-symbols-outlined text-lg">videocam</span>
              </button>

              <div className="relative">
                <button 
                  onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all border border-slate-200/60 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">more_vert</span>
                </button>

                {isMoreMenuOpen && (
                  <div className="absolute right-0 top-11 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-xs animate-fadeIn">
                    <button 
                      onClick={() => {
                        setIsMoreMenuOpen(false);
                        if (onViewCompatibility) onViewCompatibility(activePartner);
                      }}
                      className="w-full px-4 py-2 text-left font-bold text-slate-800 hover:bg-pink-50 hover:text-pink-600 flex items-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">insights</span>
                      <span>View Full Compatibility</span>
                    </button>
                    <button 
                      onClick={() => {
                        setIsMoreMenuOpen(false);
                        triggerToast("Muted notifications for " + activePartner.name);
                      }}
                      className="w-full px-4 py-2 text-left font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">notifications_off</span>
                      <span>Mute Notifications</span>
                    </button>
                    <button 
                      onClick={() => {
                        setIsMoreMenuOpen(false);
                        triggerToast("Unmatched connection.");
                      }}
                      className="w-full px-4 py-2 text-left font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">heart_broken</span>
                      <span>Unmatch Synergy</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4 relative z-10 bg-gradient-to-b from-slate-50/50 to-white">
            
            <div className="flex justify-center my-1">
              <div className="px-4 py-1 rounded-full bg-white text-slate-500 text-[11px] font-bold border border-slate-200 shadow-sm">
                Today, Oct 24
              </div>
            </div>

            {activePartner.promptContext && (
              <div className="mx-auto max-w-lg w-full p-4 rounded-2xl bg-cyan-50/70 border border-cyan-200/70 shadow-sm flex flex-col gap-1">
                <div className="flex items-center gap-1 text-cyan-800 font-extrabold text-[11px] uppercase tracking-wider">
                  <span className="material-symbols-outlined text-xs">arrow_back_ios_new</span>
                  <span>PROMPT DISCOVERY CONNECTION</span>
                </div>
                <p className="text-xs text-slate-700 italic leading-relaxed">
                  “{activePartner.promptContext}”
                </p>
              </div>
            )}

            {activeMessages.map((msg) => {
              const isMe = msg.sender === 'me';
              return (
                <div 
                  key={msg.id}
                  className={`flex flex-col max-w-xl ${isMe ? 'self-end items-end' : 'self-start items-start'}`}
                >
                  {msg.type === 'voice' ? (
                    <div className="p-4 rounded-2xl bg-slate-100 text-slate-800 shadow-sm border border-slate-200/60 w-72 sm:w-80">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => setIsPlayingVoice(!isPlayingVoice)}
                          className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-pink-500 text-white flex items-center justify-center shadow-md shrink-0 transition-transform active:scale-95 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                            {isPlayingVoice ? 'pause' : 'play_arrow'}
                          </span>
                        </button>
                        
                        <div className="flex-1 flex flex-col gap-1">
                          
                          <div className="w-full h-8 flex items-center gap-1 px-1">
                            {[12, 20, 28, 16, 24, 12, 28, 20, 8, 16, 24, 12, 20, 8].map((h, i) => (
                              <span 
                                key={i} 
                                className={`w-1 rounded-full transition-all duration-300 ${
                                  isPlayingVoice ? 'bg-pink-500 animate-pulse' : 'bg-cyan-500'
                                }`} 
                                style={{ height: isPlayingVoice ? `${Math.max(8, (h * Math.random()).toFixed(0))}px` : `${h}px` }}
                              ></span>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between text-slate-500 text-[10px] font-bold">
                            <span>0:00</span>
                            <span>{msg.audioDuration}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : msg.type === 'photo' ? (
                    <div className="p-1 rounded-2xl bg-slate-100 shadow-sm border border-slate-200/60 w-48 sm:w-64 overflow-hidden">
                      <img src={msg.photoUrl} alt="attachment" className="w-full h-auto rounded-xl object-cover" />
                    </div>
                  ) : (
                    <div className={`p-4 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed shadow-sm ${
                      isMe 
                        ? 'bg-gradient-to-r from-cyan-600 via-pink-600 to-rose-600 text-white rounded-br-none shadow-pink-500/20'
                        : 'bg-slate-100 text-slate-800 border border-slate-200/60 rounded-bl-none'
                    }`}>
                      {msg.text}
                    </div>
                  )}

                  <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1 px-1 font-semibold">
                    <span>{msg.time}</span>
                    {isMe && (
                      <span className="material-symbols-outlined text-xs text-cyan-600">
                        {msg.status === 'read' ? 'done_all' : 'done'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {isCurrentPartnerTyping && (
              <div className="flex items-center gap-2 ml-1 py-1">
                <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xs text-cyan-600">edit</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-slate-100 border border-slate-200/80 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-cyan-600 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-cyan-600 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-cyan-600 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
                <span className="text-xs text-slate-500 font-bold">{activePartner.name} is typing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {isAiPanelOpen && (
            <div className="mx-6 mb-2 p-4 rounded-2xl bg-white border border-slate-200 shadow-xl relative z-30 transition-all duration-300">
              <div className="flex items-start justify-between gap-4 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-500 to-pink-500 flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-xs text-white">auto_awesome</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-extrabold text-slate-900 leading-tight">AI Conversation Wingmate</span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAiPanelOpen(false)}
                  className="text-slate-400 hover:text-slate-700 transition-colors p-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>

              <div className="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-cyan-700 uppercase tracking-wider">Suggested Resonance Reply</span>
                  <button 
                    onClick={() => applyToneChip('friendly')}
                    className="flex items-center gap-1 text-slate-500 hover:text-cyan-600 text-[11px] font-bold cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xs">refresh</span>
                    <span>Regenerate</span>
                  </button>
                </div>

                <p className="text-xs font-medium text-slate-800 leading-relaxed italic">
                  {smartDraft}
                </p>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button 
                    onClick={insertSmartDraftToInput}
                    className="px-4 py-1.5 rounded-full bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-extrabold flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">input</span>
                    <span>Insert into composer</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-1.5 mt-2 overflow-x-auto no-scrollbar pt-1">
                <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">Style tweaks:</span>
                <button 
                  onClick={() => applyToneChip('friendly')}
                  className="px-3 py-1 rounded-full bg-slate-100 hover:bg-cyan-50 hover:text-cyan-700 border border-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
                >
                  Make it friendly
                </button>

                <button 
                  onClick={() => applyToneChip('natural')}
                  className="px-3 py-1 rounded-full bg-slate-100 hover:bg-cyan-50 hover:text-cyan-700 border border-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
                >
                  Make it natural
                </button>

                <button 
                  onClick={() => applyToneChip('shorter')}
                  className="px-3 py-1 rounded-full bg-slate-100 hover:bg-cyan-50 hover:text-cyan-700 border border-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
                >
                  Make it shorter
                </button>

                <button 
                  onClick={() => applyToneChip('flirty')}
                  className="px-3 py-1 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
                >
                  Add playful spark
                </button>
              </div>
            </div>
          )}

          <div className="shrink-0 px-6 pb-4 pt-1 z-30">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 bg-white border border-slate-200 p-1.5 rounded-2xl shadow-lg">
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleSendPhoto} 
              />
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:text-cyan-600 hover:bg-slate-100 transition-all cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-lg">attach_file</span>
              </button>

              <div className="relative flex items-center shrink-0">
                <button 
                  type="button"
                  onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    isEmojiPickerOpen ? 'text-cyan-600 bg-slate-100' : 'text-slate-500 hover:text-cyan-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">mood</span>
                </button>
                
                {isEmojiPickerOpen && (
                  <div className="absolute bottom-12 left-0 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 grid grid-cols-4 gap-2 animate-fadeIn w-48">
                    {emojis.map((emoji, index) => (
                      <button 
                        key={index}
                        type="button"
                        onClick={() => {
                          setInputText(prev => prev + emoji);
                          setIsEmojiPickerOpen(false);
                        }}
                        className="text-lg hover:bg-slate-100 rounded-lg p-1 transition-colors cursor-pointer"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button 
                type="button"
                onClick={() => setIsAiPanelOpen(!isAiPanelOpen)}
                title="AI Conversation Wingmate"
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                  isAiPanelOpen ? 'text-pink-600 bg-pink-100/70 shadow-sm' : 'text-slate-500 hover:text-pink-600 hover:bg-slate-100'
                }`}
              >
                <span className="material-symbols-outlined text-lg">auto_awesome</span>
              </button>

              <div className="flex-1 relative flex items-center">
                <input 
                  type="text"
                  placeholder={`Type a message to ${activePartner.name}...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm px-2 py-1.5 focus:outline-none font-medium"
                />
              </div>

              <button 
                type="button"
                onMouseDown={() => setIsRecording(true)}
                onMouseUp={() => {
                  if (isRecording) {
                    setIsRecording(false);
                    handleSendVoice();
                  }
                }}
                onMouseLeave={() => setIsRecording(false)}
                onTouchStart={() => setIsRecording(true)}
                onTouchEnd={() => {
                  if (isRecording) {
                    setIsRecording(false);
                    handleSendVoice();
                  }
                }}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 select-none ${
                  isRecording 
                    ? 'bg-rose-500 text-white animate-pulse shadow-md scale-110' 
                    : 'text-slate-500 hover:text-cyan-600 hover:bg-slate-100'
                }`}
              >
                <span className="material-symbols-outlined text-lg">mic</span>
              </button>

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-pink-500 text-white flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-40 cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-lg">send</span>
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
