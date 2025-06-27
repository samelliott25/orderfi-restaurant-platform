// OrderFi AI - Internationalization Configuration
// Multi-language support for global expansion

export type SupportedLanguage = 'en' | 'es' | 'pt' | 'fr';

export interface Translation {
  // Navigation & Core UI
  home: string;
  menu: string;
  cart: string;
  orders: string;
  rewards: string;
  dashboard: string;
  settings: string;
  
  // AI Chat Interface
  chatPlaceholder: string;
  voiceButton: string;
  sendMessage: string;
  aiGreeting: string;
  orderConfirmation: string;
  
  // Menu & Ordering
  addToCart: string;
  removeFromCart: string;
  customizations: string;
  specialInstructions: string;
  quantity: string;
  price: string;
  total: string;
  subtotal: string;
  tax: string;
  
  // Order Status
  orderPlaced: string;
  preparing: string;
  ready: string;
  completed: string;
  cancelled: string;
  
  // Token Rewards
  currentPoints: string;
  earnPoints: string;
  redeemRewards: string;
  loyaltyTier: string;
  bronze: string;
  silver: string;
  gold: string;
  platinum: string;
  
  // Common Actions
  confirm: string;
  cancel: string;
  save: string;
  edit: string;
  delete: string;
  loading: string;
  error: string;
  success: string;
  
  // Restaurant Dashboard
  liveOrders: string;
  kitchenDisplay: string;
  analytics: string;
  printOrder: string;
  markReady: string;
  customerInfo: string;
}

