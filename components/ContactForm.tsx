import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Send, MapPin, CheckCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid'; // We don't have uuid lib, use simple random
const generateId = () => Math.random().toString(36).substr(2, 9);

const ContactForm = () => {
  const { addServiceRequest } = useApp();
  const [formData, setFormData] = useState({
    clientName: '',
    phoneNumber: '',
    hasWhatsapp: true,
    zone: '',
    serviceType: 'Mantenimiento',
    description: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRequest = {
      id: generateId(),
      ...formData,
      date: new Date().toISOString(),
      status: 'pending' as const
    };
    addServiceRequest(newRequest);
    setSubmitted(true);
    setFormData({
        clientName: '',
        phoneNumber: '',
        hasWhatsapp: true,
        zone: '',
        serviceType: 'Mantenimiento',
        description: ''
    });
  };

  if (submitted) {
    return (
      <div className="bg-jungle-50 rounded-3xl p-8 text-center border border-jungle-200 shadow-xl max-w-xl mx-auto my-12 animate-fade-in">
        <div className="w-16 h-16 bg-jungle-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="text-jungle-600 w-8 h-8" />
        </div>
        <h3 className="text-2xl font-serif text-jungle-900 mb-2">¡Solicitud Enviada!</h3>
        <p className="text-gray-600 mb-6">
          Gracias por contactarnos. Analizaremos tu solicitud y te contactaremos a la brevedad para coordinar la visita.
        </p>
        <button onClick={() => setSubmitted(false)} className="text-jungle-600 font-bold underline">
          Enviar otra consulta
        </button>
      </div>
    );
  }

  return (
    <section className="py-16 px-4 bg-white" id="contratar">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-serif text-jungle-900">Contratar Servicio</h2>
          <p className="text-gray-500 mt-2">Déjanos tus datos. Realizamos visitas sin cargo en Ramos Mejía.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-2xl rounded-[2rem] p-8 md:p-12 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nombre Completo</label>
              <input
                required
                type="text"
                value={formData.clientName}
                onChange={e => setFormData({...formData, clientName: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-jungle-500 focus:border-transparent outline-none transition-all"
                placeholder="Ej: Juan Pérez"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Teléfono / Celular</label>
              <input
                required
                type="tel"
                value={formData.phoneNumber}
                onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-jungle-500 focus:border-transparent outline-none transition-all"
                placeholder="Sin 0 y sin 15"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mb-6">
             <input 
                type="checkbox" 
                id="hasWhatsapp"
                checked={formData.hasWhatsapp}
                onChange={e => setFormData({...formData, hasWhatsapp: e.target.checked})}
                className="w-5 h-5 text-jungle-600 rounded focus:ring-jungle-500"
             />
             <label htmlFor="hasWhatsapp" className="text-sm text-gray-600">Este número tiene WhatsApp (Importante para contactarte rápido)</label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Zona / Barrio</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <input
                  required
                  type="text"
                  value={formData.zone}
                  onChange={e => setFormData({...formData, zone: e.target.value})}
                  className="w-full pl-10 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-jungle-500 outline-none"
                  placeholder="Ej: Ramos Mejía Centro"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Tipo de Trabajo</label>
              <select
                value={formData.serviceType}
                onChange={e => setFormData({...formData, serviceType: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-jungle-500 outline-none"
              >
                <option value="Mantenimiento">Mantenimiento General</option>
                <option value="Poda">Poda de Altura / Correctiva</option>
                <option value="Paisajismo">Diseño y Paisajismo</option>
                <option value="Riego">Sistema de Riego</option>
                <option value="Vertical">Jardín Vertical</option>
                <option value="Otro">Otro / Consulta</option>
              </select>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 mb-2">Detalle del trabajo</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-jungle-500 outline-none resize-none"
              placeholder="Describí brevemente qué necesitas..."
            />
          </div>

          <button type="submit" className="w-full bg-jungle-600 hover:bg-jungle-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
            <Send size={20} />
            Solicitar Presupuesto / Visita
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;