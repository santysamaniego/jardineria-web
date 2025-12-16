import React from 'react';
import { Instagram, MapPin, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Footer = () => {
  const { navigateTo } = useApp();
  
  return (
    <footer className="bg-jungle-950 text-jungle-100 border-t border-jungle-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-serif text-white mb-4">Los Hermanos</h3>
            <p className="text-sm opacity-80 mb-4 max-w-sm">
              Transformando espacios verdes en Ramos Mejía y alrededores. 
              Pasión por la naturaleza y el diseño sustentable.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com/jardineriaseverino" target="_blank" className="text-gray-400 hover:text-pink-500 transition-colors flex items-center gap-2">
                <Instagram size={24} /> @jardineriaseverino
              </a>
            </div>
          </div>
          
          <div className="md:text-right">
            <h4 className="text-lg font-bold text-white mb-4 uppercase tracking-wider">Contacto</h4>
            <ul className="space-y-3 text-sm inline-block text-left">
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-jungle-500" />
                <span>Ramos Mejía, Buenos Aires</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-jungle-500" />
                <span>+54 9 11 4087-2286 (Lucas)</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-jungle-900 text-center text-xs opacity-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} Los Hermanos Jardinería. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;