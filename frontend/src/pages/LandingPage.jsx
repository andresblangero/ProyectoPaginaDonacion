import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Activity, ClipboardList, MapPin, Calendar } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import './LandingPage.css';

const LandingPage = () => {
  const handleMouseMove = (e) => {
    const orb = document.querySelector('.hero-orb');
    if (!orb) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left; 
    const y = e.clientY - rect.top;  
    
    // Calcular inclinación magnética (-30deg a +30deg)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -30; 
    const rotateY = ((x - centerX) / centerX) * 30; 
    
    orb.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
  };

  const handleMouseLeave = () => {
    const orb = document.querySelector('.hero-orb');
    if (!orb) return;
    orb.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Salva múltiples vidas <br />
              <span className="text-primary">hoy mismo.</span>
            </h1>
            <p className="hero-subtitle">
              Conectamos donantes voluntarios con quienes más lo necesitan en tiempo real. 
              Donar sangre nunca fue tan rápido, fácil y transparente.
            </p>
            <div className="hero-actions">
              <Link to="/rapidpass">
                <Button variant="primary" size="lg">Quiero Donar</Button>
              </Link>
            </div>
          </div>
          
          <div className="hero-image-wrapper">
             <div 
               className="hero-orb-wrapper fade-in"
               onMouseMove={handleMouseMove}
               onMouseLeave={handleMouseLeave}
             >
                <div className="hero-orb-float">
                  <div className="hero-orb"></div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features bg-gray">
        <div className="container">
          <div className="section-header text-center mb-8">
            <h2>Cómo funciona</h2>
          </div>
          <div className="features-grid">
            <Card className="feature-card text-center">
              <div className="feature-icon"><ClipboardList size={32} /></div>
              <h3>1. Test de Elegibilidad</h3>
              <p className="text-muted">Descubre en segundos si puedes ser donante respondiendo un breve y confidencial cuestionario médico interactivo.</p>
            </Card>
            <Card className="feature-card text-center">
              <div className="feature-icon"><MapPin size={32} /></div>
              <h3>2. Ubica tu Centro Local</h3>
              <p className="text-muted">Desplegamos los hospitales, campañas y rondas móviles disponibles basándonos en la proximidad de tu área.</p>
            </Card>
            <Card className="feature-card text-center">
              <div className="feature-icon"><Calendar size={32} /></div>
              <h3>3. Agenda tu Turno</h3>
              <p className="text-muted">Reserva el horario que prefieras completando tus datos básicos. Te enviaremos tu comprobante por WhatsApp al instante sin necesidad de crear una cuenta.</p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
