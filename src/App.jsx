import { useState, useEffect } from 'react';
import { preguntasNacionalidad } from './preguntasNacionalidad'; // Importamos tus preguntas

export default function App() {
const [preguntas, setPreguntas] = useState([]);
const [indiceActual, setIndiceActual] = useState(0);
const [puntuacion, setPuntuacion] = useState(0);
const [tiempoRestante, setTiempoRestante] = useState(15);
const [juegoTerminado, setJuegoTerminado] = useState(false);
const [cargando, setCargando] = useState(true);

const [record, setRecord] = useState(() => {
const guardado = localStorage.getItem('recordTrivia');
return guardado ? parseInt(guardado) : 0;
});

// Cargar preguntas locales al iniciar
useEffect(() => {
setCargando(true);
// Simulamos 1 segundo de carga
setTimeout(() => {
// Mezclamos las preguntas y sus opciones
const mezcladas = preguntasNacionalidad
.sort(() => Math.random() - 0.5)
.map((p) => ({
...p,
opciones: [...p.opciones].sort(() => Math.random() - 0.5)
}));

setPreguntas(mezcladas);
setCargando(false);
}, 1000);
}, []);

// Temporizador
useEffect(() => {
if (juegoTerminado || cargando || preguntas.length === 0) return;

if (tiempoRestante === 0) {
manejarRespuesta(null);
return;
}

const timerId = setInterval(() => {
setTiempoRestante((prev) => prev - 1);
}, 1000);

return () => clearInterval(timerId);
}, [tiempoRestante, juegoTerminado, cargando, preguntas]);

// Manejar respuesta
const manejarRespuesta = (opcionElegida) => {
const esCorrecta = opcionElegida === preguntas[indiceActual].respuestaCorrecta;

let nuevaPuntuacion = puntuacion;
if (esCorrecta) {
nuevaPuntuacion += 1;
setPuntuacion(nuevaPuntuacion);
}

if (indiceActual + 1 < preguntas.length) {
setIndiceActual(indiceActual + 1);
setTiempoRestante(15);
} else {
terminarJuego(nuevaPuntuacion);
}
};

const terminarJuego = (puntuacionFinal) => {
setJuegoTerminado(true);
if (puntuacionFinal > record) {
setRecord(puntuacionFinal);
localStorage.setItem('recordTrivia', puntuacionFinal.toString());
}
};

const reiniciarJuego = () => {
setIndiceActual(0);
setPuntuacion(0);
setTiempoRestante(15);
setJuegoTerminado(false);
// Volvemos a mezclar las preguntas
const mezcladas = preguntasNacionalidad
.sort(() => Math.random() - 0.5)
.map((p) => ({
...p,
opciones: [...p.opciones].sort(() => Math.random() - 0.5)
}));
setPreguntas(mezcladas);
};

if (cargando) {
return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Cargando preguntas... ⏳</h2>;
}

if (juegoTerminado) {
return (
<div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial' }}>
<h1>¡Juego Terminado! 🎉</h1>
<h2>Tu puntuación: {puntuacion} / {preguntas.length}</h2>
<h3 style={{ color: 'goldenrod' }}>🏆 Récord histórico: {record}</h3>
<button
onClick={reiniciarJuego}
style={{ padding: '10px 20px', fontSize: '16px', marginTop: '20px', cursor: 'pointer' }}
>
Volver a Jugar
</button>
</div>
);
}

const progreso = (indiceActual / preguntas.length) * 100;

return (
<div style={{ maxWidth: '600px', margin: '50px auto', fontFamily: 'Arial' }}>

{/* Barra de progreso */}
<div style={{ width: '100%', backgroundColor: '#e0e0e0', height: '10px', borderRadius: '5px', marginBottom: '20px' }}>
<div style={{ width: `${progreso}%`, backgroundColor: '#4CAF50', height: '100%', borderRadius: '5px', transition: 'width 0.3s' }}></div>
</div>

<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
<span>Pregunta {indiceActual + 1} de {preguntas.length}</span>
{/* He cambiado 'black' por 'white' para que se vea en fondo oscuro */}
<span style={{ color: tiempoRestante <= 5 ? 'red' : 'white', fontWeight: 'bold' }}>
⏱️ {tiempoRestante}s
</span>
</div>

<h2>{preguntas[indiceActual].pregunta}</h2>

<div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
{preguntas[indiceActual].opciones.map((opcion, index) => (
<button
key={index}
onClick={() => manejarRespuesta(opcion)}
style={{ padding: '15px', fontSize: '16px', cursor: 'pointer' }}
>
{opcion}
</button>
))}
</div>
</div>
);
}