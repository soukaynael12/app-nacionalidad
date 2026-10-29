import { useState, useEffect } from 'react';

export default function TriviaApp() {
const [preguntas, setPreguntas] = useState([]);
const [indiceActual, setIndiceActual] = useState(0);
const [puntuacion, setPuntuacion] = useState(0);
const [tiempoRestante, setTiempoRestante] = useState(15);
const [juegoTerminado, setJuegoTerminado] = useState(false);
const [cargando, setCargando] = useState(true);

// Estado del Récord (LocalStorage)
const [record, setRecord] = useState(() => {
const guardado = localStorage.getItem('recordTrivia');
return guardado ? parseInt(guardado) : 0;
});

// 1. Cargar preguntas al iniciar (Paso 1)
useEffect(() => {
cargarPreguntas();
}, []);

const cargarPreguntas = async () => {
setCargando(true);
try {
const response = await fetch('https://opentdb.com/api.php?amount=5&type=multiple&lang=es');
const data = await response.json();

const formateadas = data.results.map((p) => {
const opciones = [...p.incorrect_answers, p.correct_answer];
return {
pregunta: p.question,
opciones: opciones.sort(() => Math.random() - 0.5),
respuestaCorrecta: p.correct_answer
};
});

setPreguntas(formateadas);
} catch (error) {
console.error("Error cargando preguntas", error);
} finally {
setCargando(false);
}
};

// 2. Temporizador (Paso 2)
useEffect(() => {
if (juegoTerminado || cargando || preguntas.length === 0) return;

if (tiempoRestante === 0) {
manejarRespuesta(null); // Se acabó el tiempo
return;
}

const timerId = setInterval(() => {
setTiempoRestante((prev) => prev - 1);
}, 1000);

return () => clearInterval(timerId);
}, [tiempoRestante, juegoTerminado, cargando, preguntas]);

// 3. Manejar la respuesta
const manejarRespuesta = (opcionElegida) => {
const esCorrecta = opcionElegida === preguntas[indiceActual].respuestaCorrecta;

let nuevaPuntuacion = puntuacion;
if (esCorrecta) {
nuevaPuntuacion += 1;
setPuntuacion(nuevaPuntuacion);
// Opcional: Aquí podrías mostrar un mensaje verde de "¡Correcto!"
}

// Pasar a la siguiente pregunta o terminar
if (indiceActual + 1 < preguntas.length) {
setIndiceActual(indiceActual + 1);
setTiempoRestante(15); // Reiniciar tiempo
} else {
terminarJuego(nuevaPuntuacion);
}
};

// 4. Terminar juego y guardar récord (Paso 3)
const terminarJuego = (puntuacionFinal) => {
setJuegoTerminado(true);
if (puntuacionFinal > record) {
setRecord(puntuacionFinal);
localStorage.setItem('recordTrivia', puntuacionFinal.toString());
}
};

// 5. Reiniciar Juego
const reiniciarJuego = () => {
setIndiceActual(0);
setPuntuacion(0);
setTiempoRestante(15);
setJuegoTerminado(false);
cargarPreguntas(); // Volver a pedir preguntas a la API
};

if (cargando) return <h2>Cargando preguntas...</h2>;

// 6. Interfaz (Paso 4)
if (juegoTerminado) {
return (
<div style={{ textAlign: 'center', padding: '50px' }}>
<h1>¡Juego Terminado! 🎉</h1>
<h2>Tu puntuación: {puntuacion} / {preguntas.length}</h2>
<h3>🏆 Récord histórico: {record}</h3>
<button onClick={reiniciarJuego} style={{ padding: '10px 20px', fontSize: '16px', marginTop: '20px' }}>
Volver a Jugar
</button>
</div>
);
}

const progreso = ((indiceActual) / preguntas.length) * 100;

return (
<div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
{/* Barra de progreso */}
<div style={{ width: '100%', backgroundColor: '#e0e0e0', height: '10px', borderRadius: '5px', marginBottom: '20px' }}>
<div style={{ width: `${progreso}%`, backgroundColor: '#4CAF50', height: '100%', borderRadius: '5px', transition: 'width 0.3s' }}></div>
</div>

<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
<span>Pregunta {indiceActual + 1} de {preguntas.length}</span>
<span style={{ color: tiempoRestante <= 5 ? 'red' : 'black', fontWeight: 'bold' }}>
⏱️ {tiempoRestante}s
</span>
</div>

{/* HTML de la API (esto decodifica caracteres como &quot; a comillas normales) */}
<h2 dangerouslySetInnerHTML={{ __html: preguntas[indiceActual].pregunta }} />

<div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
{preguntas[indiceActual].opciones.map((opcion, index) => (
<button
key={index}
onClick={() => manejarRespuesta(opcion)}
style={{ padding: '15px', fontSize: '16px', cursor: 'pointer' }}
dangerouslySetInnerHTML={{ __html: opcion }} // Usamos dangerouslySetInnerHTML por los caracteres especiales de la API
/>
))}
</div>
</div>
);
}