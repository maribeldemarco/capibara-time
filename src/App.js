import React, { useState, useEffect, useRef } from 'react';
import './styles.css';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alarmTime, setAlarmTime] = useState("");
  const [isAlarmSet, setIsAlarmSet] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  
  // Referencia para el sonido de la alarma
  const audioRef = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/1017/1017-preview.mp3'));
  audioRef.current.loop = true;

  // Actualizar el reloj cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Comprobar la alarma
  useEffect(() => {
    if (isAlarmSet && !isRinging) {
      const now = currentTime.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
      if (now === alarmTime) {
        setIsRinging(true);
        audioRef.current.play().catch(e => console.log("Esperando interacción para sonar..."));
      }
    }
  }, [currentTime, alarmTime, isAlarmSet, isRinging]);

  const toggleAlarm = () => {
    if (isRinging) {
      stopAlarm();
    } else {
      setIsAlarmSet(!isAlarmSet);
    }
  };

  const stopAlarm = () => {
    setIsRinging(false);
    setIsAlarmSet(false);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  return (
    <div className="container">
      <div className={`glass-card ${isRinging ? 'shake' : ''}`}>
        <h1 className="clock">
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </h1>
        
        <p className="date">
          {currentTime.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>

        <div className="alarm-section">
          <input 
            type="time" 
            className="time-input"
            value={alarmTime}
            onChange={(e) => setAlarmTime(e.target.value)}
            disabled={isAlarmSet}
          />
          
          <button 
            className={`btn ${isAlarmSet ? 'btn-active' : ''} ${isRinging ? 'btn-ringing' : ''}`}
            onClick={toggleAlarm}
          >
            {isRinging ? 'DETENER ALARMA' : (isAlarmSet ? 'CANCELAR ALARMA' : 'ACTIVAR ALARMA')}
          </button>
        </div>

        {isAlarmSet && !isRinging && <p className="status">Alarma programada para las {alarmTime}</p>}
        {isRinging && <p className="status blink">¡DESPIERTA, CAPIBARA TIME!</p>}
      </div>
      
      <div className="footer">OK I PULL UP 🐾</div>
    </div>
  );
}

export default App;