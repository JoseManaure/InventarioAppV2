import { useEffect, useState } from "react";
import api from "../api/api";
import CertificadoDigital from "../components/CertificadoDigital";

interface Empresa {

    nombre: string;
    razonSocial: string;
    rut: string;
    giro: string;
    direccion: string;
    comuna: string;
    ciudad: string;
    telefono: string;
    email: string;

}

export default function Empresa() {

    const [empresa, setEmpresa] = useState<Empresa>({
        nombre: "",
        razonSocial: "",
        rut: "",
        giro: "",
        direccion: "",
        comuna: "",
        ciudad: "",
        telefono: "",
        email: ""
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        cargarEmpresa();

    }, []);

    async function cargarEmpresa() {

        try {

            const res = await api.get("/empresas/configuracion");

            setEmpresa({
                ...empresa,
                ...res.data
            });

        } finally {

            setLoading(false);

        }

    }

    async function guardar() {

        try {

            await api.put(
                "/empresas/configuracion",
                empresa
            );

            alert("Empresa guardada correctamente");

        } catch (error) {

            console.error(error);

            alert("Error guardando empresa");

        }

    }

    function cambiar(e: React.ChangeEvent<HTMLInputElement>) {

        setEmpresa({

            ...empresa,

            [e.target.name]: e.target.value

        });

    }

    if (loading) {

        return <div className="p-10">Cargando...</div>;

    }

    return (

        <div className="max-w-6xl mx-auto p-8">

            <h1 className="text-3xl font-bold mb-8">

                Configuración Empresa

            </h1>

            <div className="grid grid-cols-2 gap-5">

                <input
                    name="nombre"
                    placeholder="Nombre"
                    value={empresa.nombre}
                    onChange={cambiar}
                    className="border p-3 rounded"
                />

                <input
                    name="razonSocial"
                    placeholder="Razón Social"
                    value={empresa.razonSocial}
                    onChange={cambiar}
                    className="border p-3 rounded"
                />

                <input
                    name="rut"
                    placeholder="RUT"
                    value={empresa.rut}
                    onChange={cambiar}
                    className="border p-3 rounded"
                />

                <input
                    name="giro"
                    placeholder="Giro"
                    value={empresa.giro}
                    onChange={cambiar}
                    className="border p-3 rounded"
                />

                <input
                    name="direccion"
                    placeholder="Dirección"
                    value={empresa.direccion}
                    onChange={cambiar}
                    className="border p-3 rounded"
                />

                <input
                    name="comuna"
                    placeholder="Comuna"
                    value={empresa.comuna}
                    onChange={cambiar}
                    className="border p-3 rounded"
                />

                <input
                    name="ciudad"
                    placeholder="Ciudad"
                    value={empresa.ciudad}
                    onChange={cambiar}
                    className="border p-3 rounded"
                />

                <input
                    name="telefono"
                    placeholder="Teléfono"
                    value={empresa.telefono}
                    onChange={cambiar}
                    className="border p-3 rounded"
                />

                <input
                    name="email"
                    placeholder="Email"
                    value={empresa.email}
                    onChange={cambiar}
                    className="border p-3 rounded col-span-2"
                />

            </div>

            <button
                onClick={guardar}
                className="mt-8 bg-blue-600 text-white px-6 py-3 rounded"
            >
                Guardar configuración
            </button>

            <div className="mt-12">

                <CertificadoDigital />

            </div>

        </div>

    );

}