export const translations: Record<SupportedLanguage, Translation> = {
  en: {
    // Navigation & Core UI
    home: 'Home',
    menu: 'Menu',
    cart: 'Cart',
    orders: 'Orders',
    rewards: 'Rewards',
    dashboard: 'Dashboard',
    settings: 'Settings',
    
    // AI Chat Interface
    chatPlaceholder: 'Chat with OrderFi AI to place your order...',
    voiceButton: 'Voice Order',
    sendMessage: 'Send',
    aiGreeting: 'Hi! I\'m OrderFi AI. What would you like to order today?',
    orderConfirmation: 'Great choice! I\'ve added that to your cart.',
    
    // Menu & Ordering
    addToCart: 'Add to Cart',
    removeFromCart: 'Remove',
    customizations: 'Customizations',
    specialInstructions: 'Special Instructions',
    quantity: 'Quantity',
    price: 'Price',
    total: 'Total',
    subtotal: 'Subtotal',
    tax: 'Tax',
    
    // Order Status
    orderPlaced: 'Order Placed',
    preparing: 'Preparing',
    ready: 'Ready for Pickup',
    completed: 'Completed',
    cancelled: 'Cancelled',
    
    // Token Rewards
    currentPoints: 'Current Points',
    earnPoints: 'Earn Points',
    redeemRewards: 'Redeem Rewards',
    loyaltyTier: 'Loyalty Tier',
    bronze: 'Bronze',
    silver: 'Silver',
    gold: 'Gold',
    platinum: 'Platinum',
    
    // Common Actions
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    
    // Restaurant Dashboard
    liveOrders: 'Live Orders',
    kitchenDisplay: 'Kitchen Display',
    analytics: 'Analytics',
    printOrder: 'Print Order',
    markReady: 'Mark Ready',
    customerInfo: 'Customer Info'
  },
  
  es: {
    // Navigation & Core UI
    home: 'Inicio',
    menu: 'Menú',
    cart: 'Carrito',
    orders: 'Pedidos',
    rewards: 'Recompensas',
    dashboard: 'Panel',
    settings: 'Configuración',
    
    // AI Chat Interface
    chatPlaceholder: 'Chatea con OrderFi AI para hacer tu pedido...',
    voiceButton: 'Pedido por Voz',
    sendMessage: 'Enviar',
    aiGreeting: '¡Hola! Soy OrderFi AI. ¿Qué te gustaría pedir hoy?',
    orderConfirmation: '¡Excelente elección! Lo he agregado a tu carrito.',
    
    // Menu & Ordering
    addToCart: 'Agregar al Carrito',
    removeFromCart: 'Eliminar',
    customizations: 'Personalizaciones',
    specialInstructions: 'Instrucciones Especiales',
    quantity: 'Cantidad',
    price: 'Precio',
    total: 'Total',
    subtotal: 'Subtotal',
    tax: 'Impuesto',
    
    // Order Status
    orderPlaced: 'Pedido Realizado',
    preparing: 'Preparando',
    ready: 'Listo para Recoger',
    completed: 'Completado',
    cancelled: 'Cancelado',
    
    // Token Rewards
    currentPoints: 'Puntos Actuales',
    earnPoints: 'Ganar Puntos',
    redeemRewards: 'Canjear Recompensas',
    loyaltyTier: 'Nivel de Lealtad',
    bronze: 'Bronce',
    silver: 'Plata',
    gold: 'Oro',
    platinum: 'Platino',
    
    // Common Actions
    confirm: 'Confirmar',
    cancel: 'Cancelar',
    save: 'Guardar',
    edit: 'Editar',
    delete: 'Eliminar',
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    
    // Restaurant Dashboard
    liveOrders: 'Pedidos en Vivo',
    kitchenDisplay: 'Pantalla de Cocina',
    analytics: 'Analíticas',
    printOrder: 'Imprimir Pedido',
    markReady: 'Marcar Listo',
    customerInfo: 'Info del Cliente'
  },
  
  pt: {
    // Navigation & Core UI
    home: 'Início',
    menu: 'Menu',
    cart: 'Carrinho',
    orders: 'Pedidos',
    rewards: 'Recompensas',
    dashboard: 'Painel',
    settings: 'Configurações',
    
    // AI Chat Interface
    chatPlaceholder: 'Converse com OrderFi AI para fazer seu pedido...',
    voiceButton: 'Pedido por Voz',
    sendMessage: 'Enviar',
    aiGreeting: 'Oi! Eu sou o OrderFi AI. O que você gostaria de pedir hoje?',
    orderConfirmation: 'Ótima escolha! Adicionei isso ao seu carrinho.',
    
    // Menu & Ordering
    addToCart: 'Adicionar ao Carrinho',
    removeFromCart: 'Remover',
    customizations: 'Personalizações',
    specialInstructions: 'Instruções Especiais',
    quantity: 'Quantidade',
    price: 'Preço',
    total: 'Total',
    subtotal: 'Subtotal',
    tax: 'Taxa',
    
    // Order Status
    orderPlaced: 'Pedido Feito',
    preparing: 'Preparando',
    ready: 'Pronto para Retirada',
    completed: 'Concluído',
    cancelled: 'Cancelado',
    
    // Token Rewards
    currentPoints: 'Pontos Atuais',
    earnPoints: 'Ganhar Pontos',
    redeemRewards: 'Resgatar Recompensas',
    loyaltyTier: 'Nível de Fidelidade',
    bronze: 'Bronze',
    silver: 'Prata',
    gold: 'Ouro',
    platinum: 'Platina',
    
    // Common Actions
    confirm: 'Confirmar',
    cancel: 'Cancelar',
    save: 'Salvar',
    edit: 'Editar',
    delete: 'Excluir',
    loading: 'Carregando...',
    error: 'Erro',
    success: 'Sucesso',
    
    // Restaurant Dashboard
    liveOrders: 'Pedidos ao Vivo',
    kitchenDisplay: 'Tela da Cozinha',
    analytics: 'Análises',
    printOrder: 'Imprimir Pedido',
    markReady: 'Marcar Pronto',
    customerInfo: 'Info do Cliente'
  },
  
  fr: {
    // Navigation & Core UI
    home: 'Accueil',
    menu: 'Menu',
    cart: 'Panier',
    orders: 'Commandes',
    rewards: 'Récompenses',
    dashboard: 'Tableau de Bord',
    settings: 'Paramètres',
    
    // AI Chat Interface
    chatPlaceholder: 'Chattez avec OrderFi AI pour passer votre commande...',
    voiceButton: 'Commande Vocale',
    sendMessage: 'Envoyer',
    aiGreeting: 'Salut! Je suis OrderFi AI. Que souhaitez-vous commander aujourd\'hui?',
    orderConfirmation: 'Excellent choix! Je l\'ai ajouté à votre panier.',
    
    // Menu & Ordering
    addToCart: 'Ajouter au Panier',
    removeFromCart: 'Supprimer',
    customizations: 'Personnalisations',
    specialInstructions: 'Instructions Spéciales',
    quantity: 'Quantité',
    price: 'Prix',
    total: 'Total',
    subtotal: 'Sous-total',
    tax: 'Taxe',
    
    // Order Status
    orderPlaced: 'Commande Passée',
    preparing: 'En Préparation',
    ready: 'Prêt à Emporter',
    completed: 'Terminé',
    cancelled: 'Annulé',
    
    // Token Rewards
    currentPoints: 'Points Actuels',
    earnPoints: 'Gagner des Points',
    redeemRewards: 'Échanger Récompenses',
    loyaltyTier: 'Niveau de Fidélité',
    bronze: 'Bronze',
    silver: 'Argent',
    gold: 'Or',
    platinum: 'Platine',
    
    // Common Actions
    confirm: 'Confirmer',
    cancel: 'Annuler',
    save: 'Sauvegarder',
    edit: 'Modifier',
    delete: 'Supprimer',
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    
    // Restaurant Dashboard
    liveOrders: 'Commandes en Direct',
    kitchenDisplay: 'Affichage Cuisine',
    analytics: 'Analyses',
    printOrder: 'Imprimer Commande',
    markReady: 'Marquer Prêt',
    customerInfo: 'Info Client'
  }
};

