import React, { useState, useEffect } from 'react';
import { Settings, MapPin, ClipboardList, Trash2, Plus, LogIn } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Badge from '../components/Badge';
import { getCampaigns, saveCampaigns, getQuestions, saveQuestions } from '../utils/dataStore';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  const [activeTab, setActiveTab] = useState('campaigns');
  
  const [campaigns, setCampaigns] = useState([]);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    setCampaigns(getCampaigns());
    setQuestions(getQuestions());
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert("Contraseña incorrecta. Prueba 'admin123'");
    }
  };

  // -- CAMPAIGNS MNGMT --
  const addNewCampaign = () => {
    const newCamp = {
       id: Date.now(),
       name: "",
       address: "",
       date: "",
       hours: "",
       urgent: false,
       lat: -34.9, lng: -56.1 // random offset for distance
    };
    // Agregarlo AL PRINCIPIO de la lista para que sea súper visible
    const updated = [newCamp, ...campaigns];
    setCampaigns(updated);
    saveCampaigns(updated);
  };

  const updateCampaign = (id, field, value) => {
    const updated = campaigns.map(c => c.id === id ? { ...c, [field]: value } : c);
    setCampaigns(updated);
    saveCampaigns(updated);
  };

  const handleAddressBlur = async (id, addressStr) => {
    if (!addressStr || addressStr.length < 5) return;
    try {
       // OpenStreetMap Geocoding API (Gratis, sin Key)
       const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressStr + ', Uruguay')}`);
       const data = await res.json();
       if (data && data.length > 0) {
          const updated = campaigns.map(c => c.id === id ? { ...c, lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) } : c);
          setCampaigns(updated);
          saveCampaigns(updated);
       }
    } catch (e) {
       console.error("Geocoding API error:", e);
    }
  };

  const removeCampaign = (id) => {
    if(!window.confirm("¿Eliminar este centro?")) return;
    const updated = campaigns.filter(c => c.id !== id);
    setCampaigns(updated);
    saveCampaigns(updated);
  };

  // -- QUESTIONS MNGMT --
  const addNewQuestion = () => {
    const newQ = { id: Date.now(), text: "", requiresYes: true, imageUrl: "" };
    const updated = [newQ, ...questions];
    setQuestions(updated);
    saveQuestions(updated);
  };

  const updateQuestion = (id, field, value) => {
    const updated = questions.map(q => q.id === id ? { ...q, [field]: value } : q);
    setQuestions(updated);
    saveQuestions(updated);
  };

  const removeQuestion = (id) => {
    if(!window.confirm("¿Eliminar esta pregunta?")) return;
    const updated = questions.filter(q => q.id !== id);
    setQuestions(updated);
    saveQuestions(updated);
  };

  if (!isAuthenticated) {
    return (
      <div className="container flex items-center justify-center fade-in" style={{ minHeight: '60vh' }}>
        <Card style={{ padding: '3rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
           <Settings size={48} className="text-primary mx-auto mb-4" />
           <h2 className="mb-2">Acceso Administrativo</h2>
           <p className="text-muted text-sm mb-6">Área restringida. Ingresa la contraseña maestra para modificar la plataforma.</p>
           <form onSubmit={handleLogin}>
              <Input 
                id="admin-pass" 
                type="password" 
                placeholder="Contraseña (admin123)" 
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <Button variant="primary" className="w-full mt-4 flex justify-center gap-2 items-center" type="submit">
                 <LogIn size={18} /> Entrar al Panel
              </Button>
           </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="admin-dashboard container fade-in" style={{ padding: '2rem 1.5rem', maxWidth: '1000px' }}>
      <div className="dashboard-header mb-8" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem'}}>
        <div>
          <h1 className="mb-1 flex items-center gap-2 text-primary"><Settings size={28}/> CMS BloodLink</h1>
          <p className="text-muted">Control total de la plataforma en tiempo real.</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
         <Button variant={activeTab === 'campaigns' ? 'primary' : 'secondary'} onClick={() => setActiveTab('campaigns')}>
            <MapPin size={16} className="mr-2 inline" /> Centros y Urgencias
         </Button>
         <Button variant={activeTab === 'questions' ? 'primary' : 'secondary'} onClick={() => setActiveTab('questions')}>
            <ClipboardList size={16} className="mr-2 inline" /> Preguntas (RapidPass)
         </Button>
      </div>

      {activeTab === 'campaigns' && (
        <Card className="fade-in" style={{ padding: '2rem' }}>
           <div className="flex justify-between items-center mb-6">
              <h3>Directorio de Centros de Donación</h3>
              <Button variant="secondary" size="sm" onClick={addNewCampaign}><Plus size={16} className="mr-1"/> Nuevo Centro</Button>
           </div>
           
           <div className="flex flex-col gap-4">
              {campaigns.map(camp => (
                <div key={camp.id} style={{ border: '1px solid var(--border)', padding: '1.5rem', borderRadius: 'var(--rounded-md)', background: 'var(--bg)' }}>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <Input label="Nombre del Centro" value={camp.name} onChange={e => updateCampaign(camp.id, 'name', e.target.value)} />
                      <Input label="Teléfono (WhatsApp)" value={camp.phone || ''} onChange={e => updateCampaign(camp.id, 'phone', e.target.value)} placeholder="Ej. 59891234567" />
                      <Input 
                        label="Dirección (Geolocalización Automática)" 
                        value={camp.address} 
                        onChange={e => updateCampaign(camp.id, 'address', e.target.value)} 
                        onBlur={e => handleAddressBlur(camp.id, e.target.value)}
                        placeholder="Ej. Av. Italia 2800"
                      />
                      <Input label="Días de Atención" value={camp.date} onChange={e => updateCampaign(camp.id, 'date', e.target.value)} />
                      <Input label="Horarios" value={camp.hours} onChange={e => updateCampaign(camp.id, 'hours', e.target.value)} />
                   </div>
                   <div className="flex justify-between items-center pt-4" style={{borderTop: '1px solid var(--border)'}}>
                      <div className="flex items-center gap-3">
                         <span className="text-sm font-semibold">Estado de Urgencia:</span>
                         <label className="flex items-center gap-2 cursor-pointer text-sm">
                           <input type="checkbox" checked={camp.urgent} onChange={e => updateCampaign(camp.id, 'urgent', e.target.checked)} />
                           {camp.urgent ? <Badge variant="primary">CRÍTICO</Badge> : <Badge variant="secondary">NORMAL</Badge>}
                         </label>
                      </div>
                      <Button variant="ghost" className="text-error" onClick={() => removeCampaign(camp.id)}>
                         <Trash2 size={16} /> Eliminar
                      </Button>
                   </div>
                </div>
              ))}
              {campaigns.length === 0 && <p className="text-muted text-center py-4">No hay hospitales registrados. Agrega uno.</p>}
           </div>
        </Card>
      )}

      {activeTab === 'questions' && (
        <Card className="fade-in" style={{ padding: '2rem' }}>
           <div className="flex justify-between items-center mb-6">
              <div>
                <h3>Cuestionario (Requisitos)</h3>
                <p className="text-muted text-sm">Define las reglas para que un donante sea aprobado o rechazado al querer agendarse.</p>
              </div>
              <Button variant="secondary" size="sm" onClick={addNewQuestion}><Plus size={16} className="mr-1"/> Nueva Pregunta</Button>
           </div>

           <div className="flex flex-col gap-3">
              {questions.map((q, i) => (
                <div key={q.id} className="flex gap-4 items-center bg-gray p-3 rounded-md border">
                   <span className="font-bold text-muted w-6">{i+1}.</span>
                   <div className="flex-1 flex flex-col gap-2">
                      <input 
                        className="w-full bg-transparent border-none outline-none font-medium" 
                        value={q.text} 
                        onChange={e => updateQuestion(q.id, 'text', e.target.value)}
                        placeholder="Escribe la pregunta médica..."
                      />
                      <input 
                        className="w-full bg-transparent border-none outline-none text-xs text-primary" 
                        value={q.imageUrl || ''} 
                        onChange={e => updateQuestion(q.id, 'imageUrl', e.target.value)}
                        placeholder="URL de imagen opcional (Unsplash, etc.)"
                      />
                   </div>
                   <div className="flex items-center gap-2 border-l pl-4">
                      <span className="text-xs text-muted">Aprobar con:</span>
                      <select 
                        className="p-1 rounded bg-white text-sm" 
                        value={q.requiresYes ? 'yes' : 'no'}
                        onChange={e => updateQuestion(q.id, 'requiresYes', e.target.value === 'yes')}
                      >
                         <option value="yes">SÍ</option>
                         <option value="no">NO</option>
                      </select>
                   </div>
                   <button className="text-muted hover:text-error ml-2" onClick={() => removeQuestion(q.id)}><Trash2 size={16}/></button>
                </div>
              ))}
           </div>
        </Card>
      )}
    </div>
  );
};

export default AdminDashboard;
