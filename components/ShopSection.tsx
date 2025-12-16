import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { Search, SlidersHorizontal, ShoppingBag, Plus, Filter, ImageOff } from 'lucide-react';

const VineCardAccent = () => (
    <svg className="absolute -top-2 -left-2 w-16 h-16 pointer-events-none z-20 text-jungle-500" viewBox="0 0 50 50">
        <path d="M0,50 Q0,20 20,10 Q40,0 50,0" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10,25 C0,25 -5,35 5,40 C15,35 15,25 10,25 Z" fill="#69A96E" />
        <path d="M25,10 C15,10 10,0 20,-5 C30,0 30,10 25,10 Z" fill="#4F8A55" />
    </svg>
);

const ShopSection = () => {
  const { products, addToCart, isShopEnabled, navigateTo } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'price-asc' | 'price-desc'>('asc');

  const filteredProducts = useMemo(() => {
    // Filter visible items
    let result = products.filter(p => p.isVisible);

    // Search
    if (searchTerm) {
      result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // Category
    if (activeCategory !== 'all') {
      result = result.filter(p => p.category === activeCategory);
    }

    // Sort
    result.sort((a, b) => {
      if (sortOrder === 'asc') return a.name.localeCompare(b.name);
      if (sortOrder === 'desc') return b.name.localeCompare(a.name);
      if (sortOrder === 'price-asc') return a.price - b.price;
      if (sortOrder === 'price-desc') return b.price - a.price;
      return 0;
    });

    return result;
  }, [products, searchTerm, activeCategory, sortOrder]);

  // Derive categories from available visible products
  const categories = Array.from(new Set(products.filter(p => p.isVisible).map(p => p.category)));

  if (!isShopEnabled) {
      return (
          <section className="min-h-screen bg-[#f7f5f2] py-20 flex items-center justify-center">
              <div className="text-center max-w-lg px-6">
                  <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100">
                      <ShoppingBag size={64} className="mx-auto text-gray-300 mb-6" />
                      <h1 className="text-3xl font-serif text-jungle-900 mb-4">Tienda no disponible</h1>
                      <p className="text-gray-500 mb-8">
                          Nuestra tienda online se encuentra temporalmente deshabilitada. 
                          <br />
                          Estamos trabajando para ofrecerte una mejor experiencia.
                      </p>
                      <button 
                          onClick={() => navigateTo('/')}
                          className="bg-jungle-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-jungle-700 transition-colors"
                      >
                          Volver al Inicio
                      </button>
                  </div>
              </div>
          </section>
      );
  }

  return (
    <section className="min-h-screen bg-[#f7f5f2] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Shop */}
        <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-6xl font-serif text-jungle-900 mb-4">Tienda Los Hermanos</h1>
            <p className="text-gray-500 max-w-2xl mx-auto">Productos seleccionados para el cuidado integral de tu jardín. Desde plantas exóticas hasta las mejores herramientas.</p>
        </div>

        {/* Controls Toolbar */}
        <div className="bg-white rounded-[2rem] p-4 shadow-lg mb-12 flex flex-col lg:flex-row items-center justify-between gap-4 sticky top-24 z-30 border border-gray-100">
          
          {/* Search */}
          <div className="relative w-full lg:w-1/3">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Buscar plantas, macetas..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-jungle-300 transition-all"
            />
          </div>

          {/* Filters Group */}
          <div className="flex flex-wrap items-center justify-center gap-2 w-full lg:w-auto">
            <button 
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${activeCategory === 'all' ? 'bg-jungle-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
                Todo
            </button>
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${activeCategory === cat ? 'bg-jungle-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
            <SlidersHorizontal size={18} className="text-gray-400" />
            <select 
              className="bg-transparent font-bold text-gray-700 focus:outline-none cursor-pointer"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
            >
              <option value="asc">A - Z</option>
              <option value="desc">Z - A</option>
              <option value="price-asc">Precio: Menor</option>
              <option value="price-desc">Precio: Mayor</option>
            </select>
          </div>
        </div>

        {/* Product Grid - Creative "Shelf" Layout */}
        {filteredProducts.length === 0 ? (
            <div className="text-center py-20 opacity-50">
                <Filter size={48} className="mx-auto mb-4" />
                <p>No se encontraron productos con esos filtros.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
                <div key={product.id} className="group relative bg-white organic-card shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border-b-4 border-jungle-100 hover:border-jungle-500">
                    <VineCardAccent />
                    
                    {/* Image Area */}
                    <div className="h-64 relative overflow-hidden rounded-t-[2rem] bg-gray-100">
                        <img 
                        src={product.images[0]} 
                        alt={product.name} 
                        onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=400&q=80'; // Fallback
                            e.currentTarget.className = "w-full h-full object-cover grayscale opacity-50"; // Style fallback differently
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-jungle-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm z-30">
                            {product.category}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-6 flex-grow flex flex-col relative z-20 bg-white rounded-b-[1rem]">
                        {/* Price Tag styling */}
                        <div className="mb-2">
                             <span className="text-2xl font-serif text-jungle-900 font-bold">${product.price.toLocaleString()}</span>
                        </div>
                        
                        <h3 className="text-lg font-bold text-gray-800 leading-tight mb-2 group-hover:text-jungle-700 transition-colors">{product.name}</h3>
                        
                        <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-grow font-light">
                            {product.description}
                        </p>

                        {/* Action Button */}
                        <button 
                            onClick={() => addToCart(product)}
                            className="w-full bg-jungle-50 hover:bg-jungle-600 hover:text-white text-jungle-700 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 group-hover:shadow-lg border border-jungle-100 hover:border-transparent"
                        >
                            <Plus size={18} />
                            <span>Agregar al Carrito</span>
                        </button>
                    </div>
                </div>
            ))}
            </div>
        )}
      </div>
    </section>
  );
};

export default ShopSection;