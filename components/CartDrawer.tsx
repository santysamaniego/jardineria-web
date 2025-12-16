import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, CreditCard, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

const CartDrawer = () => {
  const { isCartOpen, toggleCart, cart, removeFromCart, clearCart, recordSale, paymentConfig } = useApp();
  const [step, setStep] = useState<'items' | 'checkout'>('items');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [orderPlaced, setOrderPlaced] = useState(false);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    // Record sale in admin
    recordSale({
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        items: cart,
        total: total
    });
    setOrderPlaced(true);
  };

  const closeCart = () => {
    toggleCart(false);
    setTimeout(() => {
        setStep('items');
        setOrderPlaced(false);
    }, 300);
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[900] overflow-hidden">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={closeCart}></div>
      
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md transform transition ease-in-out duration-500 sm:duration-700 bg-white shadow-2xl flex flex-col h-full border-l border-jungle-100">
          
          {/* Header */}
          <div className="px-6 py-4 bg-jungle-50 border-b border-jungle-100 flex items-center justify-between">
            <h2 className="text-xl font-serif text-jungle-900 flex items-center gap-2">
              <ShoppingBag size={20} className="text-jungle-500" />
              Tu Carrito
            </h2>
            <button onClick={closeCart} className="text-gray-400 hover:text-jungle-600">
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 relative">
             {/* Background Decoration inside cart */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-jungle-100 rounded-bl-[100px] -z-0 opacity-50"></div>

            {orderPlaced ? (
              <div className="text-center py-10 animate-fade-in z-10 relative">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CreditCard className="text-green-600 w-10 h-10" />
                </div>
                <h3 className="text-2xl font-serif text-jungle-900 mb-2">¡Pedido Iniciado!</h3>
                <p className="text-gray-600 mb-6">
                  Para finalizar tu compra, por favor realizá la transferencia al siguiente alias:
                </p>
                <div className="bg-jungle-50 p-4 rounded-xl border border-jungle-200 mb-6">
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Alias Mercado Pago</p>
                  <p className="text-xl font-bold text-jungle-800 font-mono select-all">{paymentConfig.alias}</p>
                  <p className="text-sm text-jungle-600 mt-2">Titular: {paymentConfig.holderName}</p>
                </div>
                <p className="text-sm text-gray-500 mb-8">
                  Te enviamos un mail a <strong>{formData.email}</strong> con los detalles. <br/>
                  Envianos el comprobante por WhatsApp para coordinar el envío.
                </p>
                <a 
                    href={`https://wa.me/5491140872286?text=Hola,%20ya%20hice%20el%20pago%20de%20mi%20pedido%20de%20$${total}.%20Soy%20${formData.name}.`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => {
                        clearCart();
                        closeCart();
                    }}
                    className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors"
                >
                    Enviar Comprobante (WhatsApp)
                </a>
              </div>
            ) : step === 'items' ? (
              <>
                {cart.length === 0 ? (
                  <div className="text-center py-20 text-gray-400 z-10 relative">
                    <p>Tu carrito está vacío.</p>
                    <button onClick={closeCart} className="mt-4 text-jungle-600 font-bold underline">Volver a la tienda</button>
                  </div>
                ) : (
                  <ul className="space-y-6 z-10 relative">
                    {cart.map((item) => (
                      <li key={item.id} className="flex gap-4 items-center bg-white p-3 rounded-xl shadow-sm border border-gray-50">
                        <img src={item.images[0]} alt={item.name} className="h-16 w-16 w-16 object-cover rounded-lg bg-gray-100" />
                        <div className="flex-1">
                          <h3 className="font-bold text-jungle-900 text-sm">{item.name}</h3>
                          <p className="text-xs text-gray-500">{item.category}</p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-jungle-600 font-bold">${item.price} x {item.quantity}</span>
                            <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 p-1">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4 z-10 relative">
                <button type="button" onClick={() => setStep('items')} className="text-sm text-gray-500 hover:text-jungle-600 mb-4 flex items-center gap-1">
                    ← Volver al carrito
                </button>
                <h3 className="font-serif text-lg text-jungle-900 mb-4">Datos de Contacto</h3>
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre Completo</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-jungle-300 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                  <input 
                    required 
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-jungle-300 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Teléfono</label>
                  <input 
                    required 
                    type="tel" 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-jungle-300 outline-none"
                  />
                </div>
              </form>
            )}
          </div>

          {/* Footer Actions */}
          {!orderPlaced && cart.length > 0 && (
            <div className="p-6 bg-white border-t border-gray-100 z-20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-500">Total</span>
                <span className="text-2xl font-serif font-bold text-jungle-900">${total.toLocaleString()}</span>
              </div>
              
              {step === 'items' ? (
                <button 
                  onClick={() => setStep('checkout')}
                  className="w-full bg-jungle-500 hover:bg-jungle-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  Iniciar Compra <ChevronRight size={20} />
                </button>
              ) : (
                <button 
                  form="checkout-form"
                  type="submit"
                  className="w-full bg-jungle-800 hover:bg-jungle-900 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg"
                >
                  Pagar y Finalizar <CreditCard size={20} />
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartDrawer;