export interface Producto {
  _id?: string;

  itemId?:
  | string
  | {
    _id?: string;
    nombre?: string;
    costo?: number;
  };

  nombre: string;

  codigo?: string;

  cantidad: number;

  precio: number;

  costo?: number;

  total?: number;

  unidad?: string;

  despachado?: number;
}

export interface Cotizacion {
  _id?: string;

  cliente: string;

  direccion: string;

  metodoPago:
  | 'transferencia'
  | 'efectivo'
  | 'debito';

  fechaEntrega: string;

  productos: Producto[];

  pdfUrl?: string;

  anulada?: string;

  cotizacionOriginalId?: string;

  recibidoPor?: string;

  tipo?: string;
}