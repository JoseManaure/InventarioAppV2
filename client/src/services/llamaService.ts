import api from '../api/api';

export async function generarCotizacion(prompt: string) {
  const res = await api.post('/llama/cotizacion', { prompt });
  return res.data;
}
