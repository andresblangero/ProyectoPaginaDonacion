import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import JamieBot from './components/JamieBot';
import LandingPage from './pages/LandingPage';
import RapidPass from './pages/RapidPass';
import AdminDashboard from './pages/AdminDashboard';
import Campaigns from './pages/Campaigns';
import BookAppointment from './pages/BookAppointment';
import Turnos from './pages/Turnos';

function App() {
  return (
    <Router>
      <div className="plasma-aurora">
        <div className="plasma-blob-1"></div>
        <div className="plasma-blob-2"></div>
        <div className="plasma-blob-3"></div>
      </div>
      <div className="app-wrapper">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/rapidpass" element={<RapidPass />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/book/:id" element={<BookAppointment />} />
            <Route path="/turnos" element={<Turnos />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<div className="container text-center"><h2 className="mb-4" style={{marginTop:'4rem'}}>404 - Página no encontrada</h2></div>} />
          </Routes>
        </main>
        <JamieBot />
      </div>
    </Router>
  );
}

export default App;