// Language detection based on browser preferences
export function detectLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') return 'en';
  
  const browserLang = navigator.language.toLowerCase();
  
  if (browserLang.startsWith('es')) return 'es';
  if (browserLang.startsWith('pt')) return 'pt';
  if (browserLang.startsWith('fr')) return 'fr';
  
  return 'en';
}

// Get translation for current language
export function t(key: keyof Translation, language: SupportedLanguage = 'en'): string {
  return translations[language][key] || translations.en[key];
}

// AI prompt localization for different languages
export const aiPrompts: Record<SupportedLanguage, string> = {
  en: `You are OrderFi AI, a friendly restaurant ordering assistant. Help customers place orders using conversational language. Keep responses under 3 sentences. When mentioning menu items, use this format: **Item Name** so they become clickable buttons.`,
  
  es: `Eres OrderFi AI, un asistente amigable para pedidos de restaurante. Ayuda a los clientes a hacer pedidos usando lenguaje conversacional. Mantén las respuestas bajo 3 oraciones. Cuando menciones elementos del menú, usa este formato: **Nombre del Elemento** para que se conviertan en botones clickeables.`,
  
  pt: `Você é OrderFi AI, um assistente amigável para pedidos de restaurante. Ajude os clientes a fazer pedidos usando linguagem conversacional. Mantenha as respostas com menos de 3 frases. Ao mencionar itens do menu, use este formato: **Nome do Item** para que se tornem botões clicáveis.`,
  
  fr: `Vous êtes OrderFi AI, un assistant amical pour les commandes de restaurant. Aidez les clients à passer des commandes en utilisant un langage conversationnel. Gardez les réponses sous 3 phrases. Lorsque vous mentionnez des éléments du menu, utilisez ce format: **Nom de l'Élément** pour qu'ils deviennent des boutons cliquables.`
};