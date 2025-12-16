import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Eye, EyeOff, User, Mail, Lock, Check } from 'lucide-react';

const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, login, register } = useApp();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register State
  const [regName, setRegName] = useState('');
  const [regSurname, setRegSurname] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regConfirmPass, setRegConfirmPass] = useState('');
  const [showRegPass, setShowRegPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [regError, setRegError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const success = login(loginEmail, loginPass);
    if (!success) {
      setLoginError('Credenciales incorrectas. Verificá tu mail y contraseña.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    
    if (regPass !== regConfirmPass) {
      setRegError('Las contraseñas no coinciden.');
      return;
    }
    if (regPass.length < 6) {
        setRegError('La contraseña debe tener al menos 6 caracteres.');
        return;
    }

    const success = register({
      name: regName,
      surname: regSurname,
      email: regEmail,
      password: regPass
    });

    if (!success) {
      setRegError('Este email ya está registrado.');
    }
  };

  const inputClass = "w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-jungle-500 focus:border-transparent outline-none transition-all";

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={closeAuthModal}>
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative animate-scale-in" onClick={e => e.stopPropagation()}>
        
        <button onClick={closeAuthModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
          <X size={24} />
        </button>

        {/* Header Tabs */}
        <div className="flex border-b border-gray-100">
          <button 
            onClick={() => setActiveTab('login')} 
            className={`flex-1 py-4 font-bold text-center transition-colors ${activeTab === 'login' ? 'text-jungle-700 bg-jungle-50' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Iniciar Sesión
          </button>
          <button 
            onClick={() => setActiveTab('register')} 
            className={`flex-1 py-4 font-bold text-center transition-colors ${activeTab === 'register' ? 'text-jungle-700 bg-jungle-50' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Registrarse
          </button>
        </div>

        <div className="p-8">
          <div className="flex justify-center mb-6">
             <div className="bg-jungle-100 p-4 rounded-full">
                <User size={32} className="text-jungle-600" />
             </div>
          </div>
          
          <h2 className="text-2xl font-serif text-center font-bold text-jungle-900 mb-6">
            {activeTab === 'login' ? '¡Hola de nuevo!' : 'Crear Cuenta'}
          </h2>

          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <input 
                  type="email" 
                  placeholder="Email" 
                  className={inputClass}
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <input 
                  type={showLoginPass ? "text" : "password"} 
                  placeholder="Contraseña" 
                  className={inputClass}
                  value={loginPass}
                  onChange={e => setLoginPass(e.target.value)}
                  required 
                />
                <button type="button" onClick={() => setShowLoginPass(!showLoginPass)} className="absolute right-3 top-3.5 text-gray-400 hover:text-jungle-600">
                  {showLoginPass ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
              
              {loginError && <p className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded-lg">{loginError}</p>}

              <button type="submit" className="w-full bg-jungle-600 hover:bg-jungle-700 text-white font-bold py-3 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5">
                Ingresar
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="flex gap-4">
                <div className="relative flex-1">
                    <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                    <input type="text" placeholder="Nombre" className={inputClass} value={regName} onChange={e => setRegName(e.target.value)} required />
                </div>
                <div className="relative flex-1">
                    <input type="text" placeholder="Apellido" className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none`} value={regSurname} onChange={e => setRegSurname(e.target.value)} required />
                </div>
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <input type="email" placeholder="Email" className={inputClass} value={regEmail} onChange={e => setRegEmail(e.target.value)} required />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <input 
                  type={showRegPass ? "text" : "password"} 
                  placeholder="Contraseña" 
                  className={inputClass}
                  value={regPass} 
                  onChange={e => setRegPass(e.target.value)}
                  required 
                />
                <button type="button" onClick={() => setShowRegPass(!showRegPass)} className="absolute right-3 top-3.5 text-gray-400 hover:text-jungle-600">
                  {showRegPass ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <input 
                  type={showConfirmPass ? "text" : "password"} 
                  placeholder="Confirmar Contraseña" 
                  className={inputClass}
                  value={regConfirmPass}
                  onChange={e => setRegConfirmPass(e.target.value)}
                  required 
                />
                 <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-3 top-3.5 text-gray-400 hover:text-jungle-600">
                  {showConfirmPass ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>

              {regError && <p className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded-lg">{regError}</p>}

              <button type="submit" className="w-full bg-jungle-600 hover:bg-jungle-700 text-white font-bold py-3 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5">
                Crear Cuenta
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;