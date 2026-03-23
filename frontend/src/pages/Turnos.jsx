import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { Search, ExternalLink, XCircle } from 'lucide-react';

const Turnos = () => {
  const [formData, setFormData] = useState({ ci: '', email: '' });
  const [searched, setSearched] = useState(false);
  const [turno, setTurno] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearched(true);
    
    const savedString = localStorage.getItem('myAppointment');
    if (savedString) {
      const saved = JSON.parse(savedString);
      if (saved.ci === formData.ci && saved.email === formData.email) {
        setTurno({
          id: saved.id,
          hospital: 'Centro Htto. Donación', // Valor genérico si no guardamos el nombre del hospital real
          date: saved.date,
          time: saved.time,
          status: saved.status
        });
        return;
      }
    }
    
    // Si no coincide o no hay guardado, setear a nulo
    setTurno(null);
  };

  const handleAnularTurno = () => {
    if (window.confirm("¿Estás seguro que deseas anular tu turno de donación de forma permanente?")) {
      localStorage.removeItem('myAppointment');
      setTurno(null);
      setSearched(false);
      setFormData({ ci: '', email: '' });
      alert("Tu turno ha sido anulado correctamente de nuestra base de datos. ¡Esperamos volver a verte pronto!");
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1rem', maxWidth: '600px' }}>
      <div className="mb-8 text-center">
        <h2>Gestión de Turnos</h2>
        <p className="text-muted">Consulta los detalles de tu próximo turno o cancélalo si no podrás asistir.</p>
      </div>

      <Card style={{ padding: '2rem', marginBottom: '2rem' }}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 mb-4">
            <Input 
              id="ci" 
              label="Cédula de Identidad" 
              placeholder="Ej. 12345678" 
              value={formData.ci} 
              onChange={e => setFormData({...formData, ci: e.target.value})} 
              required 
            />
            <Input 
              id="email" 
              type="email" 
              label="Correo Electrónico" 
              placeholder="El email que usaste para agendar" 
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
              required 
            />
          </div>
          <Button variant="primary" className="w-full flex justify-center items-center gap-2" type="submit">
            <Search size={18} /> Buscar mi turno
          </Button>
        </form>
      </Card>

      {searched && (
        <div className="fade-in">
          {turno ? (
            <Card style={{ padding: '2rem', borderLeft: '4px solid var(--primary)' }}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="mb-1">Turno Confirmado</h3>
                  <p className="text-muted text-sm">ID: {turno.id}</p>
                </div>
                <span className="bg-success text-white px-3 py-1 rounded-full text-sm font-semibold">{turno.status}</span>
              </div>
              
              <div style={{ background: 'var(--bg)', padding: '1rem', borderRadius: 'var(--rounded-md)', marginBottom: '1.5rem' }}>
                <p className="mb-2"><strong>Centro:</strong> {turno.hospital}</p>
                <p className="mb-2"><strong>Fecha:</strong> {turno.date}</p>
                <p className="mb-0"><strong>Hora:</strong> {turno.time}</p>
              </div>

              <div className="flex gap-4">
                <Button variant="secondary" className="w-full flex justify-center items-center gap-2" onClick={() => alert("Simulando envío de tu comprobante de turno a tu correo electrónico asociado...")}>
                   <ExternalLink size={16} /> Reenviar Email
                </Button>
                <Button className="w-full flex justify-center items-center gap-2" style={{background: 'transparent', color: 'var(--error)', border: '1px solid var(--error)'}} onClick={handleAnularTurno}>
                   <XCircle size={16} /> Anular Turno
                </Button>
              </div>
            </Card>
          ) : (
            <Card style={{ padding: '2rem', textAlign: 'center' }}>
              <XCircle size={48} className="text-error mx-auto mb-4" />
              <h3>No encontramos ningún turno activo</h3>
              <p className="text-muted">Revisa que la cédula y el email coincidan con los datos que ingresaste al agendar.</p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default Turnos;
