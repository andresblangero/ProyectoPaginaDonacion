import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, User, CheckCircle, Clock, ChevronRight, ChevronLeft, Send, AlertCircle, ExternalLink, MessageCircle } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { getCampaigns } from '../utils/dataStore';
import './BookAppointment.css';

// Helpers para generar dias
const getUpcomingDays = (count) => {
  const days = [];
  const today = new Date();
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  
  for (let i = 1; i <= count; i++) {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + i);
    // Evitar domingos enteros
    if (nextDate.getDay() !== 0) {
      days.push({
        id: nextDate.toISOString().split('T')[0],
        label: nextDate.toLocaleDateString('es-ES', options),
        day: nextDate.getDate(),
        weekday: nextDate.toLocaleDateString('es-ES', { weekday: 'short' }),
        full: nextDate
      });
    }
  }
  return days;
};

const TIME_SLOTS = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00"];

const BookAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ date: '', time: '', name: '', ci: '', email: '', phone: '' });
  
  const campaign = getCampaigns().find(c => c.id.toString() === (id || '').toString()) || { name: 'Centro Médico', phone: '59899123456' };

  React.useEffect(() => {
    if (sessionStorage.getItem('rapidPassPassed') !== 'true') {
      navigate('/rapidpass');
    }
  }, [navigate]);

  const upcomingDays = getUpcomingDays(7); // Proximos 7 dias habiles

  const [emailPreviewUrl, setEmailPreviewUrl] = useState(null);

  const handleNext = (e) => {
    e.preventDefault();
    if (formData.date && formData.time) setStep(2);
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (!formData.phone) {
      alert("Por favor, ingresa tu teléfono para enviarte la confirmación por WhatsApp.");
      return;
    }
    setLoading(true);

    // 1. Disparo del Webhook de WhatsApp hacia n8n (Totalmente Independiente)
    // Nota: Cuando actives el flujo en n8n permanentemente, cambia /webhook-test/ por /webhook/
    try {
      await fetch('https://andyblanger.app.n8n.cloud/webhook-test/cec21c5f-a471-4237-a447-101035e387fc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hospital: campaign.name,
          nombre_donante: formData.name,
          cedula: formData.ci,
          telefono: formData.phone,
          fecha: formData.date,
          hora: formData.time,
          email: formData.email
        })
      });
      console.log("✅ Datos enviados exitosamente al Webhook de n8n");
    } catch(err) {
      console.error("❌ Falló la conexión con n8n", err);
    }
    
    // 2. Envío Simulador Correo Electrónico
    try {
      const response = await fetch('http://localhost:5000/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      if (data.previewUrl) setEmailPreviewUrl(data.previewUrl);
    } catch (err) {
      console.log("Servidor backend de email no detectado. Avanzando de todas formas.");
    } finally {
      const newTurno = {
          ...formData,
          id: 'TRN-' + Math.floor(1000 + Math.random() * 9000),
          status: 'Confirmado'
      };
      localStorage.setItem('myAppointment', JSON.stringify(newTurno));
      
      setStep(3);
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({...formData, [e.target.id]: e.target.value});

  if (step === 3) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '600px', textAlign: 'center' }}>
        <CheckCircle size={72} className="text-success mx-auto mb-4 fade-in" />
        <h2 className="mb-2">¡Turno Confirmado!</h2>
        <p className="text-muted mb-6">Hemos reservado tu lugar con éxito en {campaign.name}.</p>
        
        <div className="flex flex-col gap-3 justify-center items-center mb-6">
           <div className="bg-success text-white px-4 py-3 rounded-md w-full max-w-sm text-left flex items-center gap-3 shadow-sm fade-in">
             <MessageCircle size={20} />
             <div className="leading-tight">
                <div className="text-xs opacity-90">Confirmación por WhatsApp</div>
                <strong>Enviada a {formData.phone}</strong>
             </div>
           </div>

           <div className="bg-primary text-white px-4 py-3 rounded-md w-full max-w-sm text-left flex items-center gap-3 shadow-sm fade-in">
             <Send size={20} />
             <div className="leading-tight">
                <div className="text-xs opacity-90">Comprobante por Correo</div>
                <strong>Enviado a {formData.email}</strong>
             </div>
           </div>
        </div>

        {emailPreviewUrl && (
          <div className="mb-6 fade-in">
             <a href={emailPreviewUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" className="w-full">
                  <ExternalLink size={16} className="mr-2" /> Leer el correo electrónico enviado 
                </Button>
             </a>
             <p className="text-xs text-muted mt-2">Prueba SMTP real usando servicio Ethereal. No hace falta ir a tu bandeja privada.</p>
          </div>
        )}

        <Card style={{ background: 'var(--bg-card)', padding: '2rem', marginBottom: '2rem', textAlign: 'left', borderTop: '4px solid var(--primary)' }}>
           <h3 className="mb-4 text-md border-b pb-2">Detalles de tu comprobante</h3>
           <p className="mb-3 text-muted"><strong>Donante:</strong> <span className="text-foreground">{formData.name} (CI: {formData.ci})</span></p>
           <p className="mb-3 text-muted"><strong>Agendado para:</strong> <span className="text-foreground">{formData.date} a las {formData.time} horas</span></p>
           <p className="mb-0 text-muted flex items-start gap-2">
             <AlertCircle size={18} className="text-warning flex-shrink-0 mt-1"/> 
             <span className="text-sm">Recuerda presentarte 10 minutos antes con tu Cédula de Identidad en formato físico. Evita consumir grasas 4 horas antes de asistir.</span>
           </p>
        </Card>
        <Button variant="secondary" onClick={() => navigate('/')}>Volver al Inicio</Button>
      </div>
    )
  }

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '650px' }}>
      <div className="mb-6 flex items-center justify-between">
         <div>
            <h2 className="mb-1">Agendar Donación</h2>
            <p className="text-muted text-sm">Centro N° {id} • Completa en 2 minutos sin registro.</p>
         </div>
         <div className="flex gap-2 text-sm text-muted">
            <span className={step === 1 ? 'text-primary font-bold' : ''}>1. Fecha</span>
            <ChevronRight size={16} />
            <span className={step === 2 ? 'text-primary font-bold' : ''}>2. Datos</span>
         </div>
      </div>

      <Card style={{ padding: '2rem' }} className="fade-in">
        {step === 1 ? (
          <form onSubmit={handleNext}>
            <div className="mb-6">
              <h3 className="mb-3 text-md flex items-center gap-2"><Calendar size={18} className="text-primary"/> Selecciona un día</h3>
              <div className="calendar-grid">
                {upcomingDays.map(day => (
                  <div 
                    key={day.id} 
                    className={`calendar-day ${formData.date === day.label ? 'selected' : ''}`}
                    onClick={() => setFormData({...formData, date: day.label})}
                  >
                    <span className="weekday">{day.weekday}</span>
                    <span className="day-number">{day.day}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-8 fade-in" style={{ opacity: formData.date ? 1 : 0.4, pointerEvents: formData.date ? 'auto' : 'none' }}>
              <h3 className="mb-3 text-md flex items-center gap-2"><Clock size={18} className="text-primary"/> Selecciona la hora</h3>
              <div className="time-grid">
                 {TIME_SLOTS.map(time => (
                   <div 
                     key={time} 
                     className={`time-slot ${formData.time === time ? 'selected' : ''}`}
                     onClick={() => setFormData({...formData, time})}
                   >
                     {time}
                   </div>
                 ))}
              </div>
            </div>
            
            <Button variant="primary" className="w-full" size="lg" type="submit" disabled={!formData.date || !formData.time}>
              Continuar al último paso
            </Button>
          </form>
        ) : (
          <form onSubmit={handleConfirm} className="fade-in">
            <h3 className="mb-6 text-md flex items-center gap-2 pb-2" style={{borderBottom: '1px solid var(--border)'}}>
               <User size={18} className="text-primary"/> Tus Datos Personales
            </h3>
            
            <Input id="name" type="text" label="Nombre Completo" placeholder="Ej. Juan Pérez" value={formData.name} onChange={handleChange} required className="mb-4" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
               <Input id="ci" type="text" label="Cédula de Identidad" placeholder="Sin puntos ni guiones" value={formData.ci} onChange={handleChange} required className="mb-0" />
               <Input id="phone" type="tel" label="Celular" placeholder="Ej. 09x xxx xxx" value={formData.phone} onChange={handleChange} required className="mb-0" />
            </div>

            <Input id="email" type="email" label="Correo Electrónico" placeholder="Donde recibirás la confirmación" value={formData.email} onChange={handleChange} required className="mb-8" />
            
            <div className="flex flex-col-reverse sm:flex-row gap-4">
               <Button variant="secondary" className="w-full sm:w-auto" type="button" onClick={() => setStep(1)} disabled={loading}>
                 <ChevronLeft size={18} /> Atrás
               </Button>
               <Button variant="primary" className="w-full flex-1" size="lg" type="submit" disabled={loading}>
                 {loading ? 'Procesando...' : 'Confirmar Turno'}
               </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};

export default BookAppointment;
