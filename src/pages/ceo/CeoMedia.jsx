import React, { useState } from 'react';
import { Search, Play, Volume2, Video, FileText, Download, AudioLines } from 'lucide-react';
import { mediaArticles } from './CeoMockData';

const CeoMedia = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  
  // Media playback simulator states
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [playingVideoId, setPlayingVideoId] = useState(null);

  const filters = ['All', 'Press Release', 'Speech', 'Interview'];

  const filteredArticles = mediaArticles.filter(art => {
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          art.snippet.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || art.type.toLowerCase().includes(activeFilter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  const toggleAudio = (id) => {
    if (playingAudioId === id) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(id);
      setPlayingVideoId(null); // Stop video if audio starts
    }
  };

  const toggleVideo = (id) => {
    if (playingVideoId === id) {
      setPlayingVideoId(null);
    } else {
      setPlayingVideoId(id);
      setPlayingAudioId(null); // Stop audio if video starts
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-widest font-bold text-ceo-gold">Newsroom</span>
        <h1 className="text-3xl md:text-4xl font-serif text-white font-bold">Media Center</h1>
        <p className="text-xs text-slate-400">Search press releases, read executive speech transcripts, and review media broadcasts.</p>
      </div>

      {/* Search & Filter Bar */}
      <section className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-905 bg-slate-900 border border-slate-805 p-4 rounded-2xl shadow-md">
        
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
          <input
            type="text"
            placeholder="Search updates, keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-550 focus:outline-none focus:border-ceo-gold/60 focus:ring-0"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {filters.map((f, idx) => (
            <button
              key={idx}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
                activeFilter === f
                  ? 'bg-ceo-gold border-ceo-gold text-ceo-navy'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
              }`}
            >
              {f}s
            </button>
          ))}
        </div>

      </section>

      {/* Grid of Articles */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((art) => (
            <div 
              key={art.id} 
              className="bg-slate-900 border border-slate-805 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden"
            >
              <div className="space-y-4">
                
                {/* Meta details */}
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  <span className="text-ceo-gold bg-ceo-gold/10 px-2 py-0.5 rounded border border-ceo-gold/20">
                    {art.type}
                  </span>
                  <span>{art.date} | {art.readTime} Read</span>
                </div>

                <h3 className="text-base font-serif text-white font-semibold leading-snug">
                  {art.title}
                </h3>
                
                <p className="text-xs text-slate-350 leading-relaxed">
                  {art.snippet}
                </p>

                {/* Simulated Audio Stream Transcripts */}
                {art.audioUrl && (
                  <div className="p-4 bg-slate-950 border border-slate-855 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
                        <Volume2 size={16} className="text-ceo-gold animate-pulse" /> Audio Broadcast
                      </span>
                      <button 
                        onClick={() => toggleAudio(art.id)}
                        className="text-[10px] font-bold text-ceo-gold hover:underline flex items-center gap-1"
                      >
                        {playingAudioId === art.id ? "Pause Stream" : "Listen Stream"}
                      </button>
                    </div>
                    {playingAudioId === art.id && (
                      <div className="space-y-2">
                        <audio src={art.audioUrl} controls className="w-full h-8" autoPlay />
                        <div className="flex items-center gap-1 justify-center text-[10px] text-slate-500">
                          <AudioLines size={12} /> Playback streaming from soundhelix archives
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Simulated Video Players */}
                {art.videoUrl && (
                  <div className="p-4 bg-slate-950 border border-slate-855 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
                        <Video size={16} className="text-ceo-gold" /> Keynote Video Record
                      </span>
                      <button 
                        onClick={() => toggleVideo(art.id)}
                        className="text-[10px] font-bold text-ceo-gold hover:underline"
                      >
                        {playingVideoId === art.id ? "Close Player" : "Open Player"}
                      </button>
                    </div>
                    {playingVideoId === art.id && (
                      <div className="aspect-video w-full rounded-lg overflow-hidden bg-black border border-slate-800">
                        <video src={art.videoUrl} controls className="w-full h-full" autoPlay />
                      </div>
                    )}
                  </div>
                )}

                {/* Full text preview */}
                <div className="pt-4 border-t border-slate-800/80 mt-4 text-xs text-slate-400 leading-relaxed font-sans max-h-48 overflow-y-auto">
                  {art.content}
                </div>

              </div>

              <div className="pt-6 mt-6 border-t border-slate-800/60 flex justify-between items-center text-[10px] text-slate-500">
                <span>Verification ID: MN-2026-PR{art.id}</span>
                <button className="flex items-center gap-1 text-slate-300 hover:text-ceo-gold">
                  <Download size={12} /> Speeches Transcript
                </button>
              </div>

            </div>
          ))
        ) : (
          <div className="col-span-2 text-center py-16 text-slate-500 border border-slate-800 rounded-3xl bg-slate-900/50">
            <p>No announcements found matching "{searchQuery}"</p>
          </div>
        )}
      </section>

    </div>
  );
};

export default CeoMedia;
