import { useState } from 'react';
import { generarCotizacion } from '../services/llamaService';

export default function ChatCotizaciones() {
  const [prompt, setPrompt] = useState('');
  const [respuesta, setRespuesta] = useState('');

  const handleEnviar = async () => {
    const data = await generarCotizacion(prompt);
    setRespuesta(JSON.stringify(data, null, 2));
  };

  return (
    <div>
      <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Escribe tu solicitud" />
      <button onClick={handleEnviar}>Enviar</button>
      <pre>{respuesta}</pre>
    </div>
  );
}
