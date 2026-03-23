import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, CheckCircle, XCircle, ClipboardList, Heart, ShieldCheck, Contact, Moon, Coffee } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { getQuestions } from '../utils/dataStore';
import './RapidPass.css';

const RapidPass = () => {
  const navigate = useNavigate();
  const [QUESTIONS, setQuestions] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [result, setResult] = useState(null);

  useEffect(() => {
    setQuestions(getQuestions());
  }, []);

  const handleAnswer = (isFailTrigger) => {
    if (isFailTrigger) {
      setResult('fail');
      sessionStorage.removeItem('rapidPassPassed');
    } else {
      if (currentStep < QUESTIONS.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setResult('success');
        sessionStorage.setItem('rapidPassPassed', 'true');
      }
    }
  };

  const handleStart = () => setCurrentStep(0);

  const getCurrentImage = () => {
    const defaultImage = 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=1000&auto=format&fit=crop';
    if (result === 'success' || result === 'fail' || currentStep === -1) {
      return defaultImage;
    }
    return QUESTIONS[currentStep]?.imageUrl || defaultImage;
  };

  const currentImage = getCurrentImage();

  if (result === 'success') {
    return (
      <div className="rapidpass-layout">
        <div className="rapidpass-image-side fade-in" style={{ backgroundImage: `url(${currentImage})` }}></div>
        <div className="rapidpass-content-side p-0 md:p-8">
          <Card className="rapidpass-card fade-in" style={{ borderTop: '4px solid var(--success)', maxWidth: '600px', width: '100%' }}>
            <div className="text-center mb-6">
               <ShieldCheck size={56} className="text-success mx-auto mb-3" />
               <h2>¡Estás a un paso de donar!</h2>
               <p className="text-muted mt-2">Según tus respuestas, cumples con la elegibilidad básica. Recuerda cumplir con estas condiciones el día que vayas al centro:</p>
            </div>
            
            <div className="flex flex-col gap-4 mb-8">
               <div className="flex gap-4 p-4 rounded-lg bg-gray border border-gray-200 items-start">
                  <div className="text-primary mt-0.5"><Contact size={20} /></div>
                  <div className="text-sm">
                     <strong>Documento de Identidad:</strong> <span className="text-muted">Debes presentar tu Cédula de Identidad vigente y en buen estado físico.</span>
                  </div>
               </div>
               
               <div className="flex gap-4 p-4 rounded-lg bg-gray border border-gray-200 items-start">
                  <div className="text-primary mt-0.5"><Heart size={20} /></div>
                  <div className="text-sm">
                     <strong>Buen estado de salud:</strong> <span className="text-muted">Es fundamental que te sientas plenamente sano/a al momento de asistir.</span>
                  </div>
               </div>
               
               <div className="flex gap-4 p-4 rounded-lg bg-gray border border-gray-200 items-start">
                  <div className="text-primary mt-0.5"><Moon size={20} /></div>
                  <div className="text-sm">
                     <strong>Descanso adecuado:</strong> <span className="text-muted">Haber dormido ininterrumpidamente al menos 6 horas la noche anterior.</span>
                  </div>
               </div>
               
               <div className="flex gap-4 p-4 rounded-lg bg-gray border border-gray-200 items-start">
                  <div className="text-primary mt-0.5"><Coffee size={20} /></div>
                  <div className="text-sm">
                     <strong>Alimentación previa:</strong> <span className="text-muted">¡No vayas en ayunas! Toma un desayuno con líquidos azucarados y sin grasa.</span>
                  </div>
               </div>
            </div>

            <Button variant="primary" size="lg" className="w-full" onClick={() => navigate('/campaigns')}>
               Entendido, elegir centro de donación
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (result === 'fail') {
    return (
      <div className="rapidpass-layout">
        <div className="rapidpass-image-side fade-in" style={{ backgroundImage: `url(${currentImage})` }}></div>
        <div className="rapidpass-content-side">
          <Card className="rapidpass-card text-center fade-in" style={{ borderTop: '4px solid var(--primary)' }}>
            <Heart size={64} className="text-primary mx-auto mb-4" />
            <h2 className="mb-2">Gracias por tu intención</h2>
            <p className="text-muted mb-6" style={{ lineHeight: '1.6' }}>
              De acuerdo a tus respuestas, este no es el momento ideal para que dones sangre. Las normativas médicas buscan proteger tanto tu salud como la del paciente receptor.
              <br/><br/>
              ¡Te invitamos a volver a intentarlo más adelante!
            </p>
            <Button variant="secondary" className="w-full" onClick={() => navigate('/')}>Volver al inicio</Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="rapidpass-layout">
      <div className="rapidpass-image-side fade-in" style={{ backgroundImage: `url(${currentImage})` }}>
         {/* Layout Cover Image */}
      </div>
      <div className="rapidpass-content-side">
        <Card className="rapidpass-card shadow-lg fade-in">
        {currentStep === -1 ? (
          <div className="text-center fade-in">
            <ClipboardList size={48} className="text-primary mx-auto mb-4" />
            <h2>Quiero donar sangre</h2>
            <p className="text-muted mt-2 mb-6">Para donar sangre es fundamental cuidar tu salud y la de quien reciba la donación. Por favor, responde las siguientes preguntas de forma sincera.</p>
            <Button variant="primary" className="w-full" size="lg" onClick={handleStart} disabled={QUESTIONS.length === 0}>
               Comenzar Preguntas
            </Button>
          </div>
        ) : (
          <div className="fade-in">
             <div className="mb-4 flex items-center justify-end text-sm font-semibold text-muted">
                <span>Pregunta {currentStep + 1} de {QUESTIONS.length}</span>
             </div>
             
             <div className="progress-bar mb-6">
                <div className="progress-fill" style={{ width: `${((currentStep) / QUESTIONS.length) * 100}%` }}></div>
             </div>

             <h2 className="mb-8 font-semibold text-xl leading-relaxed">
               {QUESTIONS[currentStep]?.text}
             </h2>

             <div className="grid grid-cols-2 gap-3">
                 <Button 
                    variant="outline" 
                    className="w-full text-center py-4 bg-white" 
                    style={{ border: '1px solid var(--border)', color: 'var(--text)' }}
                    size="lg" 
                    onClick={() => handleAnswer(!QUESTIONS[currentStep]?.requiresYes)}
                 >
                    SÍ
                 </Button>
                 <Button 
                    variant="outline" 
                    className="w-full text-center py-4 bg-white" 
                    style={{ border: '1px solid var(--border)', color: 'var(--text)' }}
                    size="lg" 
                    onClick={() => handleAnswer(QUESTIONS[currentStep]?.requiresYes)}
                 >
                    NO
                 </Button>
             </div>
          </div>
        )}
      </Card>
      </div>
    </div>
  );
};

export default RapidPass;
