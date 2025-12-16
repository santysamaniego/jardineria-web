import { Product, ServiceProject, ServiceRequest } from './types';

// Helper for reliable images
const getUnsplashUrl = (id: string) => 
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=400&q=80`;

export const INITIAL_PRODUCTS: Product[] = [
  // --- PLANTAS (10) ---
  {
    id: 'pl-1', name: 'Monstera Deliciosa XL', category: 'Plantas', price: 25000, stock: 5,
    description: 'La reina del interior. Hojas fenestradas gigantes.',
    images: [getUnsplashUrl('1614594975525-e45190c55d0b')],
    isVisible: true
  },
  {
    id: 'pl-2', name: 'Ficus Pandurata', category: 'Plantas', price: 18000, stock: 8,
    description: 'Árbol de interior con hojas en forma de violín.',
    images: [getUnsplashUrl('1600411207623-122c5253e7a6')],
    isVisible: true
  },
  {
    id: 'pl-3', name: 'Sansevieria', category: 'Plantas', price: 8500, stock: 15,
    description: 'Indestructible. Purifica el aire.',
    images: [getUnsplashUrl('1620126937626-6638f5f02c63')],
    isVisible: true
  },
  {
    id: 'pl-4', name: 'Pothos Golden', category: 'Plantas', price: 4500, stock: 20,
    description: 'Enredadera de crecimiento rápido.',
    images: [getUnsplashUrl('1596522514107-1a483d97f39d')],
    isVisible: true
  },
  {
    id: 'pl-5', name: 'Lavanda', category: 'Plantas', price: 3200, stock: 25,
    description: 'Aromática para exterior. Atrae mariposas.',
    images: [getUnsplashUrl('1565011527786-8131333fb758')],
    isVisible: true
  },
  {
    id: 'pl-6', name: 'Helecho Boston', category: 'Plantas', price: 6000, stock: 10,
    description: 'Clásico frondoso. Requiere humedad.',
    images: [getUnsplashUrl('1628518973693-195b00c929a0')],
    isVisible: true
  },
  {
    id: 'pl-7', name: 'Cactus Euphorbia', category: 'Plantas', price: 12000, stock: 6,
    description: 'Cactus columnar de gran porte.',
    images: [getUnsplashUrl('1519391090382-721315b8061f')],
    isVisible: true
  },
  {
    id: 'pl-8', name: 'Suculenta Echeveria', category: 'Plantas', price: 1500, stock: 50,
    description: 'Pequeña roseta ideal para terrarios.',
    images: [getUnsplashUrl('1459411552884-841db9b3cc2a')],
    isVisible: true
  },
  {
    id: 'pl-9', name: 'Palmera Areca', category: 'Plantas', price: 14500, stock: 7,
    description: 'Palmera tropical que aporta volumen.',
    images: [getUnsplashUrl('1616428415714-367204481358')],
    isVisible: true
  },
  {
    id: 'pl-10', name: 'Jazmín', category: 'Plantas', price: 9000, stock: 12,
    description: 'Arbusto con flores blancas muy perfumadas.',
    images: [getUnsplashUrl('1620612448398-3f86b1c2b87f')],
    isVisible: true
  },

  // --- FERTILIZANTES (10) ---
  {
    id: 'fe-1', name: 'Fertilizante Universal', category: 'Fertilizantes', price: 4500, stock: 100,
    description: 'Granulado balanceado NPK.',
    images: [getUnsplashUrl('1627920769830-47535b914856')],
    isVisible: true
  },
  {
    id: 'fe-2', name: 'Humus de Lombriz', category: 'Fertilizantes', price: 3000, stock: 40,
    description: 'Abono orgánico premium.',
    images: [getUnsplashUrl('1615377047720-6819eb79f477')],
    isVisible: true
  },
  {
    id: 'fe-3', name: 'Potenciador Floración', category: 'Fertilizantes', price: 5200, stock: 20,
    description: 'Alto en Potasio y Fósforo.',
    images: [getUnsplashUrl('1599687267812-35905d212787')],
    isVisible: true
  },
  {
    id: 'fe-4', name: 'Nitrógeno Líquido', category: 'Fertilizantes', price: 3800, stock: 15,
    description: 'Potencia el verde de las hojas.',
    images: [getUnsplashUrl('1585320806297-9794b3e4eeae')],
    isVisible: true
  },
  {
    id: 'fe-5', name: 'Harina de Hueso', category: 'Fertilizantes', price: 2500, stock: 30,
    description: 'Fuente natural de fósforo.',
    images: [getUnsplashUrl('1589923188900-85dae523342b')],
    isVisible: true
  },
  {
    id: 'fe-6', name: 'Quelatos de Hierro', category: 'Fertilizantes', price: 4100, stock: 25,
    description: 'Corrige hojas amarillas.',
    images: [getUnsplashUrl('1611569426992-0b2f5670870f')],
    isVisible: true
  },
  {
    id: 'fe-7', name: 'Compost Orgánico', category: 'Fertilizantes', price: 6000, stock: 20,
    description: 'Materia orgánica compostada.',
    images: [getUnsplashUrl('1525455870698-9273de02706e')],
    isVisible: true
  },
  {
    id: 'fe-8', name: 'Alimento Cactus', category: 'Fertilizantes', price: 3200, stock: 18,
    description: 'Fórmula baja en nitrógeno.',
    images: [getUnsplashUrl('1509423355108-744033111f05')],
    isVisible: true
  },
  {
    id: 'fe-9', name: 'Perlita', category: 'Fertilizantes', price: 2000, stock: 50,
    description: 'Mejora el drenaje.',
    images: [getUnsplashUrl('1637500984620-642cb8380e21')],
    isVisible: true
  },
  {
    id: 'fe-10', name: 'Sustrato Premium', category: 'Fertilizantes', price: 4500, stock: 15,
    description: 'Mezcla completa para macetas.',
    images: [getUnsplashUrl('1616788323602-0c9103c393bc')],
    isVisible: true
  },

  // --- HERRAMIENTAS (10) ---
  {
    id: 'he-1', name: 'Tijera de Poda', category: 'Herramientas', price: 12500, stock: 10,
    description: 'Corte limpio y preciso.',
    images: [getUnsplashUrl('1590890299625-ba1065181b51')],
    isVisible: true
  },
  {
    id: 'he-2', name: 'Pala de Mano', category: 'Herramientas', price: 3500, stock: 20,
    description: 'Mango ergonómico.',
    images: [getUnsplashUrl('1617576683096-00fc8eecb3af')],
    isVisible: true
  },
  {
    id: 'he-3', name: 'Guantes', category: 'Herramientas', price: 2000, stock: 50,
    description: 'Protección y agarre.',
    images: [getUnsplashUrl('1586790170083-2f9ceadc732d')],
    isVisible: true
  },
  {
    id: 'he-4', name: 'Rastrillo Mano', category: 'Herramientas', price: 3200, stock: 15,
    description: 'Para airear tierra.',
    images: [getUnsplashUrl('1416879115533-19cead6975c6')],
    isVisible: true
  },
  {
    id: 'he-5', name: 'Serrucho Poda', category: 'Herramientas', price: 15000, stock: 5,
    description: 'Para ramas gruesas.',
    images: [getUnsplashUrl('1522252234503-e356532cafd5')],
    isVisible: true
  },
  {
    id: 'he-6', name: 'Pulverizador', category: 'Herramientas', price: 5500, stock: 12,
    description: 'Para riego foliar.',
    images: [getUnsplashUrl('1622359231221-f3b1424e649e')],
    isVisible: true
  },
  {
    id: 'he-7', name: 'Regadera Zinc', category: 'Herramientas', price: 18000, stock: 4,
    description: 'Estilo vintage.',
    images: [getUnsplashUrl('1601633454763-7eb66487e477')],
    isVisible: true
  },
  {
    id: 'he-8', name: 'Tijera Cortasetos', category: 'Herramientas', price: 22000, stock: 3,
    description: 'Para dar forma a arbustos.',
    images: [getUnsplashUrl('1613535926888-93ee302c349d')],
    isVisible: true
  },
  {
    id: 'he-9', name: 'Hilo de Yute', category: 'Herramientas', price: 6500, stock: 8,
    description: 'Para atar plantas.',
    images: [getUnsplashUrl('1591857177580-dc82b9e4e171')],
    isVisible: true
  },
  {
    id: 'he-10', name: 'Delantal', category: 'Herramientas', price: 8000, stock: 10,
    description: 'Con bolsillos.',
    images: [getUnsplashUrl('1596796365319-35408a207234')],
    isVisible: true
  },

  // --- MACETAS (10) ---
  {
    id: 'ma-1', name: 'Maceta Rotomoldeo', category: 'Macetas', price: 12000, stock: 20,
    description: 'Ultra resistente y liviana.',
    images: [getUnsplashUrl('1485955900006-10f4d324d411')],
    isVisible: true
  },
  {
    id: 'ma-2', name: 'Maceta Cerámica', category: 'Macetas', price: 8500, stock: 15,
    description: 'Esmaltada brillante.',
    images: [getUnsplashUrl('1595246738435-901111622340')],
    isVisible: true
  },
  {
    id: 'ma-3', name: 'Jardinera', category: 'Macetas', price: 15000, stock: 10,
    description: 'Rectangular para balcones.',
    images: [getUnsplashUrl('1622247605703-e8c15664955b')],
    isVisible: true
  },
  {
    id: 'ma-4', name: 'Maceta Barro', category: 'Macetas', price: 1200, stock: 100,
    description: 'Terracota clásica.',
    images: [getUnsplashUrl('1509937528035-ad76254b0356')],
    isVisible: true
  },
  {
    id: 'ma-5', name: 'Pie Nórdico', category: 'Macetas', price: 6000, stock: 12,
    description: 'Madera para elevar macetas.',
    images: [getUnsplashUrl('1628191942730-804d9c445690')],
    isVisible: true
  },
  {
    id: 'ma-6', name: 'Maceta Colgante', category: 'Macetas', price: 3500, stock: 20,
    description: 'Con gancho incluido.',
    images: [getUnsplashUrl('1463320726281-d96114752b88')],
    isVisible: true
  },
  {
    id: 'ma-7', name: 'Maceta Autoriego', category: 'Macetas', price: 5500, stock: 15,
    description: 'Sistema de mecha inteligente.',
    images: [getUnsplashUrl('1614264626359-994df7bc6170')],
    isVisible: true
  },
  {
    id: 'ma-8', name: 'Maceta Geotextil', category: 'Macetas', price: 2000, stock: 40,
    description: 'Mejora raíces.',
    images: [getUnsplashUrl('1610444588506-c67d6c62c45d')],
    isVisible: true
  },
  {
    id: 'ma-9', name: 'Maceta Cemento', category: 'Macetas', price: 18000, stock: 5,
    description: 'Estilo industrial.',
    images: [getUnsplashUrl('1621516790938-c62529641756')],
    isVisible: true
  },
  {
    id: 'ma-10', name: 'Plato Drenaje', category: 'Macetas', price: 800, stock: 60,
    description: 'Protege tus pisos.',
    images: [getUnsplashUrl('1598219460064-320078f1422b')],
    isVisible: true
  },

  // --- RIEGO (10) ---
  {
    id: 'ri-1', name: 'Manguera 25mts', category: 'Riego', price: 18000, stock: 10,
    description: 'Reforzada anti-torsión.',
    images: [getUnsplashUrl('1610996884638-7da56fb08304')],
    isVisible: true
  },
  {
    id: 'ri-2', name: 'Kit Goteo', category: 'Riego', price: 25000, stock: 8,
    description: 'Riego automático simple.',
    images: [getUnsplashUrl('1595159059728-6d435cb58245')],
    isVisible: true
  },
  {
    id: 'ri-3', name: 'Timer Riego', category: 'Riego', price: 35000, stock: 5,
    description: 'Programador digital.',
    images: [getUnsplashUrl('1563264669-7da7a394c8b6')],
    isVisible: true
  },
  {
    id: 'ri-4', name: 'Pistola Riego', category: 'Riego', price: 4500, stock: 15,
    description: 'Multifunción.',
    images: [getUnsplashUrl('1589148417537-b4526dfc5685')],
    isVisible: true
  },
  {
    id: 'ri-5', name: 'Aspersor', category: 'Riego', price: 6000, stock: 12,
    description: 'Para césped amplio.',
    images: [getUnsplashUrl('1606509036324-4f0ceb68dd37')],
    isVisible: true
  },
  {
    id: 'ri-6', name: 'Conector Rápido', category: 'Riego', price: 1200, stock: 50,
    description: 'Acople universal.',
    images: [getUnsplashUrl('1617112837775-87779b5c2a11')],
    isVisible: true
  },
  {
    id: 'ri-7', name: 'Lanza Riego', category: 'Riego', price: 9000, stock: 6,
    description: 'Alcance extendido.',
    images: [getUnsplashUrl('1463936575829-25148e1db1b8')],
    isVisible: true
  },
  {
    id: 'ri-8', name: 'Microaspersores', category: 'Riego', price: 3000, stock: 20,
    description: 'Niebla fina.',
    images: [getUnsplashUrl('1530263503756-b3713000df56')],
    isVisible: true
  },
  {
    id: 'ri-9', name: 'Regador Oscilante', category: 'Riego', price: 11000, stock: 8,
    description: 'Riego rectangular.',
    images: [getUnsplashUrl('1563514227147-602ed1205372')],
    isVisible: true
  },
  {
    id: 'ri-10', name: 'Bomba Agua', category: 'Riego', price: 45000, stock: 2,
    description: 'Sumergible.',
    images: [getUnsplashUrl('1594411124976-905e4d226068')],
    isVisible: true
  }
];

export const PORTFOLIO_PROJECTS: ServiceProject[] = [
  {
    id: 'p1',
    title: 'Renovación Patio',
    shortDescription: 'De tierra a oasis tropical.',
    description: 'Nivelación, drenaje, deck y canteros perimetrales.',
    beforeImage: getUnsplashUrl('1595821077754-0e36a445cb4c'), // Construction/Dirt
    afterImage: getUnsplashUrl('1592722602715-e21e649dc490'), // Beautiful Garden
    tags: ['Paisajismo', 'Diseño'],
    isVisible: true,
    isFeatured: true
  },
  {
    id: 'p2',
    title: 'Frente Moderno',
    shortDescription: 'Entrada minimalista.',
    description: 'Piedras blancas, buxus y luces LED.',
    beforeImage: getUnsplashUrl('1584463372274-0683a45c614b'), // Messy grass
    afterImage: getUnsplashUrl('1563292770-891d4411019e'), // Clean entrance
    tags: ['Frente', 'Minimalista'],
    isVisible: true,
    isFeatured: true
  },
  {
    id: 'p3',
    title: 'Recuperación Césped',
    shortDescription: 'Tratamiento intensivo.',
    description: 'Aireación, resiembra y fertilización.',
    beforeImage: getUnsplashUrl('1558293776-805b82834b6e'), // Dry patches
    afterImage: getUnsplashUrl('1558904541-efa843a96f01'), // Green grass
    tags: ['Mantenimiento', 'Césped'],
    isVisible: true,
    isFeatured: false
  },
  {
    id: 'p4',
    title: 'Jardín Vertical',
    shortDescription: 'Verde en altura.',
    description: 'Sistema de bolsillos geotextiles.',
    beforeImage: getUnsplashUrl('1517816480212-3551d02d6b38'), // Brick wall
    afterImage: getUnsplashUrl('1502672023488-70e25813eb80'), // Vertical garden
    tags: ['Vertical', 'Balcón'],
    isVisible: true,
    isFeatured: false
  }
];

// --- MOCK SERVICE REQUESTS FOR DEMO ---
export const MOCK_REQUESTS: ServiceRequest[] = [
  {
    id: 'req-1',
    clientName: 'María González',
    phoneNumber: '1155554444',
    hasWhatsapp: true,
    zone: 'Ramos Mejía Sur',
    serviceType: 'Poda',
    description: 'Hola, tengo un árbol en la vereda que está tocando los cables. Necesito presupuesto para poda de altura.',
    date: new Date().toISOString(),
    status: 'pending'
  },
  {
    id: 'req-2',
    clientName: 'Carlos Ruiz',
    phoneNumber: '1122334455',
    hasWhatsapp: false,
    zone: 'Haedo',
    serviceType: 'Mantenimiento',
    description: 'Necesito corte de pasto y limpieza de canteros una vez por mes. El jardín es de 10x15.',
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    status: 'contacted'
  }
];