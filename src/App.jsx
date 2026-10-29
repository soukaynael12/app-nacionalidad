import { useState } from 'react';

function App() {
  const [iniciado, setIniciado] = useState(false);
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [puntuacion, setPuntuacion] = useState(0);

  // Nuestro banco de preguntas
  const preguntas = [
    {
      pregunta: "¿Quién es el Jefe del Estado en España?",
      opciones: ["El Presidente del Gobierno", "El Rey", "El Alcalde"],
      correcta: 1 // El índice 1 es "El Rey"
    },
    {
      pregunta: "¿Cuál es la capital de España?",
      opciones: ["Barcelona", "Madrid", "Sevilla"],
      correcta: 1 // El índice 1 es "Madrid"
    }
  ];

  // Función para comprobar la respuesta
  function comprobarRespuesta(indiceSeleccionado) {
    if (indiceSeleccionado === preguntas[preguntaActual].correcta) {
      setPuntuacion(puntuacion + 1);
      alert("¡Correcto! 🎉");
    } else {
      alert("Incorrecto ❌");
    }

    // Pasamos a la siguiente pregunta o terminamos
    if (preguntaActual + 1 < preguntas.length) {
      setPreguntaActual(preguntaActual + 1);
    } else {
      alert("Test terminado. Tu puntuación es: " + puntuacion + "/" + preguntas.length);
      setIniciado(false);
      setPreguntaActual(0);
      setPuntuacion(0);
    }
  }

  if (!iniciado) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial' }}>
        <h1>Test de Nacionalidad Española ES</h1>
        <p>Practica las preguntas oficiales del examen CCSE.</p>
        <button 
          onClick={() => setIniciado(true)}
          style={{ padding: '10px 20px', fontSize: '18px', cursor: 'pointer', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          Empezar Test
        </button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial' }}>
      <h2>Pregunta {preguntaActual + 1} de {preguntas.length}</h2>
      <h3>{preguntas[preguntaActual].pregunta}</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
        {preguntas[preguntaActual].opciones.map((opcion, index) => (
          <button 
            key={index}
            onClick={() => comprobarRespuesta(index)}
            style={{ padding: '10px', width: '300px', fontSize: '16px', cursor: 'pointer' }}
          >
            {opcion}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;