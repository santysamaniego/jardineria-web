
export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    description: string;
    images: string[];
    stock: number;
    isVisible: boolean;
  }
  
  export interface ServiceProject {
    id: string;
    title: string;
    description: string;
    shortDescription: string;
    beforeImage: string;
    afterImage: string;
    tags: string[];
    isVisible: boolean;
    isFeatured: boolean;
  }
  
  export interface ServiceRequest {
    id: string;
    clientName: string;
    phoneNumber: string;
    hasWhatsapp: boolean;
    zone: string;
    serviceType: string;
    description: string;
    date: string;
    status: 'pending' | 'contacted' | 'completed';
  }
  
  export interface CartItem extends Product {
    quantity: number;
  }

  export interface User {
    id: string;
    name: string;
    surname: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
  }

  // --- CRM & SALES TYPES ---

  export interface ClientLog {
      id: string;
      date: string;
      description: string; // What was done
      hours: number;
      amount: number;
      status: 'pending' | 'paid';
  }

  export interface Client {
      id: string;
      name: string;
      address: string;
      zone: string;
      usualService: string;
      isRegular: boolean; // Cliente fijo
      lastPrice: number;
      logs: ClientLog[];
      totalEarnings: number; // Calculated
  }

  export interface Appointment {
      id: string;
      clientId?: string; // Optional link to a client
      clientName: string; // Denormalized for display
      date: string; // ISO Date YYYY-MM-DD
      time: string; // HH:MM
      description: string;
      status: 'scheduled' | 'completed' | 'cancelled';
  }

  export interface Sale {
      id: string;
      date: string;
      customerName: string;
      customerEmail: string;
      customerPhone: string;
      items: CartItem[];
      total: number;
      status: 'pending_payment' | 'completed';
  }

  export interface PaymentConfig {
      alias: string;
      holderName: string;
  }
