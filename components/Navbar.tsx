import React, { useState } from 'react';
import { Menu, X, ShoppingCart, Leaf, ShieldCheck, Phone, User, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';

// High Definition Vine Component
const DetailedVine = () => (
  <div className="absolute top-0 w-full flex justify-between pointer-events-none z-[60] overflow-visible h-0">
    {/* Left Detailed Vine - Hanging deep */}
    <svg width="200" height="300" viewBox="0 0 200 300" className="absolute -left-4 -top-4 w-40 md:w-64 animate-sway-slow drop-shadow-xl" style={{ transformOrigin: 'top left' }}>
      {/* Main Stem */}
      <path d="M0,0 C20,50 50,100 30,200 C20,250 40,280 50,300" fill="none" stroke="#2F5233" strokeWidth="3" />
      <path d="M0,0 C40,40 60,10 80,50" fill="none" stroke="#3F6E46" strokeWidth="2" />
      
      {/* Leaves - Ivy Shape */}
      <g transform="translate(30, 60) rotate(10)">
        <path d="M0,0 C-10,-10 -20,5 -10,20 C0,30 10,20 20,10 C10,-10 0,-10 0,0 Z" fill="#4F8A55" />
        <path d="M0,0 L10,10" stroke="#2F5233" strokeWidth="0.5" />
      </g>
      <g transform="translate(50, 120) rotate(-20)">
        <path d="M0,0 C-15,-15 -25,10 -10,25 C0,35 15,25 25,10 C15,-15 0,-15 0,0 Z" fill="#69A96E" />
      </g>
      <g transform="translate(30, 200) rotate(45)">
         <path d="M0,0 C-20,-20 -30,10 -15,30 C0,40 20,30 30,10 C20,-20 0,-20 0,0 Z" fill="#4F8A55" />
      </g>
      {/* Small curly tendrils */}
      <path d="M40,90 Q60,90 60,110" fill="none" stroke="#88C483" strokeWidth="1" />
    </svg>
    
    {/* Right Detailed Vine - Monstera style leaves */}
    <svg width="250" height="350" viewBox="0 0 250 350" className="absolute -right-8 -top-8 w-48 md:w-72 animate-sway drop-shadow-lg" style={{ animationDelay: '1.5s', transformOrigin: 'top right' }}>
       {/* Stems */}
       <path d="M200,0 C180,60 150,120 180,220" fill="none" stroke="#1F3A26" strokeWidth="3" />
       <path d="M200,0 C220,50 240,100 230,150" fill="none" stroke="#2F5233" strokeWidth="2" />

       {/* Big Leaves */}
       <g transform="translate(180, 80) rotate(-15)">
         <path d="M0,0 C-20,-20 -40,20 0,60 C40,20 20,-20 0,0 Z" fill="#3F6E46" />
         <path d="M0,0 L0,55" stroke="#1F3A26" strokeWidth="0.5" />
       </g>
       <g transform="translate(150, 180) rotate(10)">
         <path d="M0,0 C-25,-25 -50,25 0,70 C50,25 25,-25 0,0 Z" fill="#4F8A55" />
       </g>
       <g transform="translate(230, 150) rotate(-30)">
          <path d="M0,0 C-10,-10 -20,10 0,30 C20,10 10,-10 0,0 Z" fill="#88C483" />
       </g>
    </svg>
  </div>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cart, navigateTo, currentPage, toggleCart, currentUser, logout, openAuthModal, isShopEnabled } = useApp();

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Servicios', path: '/services' },
    // Show 'Tienda' only if shop is enabled
    ...(isShopEnabled ? [{ name: 'Tienda', path: '/shop' }] : []),
    { name: 'Contacto', path: '/contact' },
  ];

  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    navigateTo(path);
    setIsOpen(false);
  };

  return (
    <header className="relative">
      <DetailedVine />
      
      <nav className="bg-white/90 backdrop-blur-md text-jungle-900 sticky top-0 z-50 shadow-sm border-b-4 border-jungle-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center z-50">
              <a href="/" onClick={(e) => handleNav(e, '/')} className="flex-shrink-0 flex items-center gap-2 group">
                <div className="bg-jungle-100 p-2 rounded-full border border-jungle-300 group-hover:scale-110 transition-transform">
                  <Leaf className="h-6 w-6 text-jungle-600" />
                </div>
                <div>
                  <span className="font-serif text-xl font-bold tracking-wider block leading-tight text-jungle-900 group-hover:text-jungle-700 transition-colors">LOS HERMANOS</span>
                  <span className="text-xs text-jungle-500 tracking-widest uppercase">Jardinería</span>
                </div>
              </a>
            </div>
            
            <div className="hidden md:block z-50">
              <div className="ml-10 flex items-baseline space-x-8">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.path}
                    onClick={(e) => handleNav(e, link.path)}
                    className={`${
                        currentPage === link.path 
                        ? 'text-jungle-700 font-bold border-b-2 border-jungle-600' 
                        : 'text-gray-500 hover:text-jungle-700'
                    } transition-all duration-300 px-3 py-2 text-sm uppercase tracking-wide cursor-pointer relative group`}
                  >
                    {link.name}
                    <span className="absolute -top-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-jungle-400">
                        <Leaf size={10} fill="currentColor" />
                    </span>
                  </a>
                ))}
                
                {currentUser?.role === 'admin' && (
                  <button onClick={() => navigateTo('/admin')} className="text-yellow-600 hover:text-yellow-700 transition-colors" title="Panel Administrador">
                    <ShieldCheck size={20} />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 z-50">
              {currentUser ? (
                <div className="hidden md:flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-700">Hola, {currentUser.name}</span>
                    <button onClick={logout} className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Cerrar Sesión">
                        <LogOut size={18} />
                    </button>
                </div>
              ) : (
                <button 
                    onClick={openAuthModal}
                    className="hidden md:flex items-center gap-2 text-sm font-bold text-jungle-600 hover:text-jungle-800 transition-colors"
                >
                    <User size={18} /> Ingresar
                </button>
              )}

              {/* Cart Icon - Only show if Shop is enabled */}
              {isShopEnabled && (
                <div className="relative group cursor-pointer" onClick={() => toggleCart(true)}>
                    <ShoppingCart className="h-6 w-6 text-gray-400 group-hover:text-jungle-600 transition-colors" />
                    {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-400 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                        {cart.length}
                    </span>
                    )}
                </div>
              )}

              <div className="-mr-2 flex md:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="bg-jungle-50 inline-flex items-center justify-center p-2 rounded-md text-jungle-600 hover:text-jungle-800 hover:bg-jungle-100 focus:outline-none"
                >
                  {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 absolute w-full z-50 shadow-xl">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  onClick={(e) => handleNav(e, link.path)}
                  className="text-gray-600 hover:text-jungle-600 hover:bg-jungle-50 block px-3 py-2 rounded-md text-base font-medium"
                >
                  {link.name}
                </a>
              ))}
              {currentUser?.role === 'admin' && (
                  <a href="/admin" onClick={(e) => handleNav(e, '/admin')} className="text-yellow-600 block px-3 py-2 font-bold bg-yellow-50 rounded-lg">
                    Panel Admin
                  </a>
              )}
              <div className="border-t border-gray-100 mt-2 pt-2">
                {currentUser ? (
                    <button onClick={logout} className="w-full text-left text-red-500 block px-3 py-2 font-bold">
                        Cerrar Sesión ({currentUser.name})
                    </button>
                ) : (
                    <button onClick={() => { setIsOpen(false); openAuthModal(); }} className="w-full text-left text-jungle-600 block px-3 py-2 font-bold">
                        Iniciar Sesión / Registro
                    </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;