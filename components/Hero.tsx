import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Hero = () => {
  const { navigateTo, heroImages, isShopEnabled } = useApp();
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
        setCurrentImageIdx((prev) => (prev + 1) % heroImages.length);
    }, 6000); // Change image every 6 seconds
    return () => clearInterval(interval);
  }, [heroImages]);

  return (
    <div className="relative bg-jungle-900 overflow-hidden min-h-[85vh] flex items-center justify-center md:justify-start">
      {/* Dynamic Background Carousel */}
      <div className="absolute inset-0 z-0">
         {heroImages.map((img, index) => (
             <div 
                key={index}
                className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${index === currentImageIdx ? 'opacity-100' : 'opacity-0'}`}
             >
                 {/* Ken Burns + Slide Effect Container */}
                 <div className={`w-full h-full relative overflow-hidden ${index === currentImageIdx ? 'animate-ken-burns-slide' : ''}`}>
                    <img 
                        src={img} 
                        alt={`Hero ${index}`} 
                        className="w-full h-full object-cover opacity-80"
                        style={{ transform: 'scale(1.1)' }} // Start slightly zoomed in
                    />
                 </div>
             </div>
         ))}
        {/* Adds a subtle texture overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex justify-center md:justify-start">
        <div className="max-w-[90%] md:max-w-3xl transform transition-all duration-1000 translate-y-0 opacity-100 bg-black/30 backdrop-blur-md p-6 md:p-10 rounded-3xl border border-white/10 shadow-2xl">
          <div className="flex items-center gap-2 mb-4 md:mb-6">
             <span className="h-px w-8 md:w-16 bg-jungle-400"></span>
             <span className="text-jungle-200 uppercase tracking-[0.2em] text-xs md:text-sm font-bold animate-fade-in shadow-sm">Experiencia Premium</span>
          </div>
          
          <h1 className="text-3xl md:text-7xl lg:text-8xl font-serif font-bold text-white leading-[1.1] md:leading-[0.9] mb-4 md:mb-8 relative inline-block drop-shadow-xl">
            Diseño que <br/>
            <span className="text-white italic relative z-10">
              respira vida.
              <svg className="absolute -bottom-2 left-0 w-full h-3 md:h-6 text-jungle-500 pointer-events-none z-[-1] opacity-80" viewBox="0 0 200 20" preserveAspectRatio="none">
                 <path d="M0,10 Q50,20 100,10 T200,10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          
          <p className="text-sm md:text-2xl text-gray-100 mb-6 md:mb-10 font-light leading-relaxed max-w-2xl drop-shadow-md border-l-4 border-jungle-500 pl-4 md:pl-6">
            Especialistas en transformar residencias en oasis naturales. <br className="hidden md:block"/>
            Mantenimiento de precisión y paisajismo de autor en Ramos Mejía.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 md:gap-5">
            <button onClick={() => navigateTo('/contact')} className="group bg-jungle-600 hover:bg-jungle-700 text-white px-6 md:px-10 py-3 md:py-5 rounded-full font-bold transition-all flex items-center justify-center gap-3 shadow-lg hover:-translate-y-1 text-sm md:text-base">
              Iniciar Proyecto
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            {/* Show Store Button only if Shop is Enabled */}
            {isShopEnabled && (
                <button onClick={() => navigateTo('/shop')} className="px-6 md:px-10 py-3 md:py-5 rounded-full font-bold transition-all flex items-center justify-center border border-white hover:bg-white text-white hover:text-jungle-900 text-sm md:text-base">
                Visitar Tienda
                </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Slide Indicators */}
      <div className="absolute bottom-6 md:bottom-10 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
        {heroImages.map((_, idx) => (
            <button 
                key={idx} 
                onClick={() => setCurrentImageIdx(idx)}
                className={`h-1.5 rounded-full transition-all duration-500 shadow-sm ${idx === currentImageIdx ? 'w-8 md:w-12 bg-white' : 'w-3 bg-white/50 hover:bg-white/80'}`} 
            />
        ))}
      </div>

      <style>{`
        @keyframes ken-burns-slide {
            0% { transform: scale(1.1) translateX(0); }
            100% { transform: scale(1.15) translateX(-2%); }
        }
        .animate-ken-burns-slide {
            animation: ken-burns-slide 6s linear forwards;
        }
      `}</style>
    </div>
  );
};

export default Hero;