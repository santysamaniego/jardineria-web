import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ServiceProject } from '../types';
import { ArrowLeftRight, CheckCircle2, Sprout } from 'lucide-react';

const BeforeAfterModal = ({ project, onClose }: { project: ServiceProject; onClose: () => void }) => {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-4 bg-jungle-900 text-white flex justify-between items-center">
          <h3 className="font-serif text-xl">{project.title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">Cerrar</button>
        </div>
        
        <div className="relative w-full h-[300px] md:h-[500px] overflow-hidden group select-none">
          {/* After Image (Base) */}
          <img 
            src={project.afterImage} 
            alt="After" 
            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=800&q=80'; }}
            className="absolute inset-0 w-full h-full object-cover" 
          />
          <div className="absolute top-4 right-4 bg-jungle-600 text-white text-xs px-2 py-1 rounded shadow">DESPUÉS</div>

          {/* Before Image (Overlay clipped) */}
           <div 
            className="absolute inset-0 overflow-hidden border-r-4 border-white shadow-xl"
            style={{ width: `${sliderPosition}%` }}
           >
              <div className="relative w-full h-full">
                  {/* We need to render the image at full parent width but clipped by the parent div */}
                 <img 
                    src={project.beforeImage} 
                    alt="Before" 
                    onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1558293776-805b82834b6e?auto=format&fit=crop&w=800&q=80'; }}
                    className="h-full object-cover max-w-none"
                    style={{ width: '896px' }} // Approximate max width of modal
                 />
              </div>
               <div className="absolute top-4 left-4 bg-gray-700 text-white text-xs px-2 py-1 rounded shadow">ANTES</div>
           </div>


          {/* Slider Control */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPosition}
            onChange={handleSliderChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
          />
          
          {/* Slider Handle Visual */}
          <div 
            className="absolute top-0 bottom-0 w-10 -ml-5 flex items-center justify-center pointer-events-none z-10"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="bg-white p-2 rounded-full shadow-lg text-jungle-800">
              <ArrowLeftRight size={20} />
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 overflow-y-auto">
          <p className="text-gray-700 mb-4 font-light leading-relaxed">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-jungle-100 text-jungle-800 text-xs rounded-full font-bold uppercase">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ServicesSection = () => {
  const { projects } = useApp();
  const [selectedProject, setSelectedProject] = useState<ServiceProject | null>(null);
  
  const visibleProjects = useMemo(() => projects.filter(p => p.isVisible), [projects]);

  const servicesList = [
    "Mantenimiento Integral", "Poda de Altura", "Diseño de Paisaje", 
    "Sistemas de Riego", "Jardines Verticales", "Control de Plagas"
  ];

  return (
    <section className="py-20 bg-jungle-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-jungle-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="text-jungle-600 font-bold tracking-widest uppercase text-sm">Nuestra Experiencia</span>
          <h2 className="text-4xl md:text-5xl font-serif text-jungle-900 mt-2 mb-6">Transformamos Espacios</h2>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {servicesList.map((s) => (
              <div key={s} className="flex items-center gap-2 text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                <CheckCircle2 size={16} className="text-jungle-500" />
                <span className="text-sm font-medium">{s}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleProjects.map((project) => (
            <div key={project.id} className="group bg-white rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={project.afterImage} 
                  alt={project.title} 
                  onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=800&q=80'; }}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                  <button 
                    onClick={() => setSelectedProject(project)}
                    className="bg-white/90 backdrop-blur text-jungle-900 px-6 py-2 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-all flex items-center gap-2 hover:bg-jungle-500 hover:text-white"
                  >
                    <ArrowLeftRight size={16} /> Ver Antes/Después
                  </button>
                </div>
              </div>
              
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-gray-800 mb-2">{project.title}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{project.shortDescription}</p>
                </div>
                <div className="flex items-center text-jungle-600 text-xs font-bold uppercase tracking-wide gap-2 mt-4 border-t pt-4 border-gray-100">
                  <Sprout size={16} />
                  {project.tags[0]}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedProject && (
        <BeforeAfterModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </section>
  );
};

export default ServicesSection;