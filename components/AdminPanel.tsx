
import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product, ServiceRequest, ServiceProject, User, Client, ClientLog, Sale, Appointment } from '../types';
import { Trash2, MessageCircle, Check, Eye, EyeOff, Plus, LogOut, CheckCircle, Image as ImageIcon, Edit, X, Search, Filter, Upload, Save, AlertCircle, Settings, AlertTriangle, Users, Star, Layout, ArrowUp, ArrowDown, Calendar, DollarSign, Clock, Briefcase, CreditCard, ChevronLeft, ChevronRight, CalendarCheck, MapPin, ShoppingBag } from 'lucide-react';
import { MOCK_REQUESTS } from '../constants';
import { uploadImageToCloudinary } from '../services/cloudinaryService';

const inputClass = "w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-jungle-500 focus:border-transparent outline-none bg-white transition-all shadow-sm text-gray-700";
const labelClass = "block text-sm font-bold text-gray-600 mb-1 ml-1";

const AdminPanel = () => {
  const { 
    currentUser, logout,
    products, productCategories, addProduct, updateProduct, deleteProduct, addCategory, deleteCategory,
    serviceRequests, addServiceRequest, updateServiceRequestStatus,
    projects, addProject, updateProject, deleteProject,
    users, grantAdminRole,
    heroImages, updateHeroImages,
    clients, addClient, updateClient, deleteClient, addClientLog, updateClientLogStatus,
    appointments, addAppointment, updateAppointment, deleteAppointment,
    sales, paymentConfig, updatePaymentConfig, isShopEnabled, toggleShop
  } = useApp();

  // MOCK_REQUESTS can be ignored in useEffect as we now load from DB
  // But kept logical structure if you want auto-fill mock data for testing

  const [activeTab, setActiveTab] = useState<'agenda' | 'requests' | 'products' | 'projects' | 'users' | 'hero' | 'clients' | 'config'>('agenda');
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);

  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean, type: 'product' | 'project' | 'category' | 'hero' | 'client' | 'appointment', id: string, name?: string }>({
      isOpen: false, type: 'product', id: ''
  });

  // --- PRODUCT STATE ---
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [productVisibilityFilter, setProductVisibilityFilter] = useState<'all' | 'visible' | 'hidden'>('all');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [productForm, setProductForm] = useState<Partial<Product>>({ name: '', category: 'Plantas', price: 0, stock: 0, description: '', images: [], isVisible: true });
  const [isUploading, setIsUploading] = useState(false);

  // --- PROJECT STATE ---
  const [projectSearch, setProjectSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState<'all' | 'featured' | 'recent' | 'Poda' | 'Mantenimiento' | 'Paisajismo'>('all');
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ServiceProject | null>(null);
  const [projectForm, setProjectForm] = useState<Partial<ServiceProject>>({ title: '', shortDescription: '', description: '', beforeImage: '', afterImage: '', tags: [], isVisible: true, isFeatured: false });
  const [projectTagInput, setProjectTagInput] = useState(''); 

  const [userSearch, setUserSearch] = useState('');

  const [clientSearch, setClientSearch] = useState('');
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [clientForm, setClientForm] = useState<Partial<Client>>({ name: '', address: '', zone: '', usualService: '', isRegular: false, lastPrice: 0 });
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logForm, setLogForm] = useState<Partial<ClientLog>>({ date: new Date().toISOString().split('T')[0], hours: 0, amount: 0, description: '', status: 'pending' });

  // --- AGENDA STATE ---
  const [currentDate, setCurrentDate] = useState(new Date());
  // Stores the date currently clicked/focused by the user (YYYY-MM-DD)
  const [focusDate, setFocusDate] = useState(new Date().toISOString().split('T')[0]); 
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState<Partial<Appointment>>({ date: new Date().toISOString().split('T')[0], time: '09:00', clientName: '', description: '', status: 'scheduled' });
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const [configForm, setConfigForm] = useState(paymentConfig);

  // Sync config form when loaded from context
  useEffect(() => {
      setConfigForm(paymentConfig);
  }, [paymentConfig]);

  // --- HELPER FUNCTIONS ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, addTo: 'product' | 'before' | 'after' | 'hero') => {
      const file = e.target.files?.[0];
      if (file) {
          try {
              setIsUploading(true);
              const url = await uploadImageToCloudinary(file);
              
              if (addTo === 'product') {
                  setProductForm(prev => ({ ...prev, images: [...(prev.images || []), url] }));
              } else if (addTo === 'before') {
                  setProjectForm(prev => ({ ...prev, beforeImage: url }));
              } else if (addTo === 'after') {
                  setProjectForm(prev => ({ ...prev, afterImage: url }));
              } else if (addTo === 'hero') {
                  updateHeroImages([...heroImages, url]);
              }
          } catch (error) {
              alert("Error subiendo imagen. Verifica tu configuración de Cloudinary.");
          } finally {
              setIsUploading(false);
          }
      }
      e.target.value = '';
  };

  const removeProductImage = (index: number) => {
      setProductForm(prev => ({ ...prev, images: prev.images?.filter((_, i) => i !== index) }));
  };

  const confirmDelete = (type: 'product' | 'project' | 'category' | 'hero' | 'client' | 'appointment', id: string, name?: string) => {
      setDeleteModal({ isOpen: true, type, id, name });
  };

  const executeDelete = () => {
      if (deleteModal.type === 'product') deleteProduct(deleteModal.id);
      else if (deleteModal.type === 'project') deleteProject(deleteModal.id);
      else if (deleteModal.type === 'category') deleteCategory(deleteModal.id);
      else if (deleteModal.type === 'hero') {
          updateHeroImages(heroImages.filter((_, idx) => idx.toString() !== deleteModal.id));
      } else if (deleteModal.type === 'client') {
          deleteClient(deleteModal.id);
          setSelectedClient(null);
      } else if (deleteModal.type === 'appointment') {
          deleteAppointment(deleteModal.id);
          setSelectedAppointment(null);
      }
      setDeleteModal({ ...deleteModal, isOpen: false });
  };

  const resetProductForm = () => {
      setProductForm({ name: '', category: productCategories[0] || 'Plantas', price: 0, stock: 0, description: '', images: [], isVisible: true });
      setEditingProduct(null);
  };
  const resetProjectForm = () => {
      setProjectForm({ title: '', shortDescription: '', description: '', beforeImage: '', afterImage: '', tags: [], isVisible: true, isFeatured: false });
      setProjectTagInput('');
      setEditingProject(null);
  };
  const resetClientForm = () => {
      setClientForm({ name: '', address: '', zone: '', usualService: '', isRegular: false, lastPrice: 0 });
      setEditingClient(null);
  };
  const resetLogForm = () => {
      setLogForm({ date: new Date().toISOString().split('T')[0], hours: 0, amount: 0, description: '', status: 'pending' });
  };
  const resetAppointmentForm = () => {
      setAppointmentForm({ date: focusDate || new Date().toISOString().split('T')[0], time: '09:00', clientName: '', description: '', status: 'scheduled' });
      setSelectedAppointment(null);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
      e.preventDefault();
      if (!productForm.name || !productForm.price) return;
      // Note: ID handling is done in AppContext for new items
      const productData = { ...productForm, price: Number(productForm.price), stock: Number(productForm.stock), category: productForm.category || 'Varios', images: productForm.images || [], isVisible: productForm.isVisible ?? true } as Product;
      if (editingProduct) updateProduct({ ...productData, id: editingProduct.id });
      else addProduct(productData);
      setIsProductModalOpen(false);
      resetProductForm();
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title) return;
    const tagsArray = projectTagInput.split(',').map(t => t.trim()).filter(t => t !== '');
    const projectData = { ...projectForm, tags: tagsArray.length > 0 ? tagsArray : ['General'], beforeImage: projectForm.beforeImage || '', afterImage: projectForm.afterImage || '', isVisible: projectForm.isVisible ?? true, isFeatured: projectForm.isFeatured ?? false } as ServiceProject;
    
    if (projectData.isFeatured && projects.filter(p => p.isFeatured && p.id !== editingProject?.id).length >= 5) {
        alert("Máximo 5 proyectos destacados permitidos en el inicio.");
        projectData.isFeatured = false;
    }

    if (editingProject) updateProject({ ...projectData, id: editingProject.id });
    else addProject(projectData);
    setIsProjectModalOpen(false);
    resetProjectForm();
  };

  const handleSaveClient = (e: React.FormEvent) => {
      e.preventDefault();
      if (!clientForm.name) return;
      const clientData: Client = {
          id: editingClient ? editingClient.id : '',
          logs: editingClient ? editingClient.logs : [],
          totalEarnings: editingClient ? editingClient.totalEarnings : 0,
          ...clientForm as any
      };
      
      if (editingClient) updateClient(clientData);
      else addClient(clientData);
      
      setIsClientModalOpen(false);
      resetClientForm();
  };

  const handleSaveLog = (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedClient || !logForm.amount) return;
      const newLog: ClientLog = {
          id: Math.random().toString(36).substr(2, 9),
          ...logForm as any
      };
      addClientLog(selectedClient.id, newLog);
      if (newLog.amount > 0) {
          updateClient({...selectedClient, lastPrice: newLog.amount});
      }
      setIsLogModalOpen(false);
      resetLogForm();
      const updatedClient = clients.find(c => c.id === selectedClient.id);
      if(updatedClient) setSelectedClient(updatedClient);
  };

  const handleSaveAppointment = (e: React.FormEvent) => {
      e.preventDefault();
      if (!appointmentForm.clientName || !appointmentForm.date) return;
      
      const aptData: Appointment = {
          id: selectedAppointment ? selectedAppointment.id : '',
          ...appointmentForm as any
      };

      if (selectedAppointment) updateAppointment(aptData);
      else addAppointment(aptData);

      setIsAppointmentModalOpen(false);
      resetAppointmentForm();
  };

  const handleSaveConfig = (e: React.FormEvent) => {
      e.preventDefault();
      updatePaymentConfig(configForm);
      alert('Configuración guardada correctamente.');
  };

  const toggleFeatured = (p: ServiceProject) => {
      if (!p.isFeatured && projects.filter(x => x.isFeatured).length >= 5) {
          alert("Ya hay 5 proyectos destacados. Quita uno para agregar otro.");
          return;
      }
      updateProject({ ...p, isFeatured: !p.isFeatured });
  };
  const openEditProduct = (p: Product) => { setEditingProduct(p); setProductForm(p); setIsProductModalOpen(true); };
  const openEditProject = (p: ServiceProject) => { setEditingProject(p); setProjectForm(p); setProjectTagInput(p.tags.join(', ')); setIsProjectModalOpen(true); };
  const openEditClient = (c: Client) => { setEditingClient(c); setClientForm(c); setIsClientModalOpen(true); };
  const toggleProductVisibility = (p: Product) => updateProduct({ ...p, isVisible: !p.isVisible });
  const toggleProjectVisibility = (p: ServiceProject) => updateProject({ ...p, isVisible: !p.isVisible });
  const moveHeroImage = (index: number, direction: 'up' | 'down') => {
      const newImages = [...heroImages];
      if (direction === 'up' && index > 0) {
          [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]];
      } else if (direction === 'down' && index < newImages.length - 1) {
          [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
      }
      updateHeroImages(newImages);
  };

  const filteredProducts = useMemo(() => {
      if(!products) return [];
      return products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()) && (productCategoryFilter === 'all' || p.category === productCategoryFilter) && (productVisibilityFilter === 'all' ? true : productVisibilityFilter === 'visible' ? p.isVisible : !p.isVisible));
  }, [products, productSearch, productCategoryFilter, productVisibilityFilter]);

  const filteredProjects = useMemo(() => {
      if(!projects) return [];
      let res = projects.filter(p => p.title.toLowerCase().includes(projectSearch.toLowerCase()));
      if (projectFilter === 'featured') res = res.filter(p => p.isFeatured);
      else if (projectFilter === 'recent') res = [...res].reverse();
      else if (projectFilter !== 'all') res = res.filter(p => p.tags.some(t => t.toLowerCase().includes(projectFilter.toLowerCase())));
      return res;
  }, [projects, projectSearch, projectFilter]);

  const filteredUsers = useMemo(() => users.filter(u => u.email.toLowerCase().includes(userSearch.toLowerCase()) || u.name.toLowerCase().includes(userSearch.toLowerCase())), [users, userSearch]);
  const filteredClients = useMemo(() => clients.filter(c => c.name.toLowerCase().includes(clientSearch.toLowerCase()) || c.zone.toLowerCase().includes(clientSearch.toLowerCase())), [clients, clientSearch]);
  const agendaItems = useMemo(() => {
     const allLogs = clients.flatMap(c => c.logs.map(l => ({...l, clientName: c.name, clientZone: c.zone})));
     return allLogs.filter(l => l.status === 'pending').sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [clients]);

  // Calendar Helpers
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay(); // 0 Sun, 1 Mon...

  const calendarDays = useMemo(() => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const daysInMonth = getDaysInMonth(year, month);
      const firstDay = getFirstDayOfMonth(year, month); // 0 is Sunday
      const blanks = Array(firstDay).fill(null);
      const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
      return [...blanks, ...days];
  }, [currentDate]);

  // Derived state for the specific list of appointments for the FOCUSED date
  const focusDateAppointments = useMemo(() => {
      return appointments.filter(a => a.date === focusDate && a.status !== 'cancelled').sort((a,b) => a.time.localeCompare(b.time));
  }, [appointments, focusDate]);

  // Upcoming for the side panel (all future)
  const upcomingAppointments = useMemo(() => {
      return [...appointments].sort((a,b) => {
          const dateA = new Date(`${a.date}T${a.time}`);
          const dateB = new Date(`${b.date}T${b.time}`);
          return dateA.getTime() - dateB.getTime();
      }).filter(a => a.status !== 'cancelled' && new Date(`${a.date}T${a.time}`) >= new Date());
  }, [appointments]);

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full text-center">
            <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Acceso Restringido</h2>
            <button onClick={() => window.location.href='/'} className="bg-jungle-600 text-white px-6 py-2 rounded-lg font-bold">Volver al Inicio</button>
        </div>
      </div>
    );
  }

  const tabs = [
      { id: 'agenda', label: 'Agenda', count: 0, icon: Calendar },
      { id: 'requests', label: 'Solicitudes', count: serviceRequests.filter(r => r.status === 'pending').length, icon: MessageCircle },
      { id: 'clients', label: 'Clientes', count: 0, icon: Briefcase },
      { id: 'products', label: 'Productos', count: 0, icon: ShoppingCartIcon },
      { id: 'projects', label: 'Proyectos', count: 0, icon: ImageIcon },
      { id: 'users', label: 'Usuarios', count: 0, icon: Users },
      { id: 'hero', label: 'Inicio', count: 0, icon: Layout },
      { id: 'config', label: 'Configuración', count: 0, icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl md:text-4xl font-serif text-jungle-900 font-bold">Panel de Control</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm">Hola, {currentUser.name}</span>
            <button onClick={logout} className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-6 py-2 rounded-full border border-red-200 transition-colors font-bold">
                <LogOut size={18} /> <span className="hidden md:inline">Salir</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation - RESPONSIVE */}
        <div>
            {/* Mobile Grid Layout - No Horizontal Scroll */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 md:hidden">
                {tabs.map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                            activeTab === tab.id 
                            ? 'bg-jungle-600 text-white border-jungle-700 shadow-md' 
                            : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50'
                        }`}
                    >
                        <div className="relative">
                            <tab.icon size={20} className="mb-1" />
                            {tab.count > 0 && <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{tab.count}</span>}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wide truncate w-full text-center">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Desktop Flex Layout */}
            <div className="hidden md:flex gap-2 border-b border-gray-200 overflow-x-auto">
                {tabs.map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`pb-3 px-6 font-bold whitespace-nowrap transition-colors border-b-4 rounded-t-lg flex items-center gap-2 ${
                            activeTab === tab.id 
                            ? 'text-jungle-700 border-jungle-600 bg-white/50' 
                            : 'text-gray-400 border-transparent hover:text-gray-600'
                        }`}
                    >
                        <tab.icon size={16} />
                        {tab.label} 
                        {tab.count > 0 && <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${tab.id === 'requests' && tab.count > 0 ? 'bg-red-100 text-red-600 font-bold' : 'bg-gray-100 text-gray-600'}`}>{tab.count}</span>}
                    </button>
                ))}
            </div>
        </div>

        {/* --- SEPARATOR --- */}
        <div className="h-px bg-gray-200 my-8 w-full"></div>

        {/* --- TAB CONTENT --- */}
        {activeTab === 'agenda' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* CALENDAR SECTION */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-4 md:p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2 md:gap-4">
                            <h2 className="text-lg md:text-2xl font-serif font-bold text-jungle-900 capitalize">
                                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </h2>
                            <div className="flex gap-1">
                                <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))} className="p-1 md:p-2 hover:bg-gray-100 rounded-full"><ChevronLeft size={20}/></button>
                                <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))} className="p-1 md:p-2 hover:bg-gray-100 rounded-full"><ChevronRight size={20}/></button>
                            </div>
                        </div>
                        <button 
                            onClick={() => { resetAppointmentForm(); setIsAppointmentModalOpen(true); }}
                            className="bg-jungle-600 hover:bg-jungle-700 text-white px-3 md:px-4 py-2 rounded-xl font-bold flex items-center gap-1 md:gap-2 text-sm md:text-base shadow-md transition-transform active:scale-95"
                        >
                            <Plus size={18} /> <span className="hidden sm:inline">Nueva Cita</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 md:gap-2 text-center mb-2">
                        {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'].map(d => (
                            <div key={d} className="text-gray-400 text-[10px] md:text-xs font-bold uppercase">{d}</div>
                        ))}
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1 md:gap-2">
                        {calendarDays.map((day, idx) => {
                            if (day === null) return <div key={`blank-${idx}`} className="h-16 md:h-32 bg-gray-50/50 rounded-xl" />;
                            
                            const dayDateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                            const dayEvents = appointments.filter(a => a.date === dayDateStr && a.status !== 'cancelled');
                            const isToday = dayDateStr === new Date().toISOString().split('T')[0];
                            const isFocused = dayDateStr === focusDate;

                            return (
                                <div 
                                    key={day} 
                                    onClick={() => setFocusDate(dayDateStr)}
                                    className={`h-16 md:h-32 border rounded-xl p-1 md:p-2 flex flex-col relative transition-all cursor-pointer ${
                                        isFocused ? 'ring-2 ring-jungle-500 border-jungle-500 bg-jungle-50' : 
                                        isToday ? 'border-jungle-200 bg-jungle-50/50' : 'bg-white border-gray-100 hover:bg-gray-50'
                                    }`}
                                >
                                    <span className={`text-xs md:text-sm font-bold mb-1 ${isToday || isFocused ? 'text-jungle-700' : 'text-gray-700'}`}>{day}</span>
                                    
                                    {/* Desktop: Show Text Pills */}
                                    <div className="hidden md:block flex-1 overflow-y-auto space-y-1 no-scrollbar">
                                        {dayEvents.map(ev => (
                                            <div 
                                                key={ev.id} 
                                                className={`text-[10px] p-1 rounded truncate font-medium ${ev.status === 'completed' ? 'bg-gray-200 text-gray-500 line-through' : 'bg-blue-100 text-blue-800'}`}
                                                title={`${ev.time} - ${ev.clientName}`}
                                            >
                                                {ev.time} {ev.clientName}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Mobile: Show Dots */}
                                    <div className="md:hidden flex flex-wrap gap-1 justify-center mt-1">
                                        {dayEvents.slice(0, 4).map((ev, i) => (
                                            <div key={i} className={`w-1.5 h-1.5 rounded-full ${ev.status === 'completed' ? 'bg-gray-300' : 'bg-jungle-500'}`} />
                                        ))}
                                        {dayEvents.length > 4 && <span className="text-[8px] text-gray-400 leading-none">+</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* FOCUSED DAY DETAIL VIEW */}
                    <div className="mt-8 border-t border-gray-100 pt-6 animate-fade-in">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            Agenda del <span className="text-jungle-600">{new Date(focusDate + 'T00:00:00').toLocaleDateString()}</span>
                        </h3>
                        {focusDateAppointments.length === 0 ? (
                            <p className="text-gray-400 text-sm italic">No hay citas para este día. Toca el botón "Nueva Cita" para agregar una.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {focusDateAppointments.map(apt => (
                                    <div key={apt.id} className={`p-4 rounded-xl border flex flex-col justify-between ${apt.status === 'completed' ? 'bg-gray-50 border-gray-200 opacity-70' : 'bg-white border-jungle-100 shadow-sm'}`}>
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-bold text-lg text-jungle-800">{apt.time}</span>
                                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${apt.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {apt.status === 'completed' ? 'Completado' : 'Pendiente'}
                                                </span>
                                            </div>
                                            <h4 className="font-bold text-gray-900">{apt.clientName}</h4>
                                            <p className="text-sm text-gray-600 mb-4">{apt.description}</p>
                                        </div>
                                        <div className="flex gap-2 mt-2">
                                            <button onClick={() => { setSelectedAppointment(apt); setAppointmentForm(apt); setIsAppointmentModalOpen(true); }} className="flex-1 py-2 text-xs font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">Editar</button>
                                            {apt.status !== 'completed' && (
                                                <button onClick={() => updateAppointment({...apt, status: 'completed'})} className="flex-1 py-2 text-xs font-bold text-white bg-green-500 rounded-lg hover:bg-green-600">Completar</button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* UPCOMING LIST SECTION */}
                <div className="hidden lg:flex bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex-col h-[600px]">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <CalendarCheck size={20} className="text-jungle-600" /> Próximos Trabajos
                    </h3>
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                        {upcomingAppointments.length === 0 && <p className="text-gray-400 text-center py-10">No hay trabajos programados.</p>}
                        {upcomingAppointments.map(apt => {
                            const isPast = new Date(`${apt.date}T${apt.time}`) < new Date();
                            return (
                                <div key={apt.id} className={`p-4 rounded-xl border border-gray-100 ${apt.status === 'completed' ? 'bg-gray-50 opacity-60' : 'bg-white'}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="font-bold text-jungle-900 text-lg">{new Date(apt.date).getDate()} <span className="text-sm font-normal text-gray-500 uppercase">{new Date(apt.date).toLocaleString('default', { month: 'short' })}</span></div>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${apt.status === 'completed' ? 'bg-gray-200 text-gray-600' : isPast ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                            {apt.status === 'completed' ? 'Completado' : apt.time}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-gray-800">{apt.clientName}</h4>
                                    <p className="text-sm text-gray-500 mb-2">{apt.description}</p>
                                    <div className="flex justify-end gap-2 pt-2 border-t border-gray-50">
                                        <button onClick={() => { setSelectedAppointment(apt); setAppointmentForm(apt); setIsAppointmentModalOpen(true); }} className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-2 py-1 rounded">Editar</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'requests' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
             {serviceRequests.length === 0 ? <div className="p-12 text-center text-gray-400"><MessageCircle size={48} className="mx-auto mb-4 opacity-20" /><p>No hay solicitudes.</p></div> : (
                <div className="w-full">
                    <table className="hidden md:table w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                            <tr><th className="p-6">Estado</th><th className="p-6">Fecha</th><th className="p-6">Cliente</th><th className="p-6">Servicio</th><th className="p-6 text-right">Acciones</th></tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {[...serviceRequests].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(req => (
                            <tr key={req.id} className={`transition-colors ${req.status === 'pending' ? 'bg-yellow-50 hover:bg-yellow-100/50' : 'bg-white hover:bg-gray-50'}`}>
                                <td className="p-6"><span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide flex w-fit items-center gap-1 ${req.status === 'pending' ? 'bg-yellow-200 text-yellow-800' : req.status === 'contacted' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-700'}`}>{req.status === 'pending' && <AlertCircle size={12}/>}{req.status === 'pending' ? 'Pendiente' : req.status === 'contacted' ? 'Contactado' : 'Completado'}</span></td>
                                <td className="p-6 text-sm text-gray-500 font-medium">{new Date(req.date).toLocaleDateString()}</td>
                                <td className="p-6"><div className="font-bold text-gray-800">{req.clientName}</div><div className="text-xs text-gray-400 mt-1 flex items-center gap-1"><MapPinIcon /> {req.zone}</div></td>
                                <td className="p-6 text-sm font-bold text-jungle-700">{req.serviceType}</td>
                                <td className="p-6 flex gap-2 justify-end">
                                <button onClick={() => setSelectedRequest(req)} className="p-2 text-gray-400 hover:bg-white hover:shadow-md hover:text-jungle-600 rounded-full transition-all border border-transparent hover:border-gray-100"><Eye size={20} /></button>
                                {req.status === 'pending' && (<button onClick={() => updateServiceRequestStatus(req.id, 'contacted')} className="p-2 text-green-600 hover:bg-green-100 hover:text-green-700 rounded-full transition-all"><Check size={20} /></button>)}
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="md:hidden">
                        {[...serviceRequests].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(req => (
                             <div key={req.id} className={`p-4 border-b border-gray-100 flex flex-col gap-2 ${req.status === 'pending' ? 'bg-yellow-50' : 'bg-white'}`}>
                                 <div className="flex justify-between items-start">
                                     <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${req.status === 'pending' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{req.status}</span>
                                     <span className="text-xs text-gray-400">{new Date(req.date).toLocaleDateString()}</span>
                                 </div>
                                 <div>
                                     <h4 className="font-bold text-gray-800">{req.clientName}</h4>
                                     <p className="text-xs text-gray-500">{req.serviceType} - {req.zone}</p>
                                 </div>
                                 <div className="flex justify-end gap-2 mt-2">
                                     <button onClick={() => setSelectedRequest(req)} className="text-sm bg-white border px-3 py-1 rounded">Ver Detalle</button>
                                     {req.status === 'pending' && <button onClick={() => updateServiceRequestStatus(req.id, 'contacted')} className="text-sm bg-green-500 text-white px-3 py-1 rounded">Marcar Contactado</button>}
                                 </div>
                             </div>
                        ))}
                    </div>
                </div>
             )}
          </div>
        )}

        {activeTab === 'products' && (
            <>
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="flex-1 relative"><Search className="absolute left-4 top-3.5 text-gray-400" size={20} /><input type="text" placeholder="Buscar producto..." value={productSearch} onChange={(e) => setProductSearch(e.target.value)} className={inputClass}/></div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative"><Filter className="absolute left-4 top-3.5 text-gray-400 pointer-events-none" size={20} /><select value={productCategoryFilter} onChange={(e) => setProductCategoryFilter(e.target.value)} className="w-full sm:w-48 pl-12 pr-10 py-3 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-jungle-500 outline-none appearance-none bg-white cursor-pointer"><option value="all">Todas</option>{productCategories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                    <div className="relative"><select value={productVisibilityFilter} onChange={(e) => setProductVisibilityFilter(e.target.value as any)} className="w-full sm:w-40 px-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-jungle-500 outline-none appearance-none bg-white cursor-pointer text-gray-600 font-bold"><option value="all">Ver Todos</option><option value="visible">Visibles</option><option value="hidden">Ocultos</option></select></div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setIsCategoryManagerOpen(true)} className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-3 rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2"><Settings size={20} /></button>
                    <button onClick={() => { resetProductForm(); setIsProductModalOpen(true); }} className="bg-jungle-600 hover:bg-jungle-700 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap"><Plus size={20} /> Nuevo</button>
                </div>
            </div>
            {filteredProducts.length === 0 ? (
                <div className="text-center py-10 text-gray-400"><p>No hay productos que coincidan con la búsqueda.</p></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map(p => (
                        <div key={p.id} className={`bg-white p-4 rounded-2xl shadow-sm border flex gap-4 hover:shadow-md transition-shadow relative overflow-hidden ${!p.isVisible ? 'border-red-200 bg-red-50/30' : 'border-gray-100'}`}>
                            {!p.isVisible && <div className="absolute top-0 right-0 bg-red-100 text-red-600 text-[10px] px-2 py-1 font-bold rounded-bl-lg z-10">OCULTO</div>}
                            <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 relative">
                                <img src={p.images[0]} className={`w-full h-full object-cover ${!p.isVisible ? 'grayscale opacity-70' : ''}`} onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/150'} />
                            </div>
                            <div className="flex-grow flex flex-col justify-between min-w-0">
                                <div><div className="text-xs text-jungle-600 font-bold uppercase mb-1">{p.category}</div><h3 className="font-bold text-gray-800 truncate" title={p.name}>{p.name}</h3><div className="font-bold text-lg text-gray-900 mt-1">${p.price}</div></div>
                                <div className="flex justify-end gap-2 mt-2">
                                    <button onClick={() => toggleProductVisibility(p)} className={`p-2 rounded-lg transition-colors ${p.isVisible ? 'text-gray-400 hover:text-gray-600' : 'text-red-500 hover:text-red-700 bg-red-100'}`}>{p.isVisible ? <Eye size={18} /> : <EyeOff size={18} />}</button>
                                    <button onClick={() => openEditProduct(p)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={18} /></button>
                                    <button onClick={() => confirmDelete('product', p.id, p.name)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            </>
        )}

        {activeTab === 'projects' && (
            <>
             <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="flex-1 relative"><Search className="absolute left-4 top-3.5 text-gray-400" size={20} /><input type="text" placeholder="Buscar proyecto..." value={projectSearch} onChange={(e) => setProjectSearch(e.target.value)} className={inputClass}/></div>
                <div className="relative">
                    <Filter className="absolute left-4 top-3.5 text-gray-400 pointer-events-none" size={20} />
                    <select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value as any)} className="w-full lg:w-56 pl-12 pr-10 py-3 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-jungle-500 outline-none appearance-none bg-white cursor-pointer">
                        <option value="all">Todos</option><option value="featured">Destacados</option><option value="recent">Recientes</option><option value="Poda">Poda</option><option value="Mantenimiento">Mantenimiento</option><option value="Paisajismo">Paisajismo</option>
                    </select>
                </div>
                <button onClick={() => { resetProjectForm(); setIsProjectModalOpen(true); }} className="bg-jungle-600 hover:bg-jungle-700 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap"><Plus size={20} /> Nuevo Proyecto</button>
            </div>
            {filteredProjects.length === 0 ? (
                 <div className="text-center py-10 text-gray-400"><p>No hay proyectos con esos filtros.</p></div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredProjects.map(p => (
                        <div key={p.id} className={`bg-white p-6 rounded-2xl shadow-sm border flex flex-col sm:flex-row gap-6 ${!p.isVisible ? 'border-red-200 bg-red-50/30' : 'border-gray-100'}`}>
                            <div className="flex gap-2 flex-shrink-0 mx-auto sm:mx-0">
                                <div className="relative w-28 h-28 rounded-xl overflow-hidden shadow-sm group">
                                    <img src={p.beforeImage} className={`w-full h-full object-cover ${!p.isVisible ? 'grayscale' : ''}`} alt="Antes" />
                                    <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] py-1 text-center font-bold">ANTES</span>
                                </div>
                                <div className="relative w-28 h-28 rounded-xl overflow-hidden shadow-sm group">
                                    <img src={p.afterImage} className={`w-full h-full object-cover ${!p.isVisible ? 'grayscale' : ''}`} alt="Después" />
                                    <span className="absolute bottom-0 left-0 right-0 bg-jungle-600/90 text-white text-[10px] py-1 text-center font-bold">DESPUÉS</span>
                                </div>
                            </div>
                            <div className="flex-grow flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-xl text-gray-800">{p.title}</h3>
                                        {p.isFeatured && <Star size={16} className="text-yellow-400 fill-yellow-400" />}
                                    </div>
                                    <div className="flex flex-wrap gap-1 mt-1 mb-2">
                                        {p.tags.map(tag => (
                                            <span key={tag} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-bold uppercase">{tag}</span>
                                        ))}
                                    </div>
                                    <p className="text-gray-500 text-sm line-clamp-2">{p.shortDescription}</p>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-50">
                                    <button type="button" onClick={(e) => { e.stopPropagation(); toggleFeatured(p); }} className={`px-3 py-1.5 text-xs rounded-lg font-bold border ${p.isFeatured ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'bg-white text-gray-500 border-gray-200'}`}>{p.isFeatured ? '★ Destacado' : '☆ Destacar'}</button>
                                    <button type="button" onClick={(e) => { e.stopPropagation(); toggleProjectVisibility(p); }} className="px-3 py-1.5 text-xs rounded-lg font-bold border bg-white text-gray-500 border-gray-200 hover:bg-gray-50">{p.isVisible ? 'Ocultar' : 'Mostrar'}</button>
                                    <button type="button" onClick={(e) => { e.stopPropagation(); openEditProject(p); }} className="px-3 py-1.5 text-xs rounded-lg font-bold border bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100">Editar</button>
                                    <button type="button" onClick={(e) => { e.stopPropagation(); confirmDelete('project', p.id, p.title); }} className="px-3 py-1.5 text-xs rounded-lg font-bold border bg-red-50 text-red-600 border-red-100 hover:bg-red-100">Borrar</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            </>
        )}

        {/* ... (Clients, Users, Hero Tabs unchanged) ... */}
         {activeTab === 'clients' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className={`${selectedClient ? 'hidden lg:block' : 'block'} lg:col-span-1 bg-white rounded-3xl shadow-sm border border-gray-100 p-4 md:p-6 flex flex-col h-[70vh] md:h-[80vh]`}>
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold text-gray-800">Clientes</h3><button onClick={() => { resetClientForm(); setIsClientModalOpen(true); }} className="bg-jungle-600 text-white p-2 rounded-lg hover:bg-jungle-700"><Plus size={20}/></button></div>
                        <input type="text" placeholder="Buscar por nombre o zona..." value={clientSearch} onChange={(e) => setClientSearch(e.target.value)} className={inputClass} />
                    </div>
                    <div className="overflow-y-auto flex-1 space-y-3 pr-2">
                        {filteredClients.length === 0 && <p className="text-center text-gray-400 py-10">No hay clientes registrados.</p>}
                        {filteredClients.map(client => (
                            <div key={client.id} onClick={() => setSelectedClient(client)} className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${selectedClient?.id === client.id ? 'border-jungle-500 bg-jungle-50' : 'border-gray-100 bg-gray-50'}`}>
                                <div className="flex justify-between items-start"><h4 className="font-bold text-gray-800">{client.name}</h4>{client.isRegular && <Star size={14} className="text-yellow-500 fill-yellow-500" />}</div>
                                <p className="text-sm text-gray-500 flex items-center gap-1"><MapPinIcon /> {client.zone}</p>
                                <div className="mt-2 flex justify-between items-center text-xs"><span className="bg-white px-2 py-1 rounded border text-gray-600">{client.usualService}</span><span className="text-jungle-700 font-bold">${client.totalEarnings.toLocaleString()}</span></div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={`${!selectedClient ? 'hidden lg:block' : 'block'} lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-4 md:p-6 flex flex-col h-[70vh] md:h-[80vh] overflow-y-auto`}>
                    {!selectedClient ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                             <Briefcase size={64} className="mb-4 opacity-20" />
                             <p className="text-lg">Selecciona un cliente para ver su ficha.</p>
                             <div className="mt-8 w-full max-w-md">
                                 <h3 className="text-center font-bold text-gray-600 mb-4 border-b pb-2">Agenda (Próximos Pendientes)</h3>
                                 <div className="space-y-2">
                                     {agendaItems.slice(0, 5).map(item => (<div key={item.id} className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 flex justify-between items-center"><div><p className="font-bold text-sm text-gray-800">{item.clientName}</p><p className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString()} - {item.description}</p></div><button onClick={() => { const c = clients.find(cl => cl.name === item.clientName); if(c) setSelectedClient(c); }} className="text-blue-600 text-xs font-bold underline">Ver</button></div>))}
                                     {agendaItems.length === 0 && <p className="text-center text-xs">No hay trabajos pendientes próximos.</p>}
                                 </div>
                             </div>
                        </div>
                    ) : (
                        <div>
                            <div className="flex justify-between items-start mb-6 border-b pb-4">
                                <div>
                                     <button onClick={() => setSelectedClient(null)} className="lg:hidden text-gray-400 mb-2 flex items-center gap-1 font-bold">← Volver a lista</button>
                                     <h2 className="text-2xl md:text-3xl font-serif font-bold text-jungle-900 flex items-center gap-2">{selectedClient.name}{selectedClient.isRegular && <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wider">Fijo</span>}</h2>
                                     <p className="text-gray-500 flex items-center gap-2 mt-1 text-sm md:text-base"><MapPinIcon /> {selectedClient.address}, {selectedClient.zone}</p>
                                </div>
                                <div className="flex gap-2"><button onClick={() => openEditClient(selectedClient)} className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"><Edit size={20}/></button><button onClick={() => confirmDelete('client', selectedClient.id, selectedClient.name)} className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100"><Trash2 size={20}/></button></div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                                <div className="bg-gray-50 p-4 rounded-xl"><span className="text-xs font-bold text-gray-400 uppercase">Servicio Habitual</span><p className="font-bold text-gray-800 text-lg">{selectedClient.usualService}</p></div>
                                <div className="bg-gray-50 p-4 rounded-xl"><span className="text-xs font-bold text-gray-400 uppercase">Último Precio</span><p className="font-bold text-gray-800 text-lg">${selectedClient.lastPrice.toLocaleString()}</p></div>
                                <div className="bg-green-50 p-4 rounded-xl border border-green-100"><span className="text-xs font-bold text-green-600 uppercase">Total Ganado</span><p className="font-bold text-green-800 text-lg">${selectedClient.totalEarnings.toLocaleString()}</p></div>
                            </div>
                            <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-gray-700 text-lg">Historial</h3><button onClick={() => { resetLogForm(); setIsLogModalOpen(true); }} className="flex items-center gap-2 bg-jungle-600 text-white px-3 py-2 rounded-lg font-bold text-xs md:text-sm hover:bg-jungle-700"><Plus size={16} /> Agregar Visita</button></div>
                            <div className="space-y-3 pb-10">
                                {selectedClient.logs.length === 0 && <p className="text-gray-400 italic">No hay registros aún.</p>}
                                {[...selectedClient.logs].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(log => (
                                    <div key={log.id} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="bg-gray-100 p-3 rounded-lg text-center min-w-[60px]"><span className="block text-xs font-bold text-gray-500 uppercase">{new Date(log.date).toLocaleString('default', { month: 'short' })}</span><span className="block text-xl font-bold text-gray-800">{new Date(log.date).getDate()}</span></div>
                                            <div><p className="font-bold text-gray-800 text-sm md:text-base">{log.description}</p><p className="text-sm text-gray-500">{log.hours} hs trabajadas</p></div>
                                        </div>
                                        <div className="flex items-center gap-6 justify-between md:justify-end w-full md:w-auto">
                                            <span className="font-bold text-lg text-gray-800">${log.amount.toLocaleString()}</span>
                                            <button onClick={() => updateClientLogStatus(selectedClient.id, log.id, log.status === 'pending' ? 'paid' : 'pending')} className={`px-3 py-1 rounded-full text-xs font-bold uppercase border transition-all ${log.status === 'paid' ? 'bg-green-100 text-green-700 border-green-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-green-50 hover:text-green-600 hover:border-green-200'}`}>{log.status === 'paid' ? 'Pagado' : 'Pendiente'}</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )}
        
        {activeTab === 'users' && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                <div className="mb-6 max-w-md"><div className="relative"><Search className="absolute left-4 top-3.5 text-gray-400" size={20} /><input type="text" placeholder="Buscar usuario..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)} className={inputClass} /></div></div>
                <div className="hidden md:block overflow-x-auto"><table className="w-full text-left"><thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase"><tr><th className="p-4">Usuario</th><th className="p-4">Email</th><th className="p-4">Rol</th><th className="p-4 text-right">Acciones</th></tr></thead><tbody className="divide-y divide-gray-100">{filteredUsers.map(u => (<tr key={u.id}><td className="p-4 font-bold text-gray-800">{u.name} {u.surname}</td><td className="p-4 text-gray-600">{u.email}</td><td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold uppercase ${u.role === 'admin' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>{u.role}</span></td><td className="p-4 text-right">{u.role !== 'admin' && (<button onClick={() => { if(confirm(`¿Hacer Admin a ${u.name}?`)) grantAdminRole(u.email); }} className="text-sm bg-gray-100 hover:bg-jungle-100 text-jungle-700 px-3 py-1 rounded-lg font-bold transition-colors">Hacer Admin</button>)}</td></tr>))}</tbody></table></div>
                <div className="md:hidden space-y-4">{filteredUsers.map(u => (<div key={u.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50"><div className="flex justify-between items-start mb-2"><h4 className="font-bold text-gray-800">{u.name} {u.surname}</h4><span className={`px-2 py-1 rounded text-xs font-bold uppercase ${u.role === 'admin' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>{u.role}</span></div><p className="text-sm text-gray-600 mb-4">{u.email}</p>{u.role !== 'admin' && (<button onClick={() => { if(confirm(`¿Hacer Admin a ${u.name}?`)) grantAdminRole(u.email); }} className="w-full text-sm bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-lg font-bold">Hacer Admin</button>)}</div>))}</div>
            </div>
        )}

        {activeTab === 'hero' && (
             <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                 <div className="flex justify-between items-center mb-6">
                     <h3 className="text-xl font-bold text-gray-800">Imágenes del Carrusel Principal</h3>
                     <label className={`cursor-pointer bg-jungle-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-jungle-700 transition-colors ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                         <Upload size={20} /> {isUploading ? 'Subiendo...' : 'Agregar Imagen'}
                         <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'hero')} disabled={isUploading} />
                     </label>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">{heroImages.map((img, idx) => (<div key={idx} className="group relative rounded-2xl overflow-hidden aspect-video shadow-md hover:shadow-xl transition-all border border-gray-200"><img src={img} alt="Hero" className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3"><button onClick={() => moveHeroImage(idx, 'up')} disabled={idx === 0} className="p-3 bg-white rounded-full hover:bg-gray-100 disabled:opacity-50 transition-transform hover:scale-110"><ArrowUp size={20} className="text-gray-700"/></button><button onClick={() => moveHeroImage(idx, 'down')} disabled={idx === heroImages.length - 1} className="p-3 bg-white rounded-full hover:bg-gray-100 disabled:opacity-50 transition-transform hover:scale-110"><ArrowDown size={20} className="text-gray-700"/></button><button onClick={() => confirmDelete('hero', idx.toString(), 'Imagen Hero')} className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-transform hover:scale-110"><Trash2 size={20}/></button></div><div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded font-bold">{idx + 1} / {heroImages.length}</div></div>))}</div>
             </div>
        )}

        {/* --- CONFIG TAB --- */}
        {activeTab === 'config' && (
            <div className="space-y-8">
                {/* Shop Status Section */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <ShoppingBag size={20} className={isShopEnabled ? 'text-green-600' : 'text-gray-400'}/> 
                            Estado de la Tienda
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 max-w-md">
                            Si deshabilitas la tienda, los usuarios no podrán ver la sección de productos ni acceder al carrito de compras.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className={`text-sm font-bold ${isShopEnabled ? 'text-green-600' : 'text-gray-400'}`}>
                            {isShopEnabled ? 'TIENDA HABILITADA' : 'TIENDA DESHABILITADA'}
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="sr-only peer"
                                checked={isShopEnabled}
                                onChange={(e) => toggleShop(e.target.checked)}
                            />
                            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2"><CreditCard size={20}/> Configuración de Pagos</h3>
                        <form onSubmit={handleSaveConfig} className="space-y-4">
                            <div>
                                <label className={labelClass}>Alias Mercado Pago</label>
                                <input type="text" className={inputClass} value={configForm.alias} onChange={e => setConfigForm({...configForm, alias: e.target.value})} />
                            </div>
                            <div>
                                <label className={labelClass}>Nombre del Titular</label>
                                <input type="text" className={inputClass} value={configForm.holderName} onChange={e => setConfigForm({...configForm, holderName: e.target.value})} />
                            </div>
                            <button type="submit" className="bg-jungle-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-jungle-700 w-full mt-4 flex items-center justify-center gap-2">
                                <Save size={18} /> Guardar Configuración
                            </button>
                        </form>
                    </div>
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2"><DollarSign size={20}/> Ventas Completadas</h3>
                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                            {sales.length === 0 && <p className="text-gray-400 text-center py-8">No hay ventas registradas aún.</p>}
                            {sales.map(sale => (
                                <div key={sale.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-bold text-gray-800">{sale.customerName}</p>
                                            <p className="text-xs text-gray-500">{new Date(sale.date).toLocaleString()}</p>
                                        </div>
                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold">Completado</span>
                                    </div>
                                    <div className="bg-gray-50 p-2 rounded-lg mb-2">
                                        <p className="text-xs text-gray-500 mb-1">Items:</p>
                                        <ul className="text-sm space-y-1">
                                            {sale.items.map((item, idx) => (
                                                <li key={idx} className="flex justify-between">
                                                    <span>{item.quantity}x {item.name}</span>
                                                    <span className="font-mono text-xs">${(item.price * item.quantity).toLocaleString()}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                                        <span className="text-xs text-gray-500">{sale.customerEmail}</span>
                                        <span className="font-bold text-jungle-700 text-lg">${sale.total.toLocaleString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* --- MODALS (Z-INDEX 1000 to beat Header) --- */}
        
        {/* CLIENT MODAL */}
        {isClientModalOpen && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsClientModalOpen(false)}>
                <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
                    <div className="bg-gray-50 p-6 border-b border-gray-100"><h2 className="text-2xl font-bold">Cliente</h2></div>
                    <form onSubmit={handleSaveClient} className="p-8 space-y-4">
                        <div><label className={labelClass}>Nombre Completo</label><input required className={inputClass} value={clientForm.name} onChange={e => setClientForm({...clientForm, name: e.target.value})} /></div>
                        <div><label className={labelClass}>Dirección</label><input required className={inputClass} value={clientForm.address} onChange={e => setClientForm({...clientForm, address: e.target.value})} /></div>
                        <div><label className={labelClass}>Zona / Barrio</label><input required className={inputClass} value={clientForm.zone} onChange={e => setClientForm({...clientForm, zone: e.target.value})} /></div>
                        <div><label className={labelClass}>Servicio Habitual</label><input className={inputClass} value={clientForm.usualService} onChange={e => setClientForm({...clientForm, usualService: e.target.value})} placeholder="Ej: Corte de pasto" /></div>
                        <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
                            <input type="checkbox" checked={clientForm.isRegular ?? false} onChange={e => setClientForm({...clientForm, isRegular: e.target.checked})} className="w-5 h-5 text-jungle-600 rounded"/>
                            <label className="font-bold text-gray-700">Es Cliente Fijo</label>
                        </div>
                        <button type="submit" className="w-full bg-jungle-600 text-white py-3 rounded-xl font-bold">Guardar Cliente</button>
                    </form>
                </div>
            </div>
        )}

        {/* APPOINTMENT MODAL */}
        {isAppointmentModalOpen && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsAppointmentModalOpen(false)}>
                <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
                    <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-2xl font-bold">{selectedAppointment ? 'Editar Cita' : 'Nueva Cita'}</h2>
                        {selectedAppointment && <button onClick={() => confirmDelete('appointment', selectedAppointment.id, 'esta cita')} className="text-red-500 hover:text-red-700"><Trash2/></button>}
                    </div>
                    <form onSubmit={handleSaveAppointment} className="p-8 space-y-4">
                        <div>
                            <label className={labelClass}>Fecha</label>
                            <input type="date" required className={inputClass} value={appointmentForm.date} onChange={e => setAppointmentForm({...appointmentForm, date: e.target.value})} />
                        </div>
                        <div>
                            <label className={labelClass}>Hora</label>
                            <input type="time" required className={inputClass} value={appointmentForm.time} onChange={e => setAppointmentForm({...appointmentForm, time: e.target.value})} />
                        </div>
                        <div>
                            <label className={labelClass}>Cliente</label>
                            <div className="flex gap-2">
                                <input 
                                    list="clients-list" 
                                    required 
                                    className={inputClass} 
                                    value={appointmentForm.clientName} 
                                    onChange={e => {
                                        const val = e.target.value;
                                        const foundClient = clients.find(c => c.name === val);
                                        setAppointmentForm({
                                            ...appointmentForm, 
                                            clientName: val,
                                            clientId: foundClient ? foundClient.id : undefined
                                        });
                                    }} 
                                    placeholder="Nombre del cliente o tarea"
                                />
                                <datalist id="clients-list">
                                    {clients.map(c => <option key={c.id} value={c.name} />)}
                                </datalist>
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}>Descripción del trabajo</label>
                            <textarea rows={3} className={inputClass} value={appointmentForm.description} onChange={e => setAppointmentForm({...appointmentForm, description: e.target.value})} placeholder="Ej: Poda de ligustrina..." />
                        </div>
                        <div>
                            <label className={labelClass}>Estado</label>
                            <select className={inputClass} value={appointmentForm.status} onChange={e => setAppointmentForm({...appointmentForm, status: e.target.value as any})}>
                                <option value="scheduled">Programado</option>
                                <option value="completed">Completado</option>
                                <option value="cancelled">Cancelado</option>
                            </select>
                        </div>
                        <button type="submit" className="w-full bg-jungle-600 text-white py-3 rounded-xl font-bold">Guardar Cita</button>
                    </form>
                </div>
            </div>
        )}

        {isLogModalOpen && (
             <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsLogModalOpen(false)}>
                 <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
                    <div className="bg-gray-50 p-6 border-b border-gray-100"><h2 className="text-2xl font-bold">Registrar Visita/Trabajo</h2></div>
                    <form onSubmit={handleSaveLog} className="p-8 space-y-4">
                        <div><label className={labelClass}>Fecha</label><input type="date" required className={inputClass} value={logForm.date} onChange={e => setLogForm({...logForm, date: e.target.value})} /></div>
                        <div><label className={labelClass}>Descripción del trabajo</label><textarea required className={inputClass} value={logForm.description} onChange={e => setLogForm({...logForm, description: e.target.value})} rows={2} /></div>
                        <div className="flex gap-4">
                            <div className="flex-1"><label className={labelClass}>Horas</label><input type="number" step="0.5" className={inputClass} value={logForm.hours} onChange={e => setLogForm({...logForm, hours: Number(e.target.value)})} /></div>
                            <div className="flex-1"><label className={labelClass}>Precio ($)</label><input type="number" required className={inputClass} value={logForm.amount} onChange={e => setLogForm({...logForm, amount: Number(e.target.value)})} /></div>
                        </div>
                         <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
                            <span className="font-bold text-gray-600">Estado:</span>
                            <select value={logForm.status} onChange={e => setLogForm({...logForm, status: e.target.value as any})} className="bg-white border p-2 rounded">
                                <option value="pending">Pendiente de Cobro</option>
                                <option value="paid">Pagado</option>
                            </select>
                        </div>
                        <button type="submit" className="w-full bg-jungle-600 text-white py-3 rounded-xl font-bold">Registrar</button>
                    </form>
                 </div>
             </div>
        )}

        {isProductModalOpen && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsProductModalOpen(false)}>
                 <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                    <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-2xl font-serif font-bold text-gray-800 flex items-center gap-2">{editingProduct ? <Edit className="text-jungle-600"/> : <Plus className="text-jungle-600"/>} {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h2>
                        <button onClick={() => setIsProductModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
                    </div>
                    <form onSubmit={handleSaveProduct} className="p-8 overflow-y-auto space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label className={labelClass}>Nombre</label><input type="text" className={inputClass} value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} required /></div>
                             <div><label className={labelClass}>Categoría</label><select className={inputClass} value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})}>{productCategories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label className={labelClass}>Precio ($)</label><input type="number" className={inputClass} value={productForm.price} onChange={e => setProductForm({...productForm, price: Number(e.target.value)})} required /></div>
                             <div><label className={labelClass}>Stock</label><input type="number" className={inputClass} value={productForm.stock} onChange={e => setProductForm({...productForm, stock: Number(e.target.value)})} /></div>
                        </div>
                        <div><label className={labelClass}>Descripción</label><textarea rows={3} className={inputClass} value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} /></div>
                        <div>
                            <label className={labelClass}>Imágenes</label>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-4">
                                {productForm.images?.map((img, idx) => (<div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group"><img src={img} className="w-full h-full object-cover" /><button type="button" onClick={() => removeProductImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button></div>))}
                                <label className={`cursor-pointer aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-jungle-500 hover:bg-jungle-50 flex flex-col items-center justify-center text-gray-400 hover:text-jungle-600 transition-colors ${isUploading ? 'opacity-50' : ''}`}>
                                    <Plus size={24} />
                                    <span className="text-xs text-center mt-1">{isUploading ? '...' : 'Subir'}</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'product')} disabled={isUploading} />
                                </label>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
                            <input type="checkbox" id="productVisible" checked={productForm.isVisible ?? true} onChange={e => setProductForm({...productForm, isVisible: e.target.checked})} className="w-5 h-5 text-jungle-600 rounded focus:ring-jungle-500"/>
                            <label htmlFor="productVisible" className="text-sm font-bold text-gray-700">Visible</label>
                        </div>
                        <div className="pt-4 border-t border-gray-100 flex justify-end gap-3"><button type="button" onClick={() => setIsProductModalOpen(false)} className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50">Cancelar</button><button type="submit" disabled={isUploading} className="px-6 py-3 rounded-xl bg-jungle-600 text-white font-bold hover:bg-jungle-700 shadow-lg flex items-center gap-2 disabled:opacity-50"><Save size={20} /> Guardar</button></div>
                    </form>
                 </div>
            </div>
        )}

        {isProjectModalOpen && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsProjectModalOpen(false)}>
                <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]" onClick={e => e.stopPropagation()}>
                    <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-center"><h2 className="text-2xl font-serif font-bold text-gray-800 flex items-center gap-2">{editingProject ? <Edit className="text-jungle-600"/> : <Plus className="text-jungle-600"/>} {editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h2><button onClick={() => setIsProjectModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24}/></button></div>
                    <form onSubmit={handleSaveProject} className="p-8 overflow-y-auto space-y-6">
                        <div><label className={labelClass}>Título</label><input type="text" className={inputClass} value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} required /></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div><label className={labelClass}>Etiquetas</label><input type="text" placeholder="Ej: Poda, Paisajismo" className={inputClass} value={projectTagInput} onChange={e => setProjectTagInput(e.target.value)} /></div>
                             <div><label className={labelClass}>Descripción Corta</label><input type="text" className={inputClass} value={projectForm.shortDescription} onChange={e => setProjectForm({...projectForm, shortDescription: e.target.value})} /></div>
                        </div>
                        <div><label className={labelClass}>Historia</label><textarea rows={4} className={inputClass} value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} /></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                             <div>
                                 <label className={labelClass}>ANTES</label>
                                 <div className="mt-2 w-full aspect-video bg-gray-200 rounded-xl overflow-hidden border border-gray-300 flex items-center justify-center relative group cursor-pointer">
                                     {projectForm.beforeImage ? <img src={projectForm.beforeImage} className="w-full h-full object-cover" /> : <span className="text-gray-400 text-sm font-bold">Sin imagen</span>}
                                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                         <label className={`cursor-pointer bg-white text-gray-800 px-4 py-2 rounded-lg font-bold shadow-lg flex items-center gap-2 ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                             <Upload size={16} /> {isUploading ? '...' : 'Subir'}
                                             <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'before')} disabled={isUploading} />
                                         </label>
                                     </div>
                                 </div>
                             </div>
                             <div>
                                 <label className={labelClass}>DESPUÉS</label>
                                 <div className="mt-2 w-full aspect-video bg-gray-200 rounded-xl overflow-hidden border border-gray-300 flex items-center justify-center relative group cursor-pointer">
                                     {projectForm.afterImage ? <img src={projectForm.afterImage} className="w-full h-full object-cover" /> : <span className="text-gray-400 text-sm font-bold">Sin imagen</span>}
                                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                         <label className={`cursor-pointer bg-white text-gray-800 px-4 py-2 rounded-lg font-bold shadow-lg flex items-center gap-2 ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                             <Upload size={16} /> {isUploading ? '...' : 'Subir'}
                                             <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'after')} disabled={isUploading} />
                                         </label>
                                     </div>
                                 </div>
                             </div>
                        </div>
                        <div className="flex gap-4">
                             <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl flex-1">
                                <input type="checkbox" id="projectVisible" checked={projectForm.isVisible ?? true} onChange={e => setProjectForm({...projectForm, isVisible: e.target.checked})} className="w-5 h-5 text-jungle-600 rounded focus:ring-jungle-500"/><label htmlFor="projectVisible" className="text-sm font-bold text-gray-700">Visible</label>
                            </div>
                            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl flex-1">
                                <input type="checkbox" id="projectFeatured" checked={projectForm.isFeatured ?? false} onChange={e => setProjectForm({...projectForm, isFeatured: e.target.checked})} className="w-5 h-5 text-yellow-500 rounded focus:ring-yellow-500"/><label htmlFor="projectFeatured" className="text-sm font-bold text-gray-700">Destacar en Inicio</label>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-gray-100 flex justify-end gap-3"><button type="button" onClick={() => setIsProjectModalOpen(false)} className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50">Cancelar</button><button type="submit" disabled={isUploading} className="px-6 py-3 rounded-xl bg-jungle-600 text-white font-bold hover:bg-jungle-700 shadow-lg flex items-center gap-2 disabled:opacity-50"><Save size={20} /> Guardar</button></div>
                    </form>
                </div>
            </div>
        )}

        {isCategoryManagerOpen && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsCategoryManagerOpen(false)}>
                <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-serif font-bold text-jungle-900">Categorías</h3><button onClick={() => setIsCategoryManagerOpen(false)}><X size={20} className="text-gray-400"/></button></div>
                    <div className="flex gap-2 mb-6"><input type="text" placeholder="Nueva Categoría" className={inputClass} value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} /><button onClick={() => { if(newCategoryName) { addCategory(newCategoryName); setNewCategoryName(''); } }} className="bg-jungle-600 text-white px-4 rounded-xl"><Plus /></button></div>
                    <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">{productCategories.map(cat => (<li key={cat} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100"><span className="font-bold text-gray-700">{cat}</span><button onClick={() => confirmDelete('category', cat, cat)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button></li>))}</ul>
                </div>
            </div>
        )}

        {deleteModal.isOpen && (
            <div className="fixed inset-0 z-[1010] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteModal({ ...deleteModal, isOpen: false })}>
                <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-scale-in" onClick={e => e.stopPropagation()}>
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><AlertTriangle className="text-red-600" size={24} /></div>
                    <h3 className="text-xl font-bold text-center text-gray-900 mb-2">¿Eliminar {deleteModal.type === 'appointment' ? 'cita' : deleteModal.type}?</h3>
                    <p className="text-center text-gray-500 mb-6">Estás a punto de eliminar <span className="font-bold text-gray-800">{deleteModal.name ? `"${deleteModal.name}"` : 'este elemento'}</span>.</p>
                    <div className="flex gap-3"><button onClick={() => setDeleteModal({ ...deleteModal, isOpen: false })} className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl">Cancelar</button><button onClick={executeDelete} className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl">Eliminar</button></div>
                </div>
            </div>
        )}

        {selectedRequest && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedRequest(null)}>
            <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
              <h3 className="text-3xl font-serif text-jungle-900 mb-6 border-b border-gray-100 pb-4">Detalle</h3>
              <div className="space-y-5 mb-8">
                <div className="bg-jungle-50 border border-jungle-100 p-4 rounded-xl mb-4">
                     <span className="text-xs text-jungle-600 font-bold block uppercase mb-1">Servicio Solicitado</span>
                     <p className="text-xl font-bold text-jungle-900">{selectedRequest.serviceType}</p>
                </div>
                <div className="grid grid-cols-2 gap-4"><div><span className="text-xs text-gray-400 font-bold block uppercase mb-1">Cliente</span><p className="text-lg font-bold text-gray-800">{selectedRequest.clientName}</p></div><div><span className="text-xs text-gray-400 font-bold block uppercase mb-1">Zona</span><p className="text-lg text-gray-700">{selectedRequest.zone}</p></div></div>
                <div><span className="text-xs text-gray-400 font-bold block uppercase mb-1">Contacto</span><p className="text-lg text-gray-700">{selectedRequest.phoneNumber}</p></div>
                <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100"><p className="text-gray-700 italic">"{selectedRequest.description}"</p></div>
              </div>
              <div className="flex gap-3">
                <a href={`https://wa.me/549${selectedRequest.phoneNumber}`} target="_blank" rel="noreferrer" onClick={() => { updateServiceRequestStatus(selectedRequest.id, 'contacted'); setSelectedRequest(null); }} className="flex-1 bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2"><MessageCircle size={20} /> Responder</a>
                <button onClick={() => setSelectedRequest(null)} className="px-6 py-4 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50">Cerrar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Simple icon for map pin
const MapPinIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>);
const ShoppingCartIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>);

export default AdminPanel;
