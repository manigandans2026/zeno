import React, { useState, useRef } from 'react';
import { askAiAssistant } from '../../services/aiService';

export default function ProfileView({ 
  user = { 
    name: 'Elena Vance', 
    age: 28, 
    profession: 'Architectural Designer', 
    location: 'Brooklyn, NY',
    intent: 'Slow Romance',
    bio: 'Designing sustainable timber pavilions by day, exploring Red Hook vinyl listening bars by night. Looking for slow, intentional romance.',
    interests: ['Analog Vinyl', 'Brutalism', 'Matcha', '35mm Film', 'Nordic Cinema', 'Trail Running'],
    compatibility: { score: 94, topTraits: ['Creative Spirit', 'Deep Conversations', 'Sunday Rituals'] }
  },
  onUpdateBio,
  onUpdateUser
}) {
  const [activeTab, setActiveTab] = useState('profile'); 
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const fileInputRef = useRef(null);

  const basePhotos = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDf-XNphcEY4_nkQs0mwkhAfAinSgL8m7R_2ZPI5LNh1oieOIOqBhenPr1tbi7AJAaj-yKb3mrMFLqlM09JI8_dSC9dx_vraNzyuuzhujXn2Asst8zsyPSVOIEAaM5k0ymd0tzioebQZM4Bwm49Sv_vt8B_MWtd1EtFt0PI9ynnIn0frymccl_4Ux2I5eSTZa5PH_XSJfZxJtfKMvFRd65vFVL0rgzAF4wEi-Cg1CmD',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCP2_MAAePkyl409g7ba6OCXxkaEKFM2YYkbWTppmEJHDfQKfm4aX3IbIUS0VxhaQMFNscTAq1_YePRHHaujXLD834RhbUGHFlRqTQgnOZMvFDHatiFtWvnuuENTcXjnAdFkw7tasuD7a4s1P-yfl34dbaMieiNQgD95aXgzqNI4b0BRJtcxzm_XfLVxSN8Rp7aUX9rimyxDMSuBhSqGGqFh9Ht7K1CKJQR3Whv7udC'
  ];
  const galleryPhotos = user.photo ? [user.photo, ...basePhotos] : basePhotos;

  const [inputBio, setInputBio] = useState(user.bio);
  const [inputInterests, setInputInterests] = useState(user.interests.join(', '));
  const [aiOutputs, setAiOutputs] = useState({
    improved: `Architectural designer crafting sustainable timber spaces by day, digging for Japanese ambient vinyls by night. Seeking intentional slow romance with zero rush.`,
    prompts: `Prompt Answer: "My non-negotiable Sunday includes slow-drip matcha, reading architectural monographs, and Red Hook listening bars."`,
    short: `Architectural designer & ambient vinyl lover. Seeking slow, intentional connection.`,
    friendly: `Hey! I'm Elena 😊 Architectural designer by day, music digger by night. Always down for quiet coffee walks & listening bars!`,
    natural: `yeah basically into timber architecture, vinyl records & quiet weekend coffee spots. looking for something genuine!`
  });
  const [selectedAiVersion, setSelectedAiVersion] = useState('improved');
  const [toastMessage, setToastMessage] = useState(null);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const [isGeneratingBio, setIsGeneratingBio] = useState(false);

  const handleRegenerate = async () => {
    setIsGeneratingBio(true);
    triggerToast("Generating AI profile variations...");
    try {
      const res = await askAiAssistant({
        prompt: `Craft 5 diverse bio variations based on: Current Bio: "${inputBio}", Interests: "${inputInterests}".`,
        mode: 'profile',
        userContext: user
      });
      if (res?.completion) {
        setAiOutputs(prev => ({
          ...prev,
          improved: res.completion.slice(0, 220),
          short: `${user.profession || 'Creative'}. Into ${inputInterests.split(',')[0] || 'Art'}. Seeking intentional slow romance.`,
          natural: `basically into ${inputInterests.split(',')[0] || 'design'} & quiet weekend coffee spots. looking for genuine connection!`
        }));
        triggerToast("AI generated fresh profile variations!");
      }
    } catch (err) {
      console.warn("AI bio variation notice:", err);
      triggerToast("AI service notice: Check OpenRouter API configuration.");
    } finally {
      setIsGeneratingBio(false);
    }
  };

  const handleApplyBio = (text) => {
    if (onUpdateBio) onUpdateBio(text);
    triggerToast("Updated your profile bio with AI suggestion!");
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full py-4 text-slate-800 relative">
      
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <span className="material-symbols-outlined text-pink-400 text-sm">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Your Profile &amp; AI Assistant
          </h2>
          <p className="text-xs text-slate-600 font-medium">
            Manage your photo gallery, voice intro, interests, or refine your bio with Zuno AI.
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-full border border-slate-200/80">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-white text-pink-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Profile Card View
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'edit'
                ? 'bg-white text-pink-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-sm">edit</span>
            <span>Edit Profile</span>
          </button>
          <button
            onClick={() => setActiveTab('ai-assistant')}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ai-assistant'
                ? 'bg-gradient-to-r from-pink-500 to-cyan-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            <span>AI Profile Assistant</span>
          </button>
        </div>
      </div>

      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            <div className="relative w-full h-[400px] rounded-3xl overflow-hidden bg-slate-900 shadow-lg border border-slate-200">
              <img 
                alt={user.name}
                className="w-full h-full object-cover"
                src={galleryPhotos[activePhotoIdx]}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

              <div className="absolute bottom-4 left-6 right-6 text-white flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-extrabold drop-shadow-md">{user.name}, {user.age}</h3>
                  <p className="text-xs text-slate-200 font-medium">{user.profession} • {user.location}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-pink-500 text-white font-extrabold text-xs">
                  {user.intent}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {galleryPhotos.map((photo, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIdx(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activePhotoIdx === idx ? 'border-pink-500 ring-2 ring-pink-500/30 scale-105' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={photo} className="w-full h-full object-cover" alt="Thumbnail" />
                </button>
              ))}
            </div>

            <div className="p-5 rounded-3xl bg-gradient-to-r from-pink-50 via-rose-50 to-cyan-50 border border-pink-200/80 shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-pink-600 font-extrabold text-xs uppercase tracking-wider">
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                    graphic_eq
                  </span>
                  <span>Voice Introduction • "My Sunday Rituals"</span>
                </div>
                <span className="text-xs font-bold text-slate-500">0:28</span>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsPlayingVoice(!isPlayingVoice)}
                  className="w-12 h-12 rounded-full bg-pink-500 hover:bg-pink-600 text-white flex items-center justify-center shadow-lg shadow-pink-500/30 transition-transform active:scale-95 cursor-pointer shrink-0"
                >
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {isPlayingVoice ? 'pause' : 'play_arrow'}
                  </span>
                </button>

                <div className="flex-1 flex items-center gap-1 h-8">
                  {[40, 75, 35, 90, 65, 80, 50, 95, 40, 70, 85, 60, 45, 80, 55].map((h, i) => (
                    <div 
                      key={i} 
                      className={`flex-1 rounded-full transition-all duration-300 ${
                        isPlayingVoice ? 'bg-pink-500 animate-pulse' : 'bg-pink-300'
                      }`}
                      style={{ height: isPlayingVoice ? `${Math.min(95, Math.max(20, (h * ((i % 4) + 1) * 0.35).toFixed(0)))}%` : `${h}%` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col gap-3">
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">About Me</h4>
              <p className="text-sm text-slate-800 leading-relaxed font-medium">
                “{user.bio}”
              </p>
            </div>

            {user.compatibility && (
              <div className="p-6 rounded-3xl bg-gradient-to-br from-pink-50 to-cyan-50 border border-pink-100 shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-pink-500 uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                    Compatibility Match
                  </h4>
                  <div className="px-2 py-1 rounded-full bg-white text-pink-600 font-extrabold text-xs shadow-sm border border-pink-100">
                    {user.compatibility.score}% Match
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {user.compatibility.topTraits.map((trait, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-full bg-white text-slate-700 font-semibold text-xs border border-slate-100 shadow-sm flex items-center gap-1">
                      <span className="text-pink-400 text-xs">✨</span>
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col gap-3">
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Passions &amp; Intent</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-700 font-extrabold text-xs">
                  {user.intent}
                </span>
                {user.interests.map((interest, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold text-xs">
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col gap-3">
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Profile Actions</h4>

              <div className="grid grid-cols-2 gap-2.5">
                <button 
                  onClick={() => triggerToast("Liked profile!")}
                  className="py-2.5 px-4 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md hover:opacity-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                  <span>Like</span>
                </button>

                <button 
                  onClick={() => triggerToast("Chat session initiated.")}
                  className="py-2.5 px-4 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">forum</span>
                  <span>Message</span>
                </button>

                <button 
                  onClick={() => triggerToast("Passed profile for today.")}
                  className="py-2.5 px-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                  <span>Pass</span>
                </button>

                <button 
                  onClick={() => triggerToast("Profile reported to safety team.")}
                  className="py-2.5 px-4 rounded-full bg-slate-100 hover:bg-rose-100 text-rose-600 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">flag</span>
                  <span>Report</span>
                </button>
              </div>

              <button 
                onClick={() => triggerToast("User blocked successfully.")}
                className="w-full py-2.5 rounded-full bg-rose-50 text-rose-700 font-bold text-xs hover:bg-rose-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-1"
              >
                <span className="material-symbols-outlined text-sm">block</span>
                <span>Block Profile</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {activeTab === 'ai-assistant' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 text-pink-600 font-extrabold text-sm uppercase tracking-wider">
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <span>Input Existing Profile Data</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Current Bio</label>
              <textarea 
                rows="4"
                placeholder="Enter your current bio to refine..."
                value={inputBio}
                onChange={(e) => setInputBio(e.target.value)}
                className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500/30 font-medium"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Interests &amp; Hobbies</label>
              <input 
                type="text"
                placeholder="Enter your interests & hobbies (e.g. Analog Vinyl, Brutalism, Matcha)..."
                value={inputInterests}
                onChange={(e) => setInputInterests(e.target.value)}
                className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500/30 font-medium"
              />
            </div>

            <button
              onClick={handleRegenerate}
              disabled={isGeneratingBio}
              className="w-full py-3 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-cyan-500 text-white font-extrabold text-xs shadow-md shadow-pink-500/20 hover:opacity-95 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-sm">{isGeneratingBio ? 'sync' : 'refresh'}</span>
              <span>{isGeneratingBio ? 'Generating Variations...' : 'Regenerate AI Variations'}</span>
            </button>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900">AI Generated Bio Variations</h3>
              <span className="text-xs text-slate-500 font-medium">Select a version to preview &amp; apply</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { id: 'improved', label: 'Improved Bio' },
                { id: 'prompts', label: 'Profile Prompt' },
                { id: 'short', label: 'Short Version' },
                { id: 'friendly', label: 'Friendly Version' },
                { id: 'natural', label: 'Natural Version' }
              ].map(ver => (
                <button
                  key={ver.id}
                  onClick={() => setSelectedAiVersion(ver.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                    selectedAiVersion === ver.id
                      ? 'bg-pink-500 text-white shadow-sm'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {ver.label}
                </button>
              ))}
            </div>

            <div className="p-6 rounded-3xl bg-gradient-to-br from-pink-50/70 via-white to-cyan-50/70 border border-pink-200/80 shadow-md flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-pink-600 uppercase tracking-wider">
                  AI Output ({selectedAiVersion.toUpperCase()})
                </span>
                <span className="text-[10px] bg-pink-100 text-pink-700 font-bold px-2 py-0.5 rounded-full">
                  High Resonance Score
                </span>
              </div>

              <p className="text-sm font-medium text-slate-800 leading-relaxed italic bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
                “{aiOutputs[selectedAiVersion]}”
              </p>

              <div className="flex flex-wrap gap-2 pt-2 border-t border-pink-100">
                <button
                  onClick={() => handleApplyBio(aiOutputs[selectedAiVersion])}
                  className="py-2.5 px-5 rounded-full bg-gradient-to-r from-pink-500 to-cyan-500 text-white font-extrabold text-xs shadow-md hover:opacity-95 cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">check</span>
                  <span>Use This</span>
                </button>

                <button
                  onClick={handleRegenerate}
                  className="py-2.5 px-4 rounded-full bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 cursor-pointer flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">refresh</span>
                  <span>Regenerate</span>
                </button>

                <button
                  onClick={() => setSelectedAiVersion('short')}
                  className="py-2.5 px-4 rounded-full bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 cursor-pointer"
                >
                  Make Shorter
                </button>

                <button
                  onClick={() => setSelectedAiVersion('natural')}
                  className="py-2.5 px-4 rounded-full bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 cursor-pointer"
                >
                  Make More Natural
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'edit' && (
        <form onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.target);
          if (onUpdateUser) {
            onUpdateUser({
              ...user,
              name: fd.get('name'),
              age: fd.get('age'),
              location: fd.get('location'),
              profession: fd.get('profession'),
              phone: fd.get('phone'),
              intent: fd.get('intent'),
              bio: fd.get('bio'),
              interests: fd.get('interests').split(',').map(i => i.trim()).filter(Boolean)
            });
          }
          triggerToast("Profile updated successfully!");
          setActiveTab('profile');
        }} className="max-w-3xl mx-auto w-full bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 flex flex-col gap-6 animate-fadeIn">
          <div className="flex items-center gap-2 text-pink-600">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>edit_square</span>
            <h3 className="text-xl font-extrabold text-slate-900">Edit Your Details</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="flex flex-col gap-1.5 sm:col-span-2 items-center mb-2">
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      const newPhoto = e.target.result;
                      setPreviewPhoto(newPhoto);
                      if (onUpdateUser) {
                        onUpdateUser({ ...user, photo: newPhoto });
                      }
                      triggerToast("Profile photo updated everywhere!");
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md group">
                <img src={previewPhoto || galleryPhotos[0]} alt="Profile" className="w-full h-full object-cover" />
                <div onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>photo_camera</span>
                </div>
              </div>
              <button onClick={() => fileInputRef.current?.click()} className="text-xs font-bold text-pink-600 hover:text-pink-700 mt-1 cursor-pointer">
                Change Profile Photo
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Name</label>
              <input type="text" name="name" defaultValue={user.name} placeholder="Enter your full name..." className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-pink-500/30 outline-none text-slate-800 font-medium" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Age</label>
              <input type="number" name="age" defaultValue={user.age} placeholder="Enter your age (e.g. 28)..." className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-pink-500/30 outline-none text-slate-800 font-medium" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Location</label>
              <input type="text" name="location" defaultValue={user.location} placeholder="Enter your location (e.g. Brooklyn, NY)..." className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-pink-500/30 outline-none text-slate-800 font-medium" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Profession</label>
              <input type="text" name="profession" defaultValue={user.profession} placeholder="Enter your profession (e.g. Architect)..." className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-pink-500/30 outline-none text-slate-800 font-medium" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Phone Number</label>
              <input type="tel" name="phone" defaultValue={user.phone || "+1 (555) 000-0000"} placeholder="Enter your phone number..." className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-pink-500/30 outline-none text-slate-800 font-medium" />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700">Connection Intent</label>
              <select name="intent" defaultValue={user.intent} className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-pink-500/30 outline-none bg-white text-slate-800 font-medium cursor-pointer">
                <option>Slow Romance</option>
                <option>Deep Talks</option>
                <option>Creative Spark</option>
                <option>Long-term Partner</option>
                <option>Casual Connections</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700">Bio</label>
              <textarea name="bio" rows="4" defaultValue={user.bio} placeholder="Enter your bio or tell us about yourself..." className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-pink-500/30 outline-none text-slate-800 font-medium"></textarea>
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700">Interests (comma separated)</label>
              <input type="text" name="interests" defaultValue={user.interests.join(', ')} placeholder="Enter interests separated by commas (e.g. Art, Coffee, Music)..." className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-pink-500/30 outline-none text-slate-800 font-medium" />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => setActiveTab('profile')} className="px-6 py-2.5 rounded-full font-bold text-sm text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2.5 rounded-full font-extrabold text-sm bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-95 text-white shadow-md cursor-pointer flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">save</span>
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      )}

    </div>
  );
}
