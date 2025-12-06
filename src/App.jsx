import React, { useState, useEffect } from 'react';
import { Heart, Wind, Ghost, Sparkles, ArrowDown } from 'lucide-react';

const BlobbySpace = () => {
  const [scrolled, setScrolled] = useState(false);
  const [hugCount, setHugCount] = useState(0);
  const [isHugging, setIsHugging] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle hug interaction
  const giveHug = () => {
    setIsHugging(true);
    setHugCount(prev => prev + 1);
    setTimeout(() => setIsHugging(false), 800);
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white overflow-x-hidden">
      {/* Google Fonts Import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand&family=Quicksand:wght@300;400;600&display=swap');
        
        .font-hand { fontFamily: 'Patrick Hand', cursive; }
        .font-body { fontFamily: 'Quicksand', sans-serif; }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-breathe { animation: breathe 4s ease-in-out infinite; }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #fff; }
        ::-webkit-scrollbar-thumb { background: #000; border-radius: 4px; }
      `}</style>

      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-sm border-b border-black py-4' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Ghost className="w-6 h-6" />
            <span className="font-hand text-2xl tracking-wide">blobby.house</span>
          </div>
          <a 
            href="https://instagram.com/blobby.house" 
            target="_blank" 
            rel="noreferrer"
            className="font-body text-sm font-semibold hover:underline decoration-2 underline-offset-4"
          >
            Visit Instagram
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center relative px-4 pt-20">
        <div className="max-w-3xl w-full text-center relative z-10">
          
          {/* Main Blobby SVG */}
          <div 
            className={`w-64 h-64 mx-auto mb-8 transition-transform duration-500 cursor-pointer ${isHugging ? 'scale-90' : 'animate-float'}`}
            onClick={giveHug}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
              {/* Body */}
              <path 
                d="M40,100 C40,40 60,10 100,10 C140,10 160,40 160,100 C160,150 160,160 160,170 C160,185 140,190 130,175 C120,160 110,185 100,185 C90,185 80,160 70,175 C60,190 40,185 40,170 C40,160 40,150 40,100 Z" 
                fill="white" 
                stroke="black" 
                strokeWidth="4"
              />
              {/* Eyes */}
              <circle cx="75" cy="80" r="10" fill="black" />
              <circle cx="125" cy="80" r="10" fill="black" />
              {/* Shine in eyes */}
              <circle cx="78" cy="77" r="3" fill="white" />
              <circle cx="128" cy="77" r="3" fill="white" />
              
              {/* Blush (Visible on Hug) */}
              <circle cx="65" cy="100" r="8" fill="#e5e5e5" className={`transition-opacity duration-300 ${isHugging ? 'opacity-100' : 'opacity-0'}`} />
              <circle cx="135" cy="100" r="8" fill="#e5e5e5" className={`transition-opacity duration-300 ${isHugging ? 'opacity-100' : 'opacity-0'}`} />

              {/* Mouth */}
              <path 
                d={isHugging ? "M85,110 Q100,125 115,110" : "M90,110 Q100,115 110,110"} 
                fill="none" 
                stroke="black" 
                strokeWidth="3" 
                strokeLinecap="round"
                className="transition-all duration-300"
              />
              
              {/* Arms (Little nubs) */}
              <path d="M40,110 Q20,100 30,80" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" className={isHugging ? "hidden" : "block"} />
              <path d="M160,110 Q180,100 170,80" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" className={isHugging ? "hidden" : "block"} />
              
              {/* Hugging Arms */}
              <path d="M40,110 Q60,130 90,120" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" className={isHugging ? "block" : "hidden"} />
              <path d="M160,110 Q140,130 110,120" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" className={isHugging ? "block" : "hidden"} />
            </svg>
            
            {/* Pop up hearts when hugging */}
            {isHugging && (
              <>
                <Heart className="absolute top-0 right-10 w-6 h-6 text-black fill-black animate-bounce" style={{ animationDuration: '0.5s' }} />
                <Heart className="absolute top-10 left-0 w-4 h-4 text-black fill-black animate-bounce" style={{ animationDuration: '0.7s' }} />
              </>
            )}
          </div>

          <h1 className="font-hand text-5xl md:text-7xl mb-4 text-black">
            Hi, I'm Blobby.
          </h1>
          <p className="font-body text-xl md:text-2xl text-gray-600 font-light max-w-lg mx-auto leading-relaxed">
            Your ghost friend. It's okay to feel heavy sometimes. 
            I'm here to help you float.
          </p>

          <div className="mt-12 flex flex-col items-center gap-4">
            <button 
              onClick={giveHug}
              className="group relative px-8 py-3 bg-black text-white font-body rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span className="relative flex items-center gap-2">
                <Heart className={`w-4 h-4 ${isHugging ? 'fill-white' : ''}`} />
                {isHugging ? "Hugging..." : "Send a Hug"}
              </span>
            </button>
            <p className="font-hand text-gray-400 text-sm">
              {hugCount > 0 ? `${hugCount} hugs shared today` : "Click Blobby or the button"}
            </p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 animate-bounce">
          <ArrowDown className="w-6 h-6 text-gray-300" />
        </div>
      </section>

      {/* Mental Check-in Section */}
      <section className="py-24 px-4 bg-gray-50 border-y border-black/5">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="font-hand text-4xl mb-6">Feeling the pressure to be perfect?</h2>
              <p className="font-body text-lg text-gray-700 leading-loose">
                The world moves so fast, doesn't it? It's easy to feel like you're falling behind. 
                But here's a secret: <span className="font-bold border-b-2 border-black/10">You don't have to be everything for everyone.</span>
              </p>
              <p className="font-body text-lg text-gray-700 leading-loose">
                You are allowed to just exist. To be messy. To be unfinished. 
                Like a sketch in a notebook, you're a work in progress, and that's beautiful.
              </p>
            </div>
            
            {/* Note Card Visual */}
            <div className="bg-white p-8 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="flex justify-between items-start mb-4">
                <Sparkles className="w-6 h-6" />
                <span className="font-hand text-gray-400">Note to self</span>
              </div>
              <p className="font-hand text-3xl leading-normal text-center py-8">
                "It's okay to restart. <br/>
                It's okay to rest. <br/>
                It's okay to not be okay."
              </p>
              <div className="w-full h-px bg-black/10 mt-4"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Breathing Exercise Section */}
      <section className="py-32 px-4 flex flex-col items-center justify-center text-center overflow-hidden relative">
        {/* Background decorative elements */}
        <Wind className="absolute top-20 left-10 w-24 h-24 text-gray-100 rotate-12" />
        <Wind className="absolute bottom-20 right-10 w-32 h-32 text-gray-100 -rotate-12" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="w-48 h-48 border-4 border-black rounded-full mx-auto mb-10 flex items-center justify-center animate-breathe">
            <div className="text-center">
              <span className="font-body text-sm uppercase tracking-widest block mb-1">Just</span>
              <span className="font-hand text-4xl">Breathe</span>
            </div>
          </div>
          
          <h2 className="font-body text-2xl font-light mb-4">Let it all go.</h2>
          <p className="font-body text-gray-600 max-w-md mx-auto">
            Take a deep breath in... hold it... and let it out. 
            Whatever is weighing on your heart today, imagine it floating away like a cloud.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <Ghost className="w-8 h-8 mx-auto mb-4 animate-float" />
          <p className="font-hand text-2xl mb-6">Comes from your heart.</p>
          
          <div className="flex justify-center gap-6 font-body text-sm text-gray-400 mb-8">
            <a href="#" className="hover:text-white transition-colors">About Blobby</a>
            <a href="#" className="hover:text-white transition-colors">Merch</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
          
          <p className="text-xs text-gray-600 font-body">
            © {new Date().getFullYear()} Blobby House. Made with <Heart className="w-3 h-3 inline fill-gray-600 mx-1" /> for ghosts everywhere.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default BlobbySpace;