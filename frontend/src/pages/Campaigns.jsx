import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, ChevronRight, Navigation } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { getCampaigns } from '../utils/dataStore';

// Helper formula Haversine para calcular distancia en km
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radio de la tierra
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const Campaigns = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState(getCampaigns());
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    // Verificar si pasó el RapidPass
    if (sessionStorage.getItem('rapidPassPassed') !== 'true') {
      navigate('/rapidpass');
      return;
    }

    // Intentar geolocalizar al cargar
    if ("geolocation" in navigator) {
      setLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          
          const rawCamps = [...getCampaigns()];
          
          const updatedCamps = rawCamps.map((camp) => {
             // Utilizando exclusivamente fórmula Haversine local para asegurar determinismo
             // y evitar cuellos de botella/bloqueos CORS con la API pública de OSRM
             return {
               ...camp,
               distance: calculateDistance(userLat, userLng, camp.lat, camp.lng)
             };
          });
          
          const sorted = updatedCamps.sort((a, b) => a.distance - b.distance);
          
          setCampaigns(sorted);
          setLoadingLocation(false);
        },
        (error) => {
          console.error("Geoloc error:", error);
          setLocationError("No pudimos obtener tu ubicación exacta.");
          setLoadingLocation(false);
        }
      );
    }
  }, []);

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '1000px' }}>
      <div className="mb-6">
        <h2 className="mb-2">Centros de Donación</h2>
        <p className="text-muted">
          {loadingLocation ? 
            <span className="flex items-center gap-2 text-primary"><Navigation size={16} className="animate-spin" /> Calculando los hospitales más cercanos a ti...</span> : 
            "Selecciona el hospital o campaña móvil más cercano para agendar tu turno."
          }
        </p>
        {!loadingLocation && !locationError && campaigns[0]?.distance && (
          <p className="text-success text-sm font-semibold">📍 Centros ordenados por cercanía a tu ubicación.</p>
        )}
      </div>

      <div className="grid" style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {campaigns.map(camp => (
          <Card key={camp.id} style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', marginTop: '0.5rem' }}>{camp.name}</h3>
              
              <div className="flex items-center gap-2 text-muted text-sm mb-2">
                <MapPin size={16} /> 
                <span>{camp.address} 
                   {camp.distance && <strong className="text-primary ml-1">({camp.distance.toFixed(1)} km)</strong>}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted text-sm mb-2">
                <Calendar size={16} /> {camp.date}
              </div>
              <div className="flex items-center gap-2 text-muted text-sm">
                <Clock size={16} /> {camp.hours}
              </div>
            </div>
            
            <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
              <Button 
                variant="primary"
                className="w-full flex justify-between items-center" 
                onClick={() => navigate(`/book/${camp.id}`)}
              >
                Elegir este centro <ChevronRight size={18} />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Campaigns;
