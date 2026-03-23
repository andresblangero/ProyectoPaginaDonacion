import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send } from 'lucide-react';
import './JamieBot.css';

const JamieBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '¡Hola! Soy Jamie, el asistente virtual experto de BloodLink. ¿Tienes alguna duda sobre los requisitos para donar sangre u otra consulta frecuente?' }
  ]);
  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll al recibir mensaje
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Escuchar evento del Navbar "FAQ"
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-jamiebot', handleOpen);
    return () => window.removeEventListener('open-jamiebot', handleOpen);
  }, []);

  const generateBotResponse = (query) => {
    const q = query.toLowerCase();
    if (q.includes('tatuaje') || q.includes('piercing')) return 'Si te hiciste un tatuaje o un piercing, debes esperar como mínimo 6 meses antes de poder donar sangre.';
    if (q.includes('ayuno') || q.includes('comer') || q.includes('desayuno')) return 'Por tu seguridad, ¡NUNCA debes ir en ayunas a donar! Te recomendamos tomar un desayuno ligero, como té, mate o jugo, evitando fuertemente grasas y lácteos enteros.';
    if (q.includes('edad')) return 'Para donar sangre tienes que tener entre 18 y 65 años de edad cumplidos.';
    if (q.includes('peso') || q.includes('pesar')) return 'Para garantizar tu salud durante la extracción, debes pesar más de 50 kg.';
    if (q.includes('enfermedad') || q.includes('antibiotico') || q.includes('medicamento')) return 'Depende mucho de la afección. En general, no puedes donar si cursas una infección o tomas antibióticos en este momento. Si tienes dudas médicas específicas, nuestro centro te entrevistará personalmente, aunque es mejor esperar a estar totalmente sano.';
    if (q.includes('hola') || q.includes('buenas')) return '¡Hola! ¿En qué te puedo ayudar hoy? Escribe "tatuaje", "peso", "ayuno", etc.';
    if (q.includes('gracias')) return '¡De nada! Recuerda que tu sangre puede salvar hasta 3 vidas. ¡Mucha suerte!';
    if (q.includes('embarazo') || q.includes('embarazada') || q.includes('lactancia')) return 'No debes donar si estás embarazada, e incluso debes esperar hasta finalizar el período de lactancia materna.';
    return 'Lamentablemente no tengo una respuesta exacta para eso ("'+query+'"). Puedes intentar haciendo el Cuestionario inicial en el botón "Quiero Donar", ¡allí están la mayoría de las restricciones reales explicadas!';
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMsg = inputVal.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInputVal('');

    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'bot', text: generateBotResponse(userMsg) }]);
    }, 600); // Simulamos "escribiendo..."
  };

  return (
    <>
      <button className="ai-assistant-btn" onClick={() => setIsOpen(!isOpen)} aria-label="Abrir asistente Jamie">
        {isOpen ? <X size={28} /> : <Bot size={28} />}
      </button>

      {isOpen && (
        <div className="jamie-window">
          <div className="jamie-header">
            <span className="flex items-center gap-2"><Bot size={20}/> Preguntas Frecuentes Bot</span>
            <button onClick={() => setIsOpen(false)} style={{ color: 'white' }}><X size={20}/></button>
          </div>
          
          <div className="jamie-messages">
             {messages.map((msg, i) => (
                <div key={i} className={`msg ${msg.sender === 'bot' ? 'msg-bot' : 'msg-user'}`}>
                   {msg.text}
                </div>
             ))}
             <div ref={messagesEndRef} />
          </div>

          <form className="jamie-input" onSubmit={handleSend}>
             <input 
               type="text" 
               placeholder="Escribe aquí tu duda..." 
               value={inputVal} 
               onChange={e => setInputVal(e.target.value)}
             />
             <button type="submit"><Send size={16}/></button>
          </form>
        </div>
      )}
    </>
  );
};

export default JamieBot;
