import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Pencil } from "lucide-react";
import FormularioCliente from "./FormularioCliente";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;

  // Props que vienen desde tu componente principal
  cliente: string;
  setCliente: React.Dispatch<React.SetStateAction<string>>;
  rutCliente: string;
  setRutCliente: React.Dispatch<React.SetStateAction<string>>;
  direccion: string;
  setDireccion: React.Dispatch<React.SetStateAction<string>>;
  fechaEntrega: string;
  setFechaEntrega: React.Dispatch<React.SetStateAction<string>>;
  metodoPago: string;
  setMetodoPago: React.Dispatch<React.SetStateAction<string>>;
  tipo: "cotizacion" | "nota";
  setTipo: React.Dispatch<React.SetStateAction<"cotizacion" | "nota">>;
  giroCliente: string;
  setGiroCliente: React.Dispatch<React.SetStateAction<string>>;
  direccionCliente: string;
  setDireccionCliente: React.Dispatch<React.SetStateAction<string>>;
  comunaCliente: string;
  setComunaCliente: React.Dispatch<React.SetStateAction<string>>;
  ciudadCliente: string;
  setCiudadCliente: React.Dispatch<React.SetStateAction<string>>;
  atencion: string;
  setAtencion: React.Dispatch<React.SetStateAction<string>>;
  emailCliente: string;
  setEmailCliente: React.Dispatch<React.SetStateAction<string>>;
  telefonoCliente: string;
  setTelefonoCliente: React.Dispatch<React.SetStateAction<string>>;
  formaPago?: string;
  setFormaPago?: React.Dispatch<React.SetStateAction<string>>;
  nota?: string;
  setNota?: React.Dispatch<React.SetStateAction<string>>;
}

export default function ModalCliente({
  open,
  setOpen,
  cliente,
  setCliente,
  rutCliente,
  setRutCliente,
  direccion,
  setDireccion,
  fechaEntrega,
  setFechaEntrega,
  metodoPago,
  setMetodoPago,
  tipo,
  setTipo,
  giroCliente,
  setGiroCliente,
  direccionCliente,
  setDireccionCliente,
  comunaCliente,
  setComunaCliente,
  ciudadCliente,
  setCiudadCliente,
  atencion,
  setAtencion,
  emailCliente,
  setEmailCliente,
  telefonoCliente,
  setTelefonoCliente,
  formaPago,
  setFormaPago,
  nota,
  setNota,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="w-4 h-4 mr-2" />
          {cliente === "Sin asignar" ? "Agregar Cliente" : "Editar Cliente"}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>
            {cliente === "Sin asignar" ? "Agregar Cliente" : "Editar Cliente"}
          </DialogTitle>
        </DialogHeader>

        <FormularioCliente
          cliente={cliente}
          setCliente={setCliente}
          rutCliente={rutCliente}
          setRutCliente={setRutCliente}
          direccion={direccion}
          setDireccion={setDireccion}
          fechaEntrega={fechaEntrega}
          setFechaEntrega={setFechaEntrega}
          metodoPago={metodoPago}
          setMetodoPago={setMetodoPago}
          tipo={tipo}
          setTipo={setTipo}
          giroCliente={giroCliente}
          setGiroCliente={setGiroCliente}
          direccionCliente={direccionCliente}
          setDireccionCliente={setDireccionCliente}
          comunaCliente={comunaCliente}
          setComunaCliente={setComunaCliente}
          ciudadCliente={ciudadCliente}
          setCiudadCliente={setCiudadCliente}
          atencion={atencion}
          setAtencion={setAtencion}
          emailCliente={emailCliente}
          setEmailCliente={setEmailCliente}
          telefonoCliente={telefonoCliente}
          setTelefonoCliente={setTelefonoCliente}
          formaPago={formaPago}
          setFormaPago={setFormaPago}
          nota={nota}
          setNota={setNota}
        />

        <div className="mt-4 flex justify-end">
          <Button onClick={() => setOpen(false)}>Guardar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
