import React, { useMemo } from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';

const HomeServices = () => {
  const { navigateTo, projects } = useApp();
  
  // Filter only visible AND featured projects, slice to max 5.
  // Ensure we display at least 3 if available, up to 5.
  const featuredProjects = useMemo(() => 
    projects.filter(p => p.isVisible && p.isFeatured).slice(0, 5), 
  [projects]);

  if (featuredProjects.length === 0) return null;

  return (
    <section className="py-24 bg-jungle-50 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 mb-4 bg-white px-4 py-1 rounded-full border border-jungle-200 shadow-sm">
              <Star className="text-jungle-600" size={14} fill="currentColor" />
              <span className="text-jungle-800 font-bold tracking-widest uppercase text-xs">Portfolio Seleccionado</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-serif text-jungle-900 mb-6">Trabajos Destacados</h2>
          <p className="text-stone-600 font-light max-w-2xl mx-auto text-lg">
              Cada jardín es un lienzo vivo. A continuación, una selección de intervenciones donde la naturaleza y el diseño conversan en armonía.
          </p>
      </div>

      {/* EDITORIAL LAYOUT (Vertical Magazine Style) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
        {featuredProjects.map((project, index) => {
            const isEven = index % 2 === 0;
            return (
                <div key={project.id} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-24 group`}>
                    
                    {/* Image Section */}
                    <div className="w-full lg:w-3/5 relative cursor-pointer" onClick={() => navigateTo('/services')}>
                        <div className="relative aspect-[4/3] overflow-hidden rounded-sm shadow-2xl transition-transform duration-700 hover:shadow-3xl">
                             <img 
                                src={project.afterImage} 
                                alt={project.title} 
                                className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-105"
                             />
                             <div className="absolute inset-0 ring-1 ring-black/5 pointer-events-none"></div>
                             {/* Mobile Click Hint Overlay (Optional, but helps UX) */}
                             <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                        {/* Decorative number */}
                        <div className={`absolute -top-12 ${isEven ? '-left-12' : '-right-12'} text-[8rem] md:text-[10rem] font-serif text-jungle-200/50 pointer-events-none -z-10`}>
                            0{index + 1}
                        </div>
                    </div>

                    {/* Text Section */}
                    <div className="w-full lg:w-2/5 text-center lg:text-left">
                        <span className="text-jungle-600 font-bold uppercase tracking-widest text-xs mb-3 block">
                            {project.tags.join(' • ')}
                        </span>
                        <h3 className="text-3xl md:text-4xl font-serif text-stone-900 mb-6 group-hover:text-jungle-700 transition-colors cursor-pointer" onClick={() => navigateTo('/services')}>
                            {project.title}
                        </h3>
                        <div className="w-12 h-1 bg-jungle-500 mb-6 mx-auto lg:mx-0 transition-all duration-500 group-hover:w-24"></div>
                        <p className="text-stone-600 leading-relaxed text-lg mb-8 font-light">
                            {project.description}
                        </p>
                        <button 
                            onClick={() => navigateTo('/services')} 
                            className="inline-flex items-center gap-2 text-stone-900 font-bold hover:text-jungle-600 transition-colors border-b border-stone-300 pb-1 hover:border-jungle-600"
                        >
                            Explorar Proyecto <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            );
        })}
      </div>

      <div className="text-center mt-32">
          <button 
            onClick={() => navigateTo('/services')}
            className="bg-jungle-900 text-white px-10 py-4 rounded-full font-bold hover:bg-jungle-700 transition-colors shadow-xl"
          >
              Ver Galería Completa
          </button>
      </div>
    </section>
  );
};

export default HomeServices;