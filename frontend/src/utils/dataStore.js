export const DEFAULT_CAMPAIGNS = [
  { id: 1, name: "Hospital de Clínicas", address: "Av. Italia 2800", date: "Lun-Vie", hours: "08:00 - 12:00", urgent: true, phone: "59899123456", lat: -34.8872, lng: -56.1481 },
  { id: 2, name: "Hospital Pasteur", address: "Larravide 74", date: "Lun-Sab", hours: "07:30 - 11:30", urgent: false, phone: "59899654321", lat: -34.8814, lng: -56.1360 },
  { id: 3, name: "Hemocentro Maldonado", address: "Av. Roosevelt y Prado", date: "Mar-Vie", hours: "08:00 - 14:00", urgent: true, phone: "59899000111", lat: -34.9142, lng: -54.9563 },
  { id: 4, name: "Hospital Maciel", address: "25 de Mayo 174", date: "Lun-Mie", hours: "07:00 - 11:00", urgent: false, phone: "59899999888", lat: -34.9069, lng: -56.2086 },
  { id: 5, name: "Médica Uruguaya", address: "Av. 8 de Octubre 2492", date: "Lun-Vie", hours: "08:00 - 13:00", urgent: true, phone: "59899777666", lat: -34.8888, lng: -56.1542 }
];

export const DEFAULT_QUESTIONS = [
  { id: 1, text: "¿Tienes entre 18 y 65 años de edad?", requiresYes: true, imageUrl: "https://images.unsplash.com/photo-1534488972407-5a4aa668e1ab?q=80&w=800&auto=format&fit=crop" },
  { id: 2, text: "¿Pesas más de 50 kg?", requiresYes: true, imageUrl: "https://images.unsplash.com/photo-1518152006812-edab29b069ac?q=80&w=800&auto=format&fit=crop" },
  { id: 3, text: "¿Te has hecho un tatuaje o piercing en los últimos 6 meses?", requiresYes: false, imageUrl: "https://images.unsplash.com/photo-1558249673-cd5e9bedf3e2?q=80&w=800&auto=format&fit=crop" },
  { id: 4, text: "¿Padeces alguna enfermedad infecciosa como Hepatitis C, VIH o Sífilis?", requiresYes: false, imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop" }
];

export const getCampaigns = () => {
  try {
    const data = localStorage.getItem('adminCampaigns');
    return data ? JSON.parse(data) : DEFAULT_CAMPAIGNS;
  } catch(e) {
    return DEFAULT_CAMPAIGNS;
  }
};

export const saveCampaigns = (campaigns) => localStorage.setItem('adminCampaigns', JSON.stringify(campaigns));

export const getQuestions = () => {
  try {
    const data = localStorage.getItem('adminQuestions');
    return data ? JSON.parse(data) : DEFAULT_QUESTIONS;
  } catch(e) {
    return DEFAULT_QUESTIONS;
  }
};

export const saveQuestions = (questions) => localStorage.setItem('adminQuestions', JSON.stringify(questions));
