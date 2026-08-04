import { useEffect, useState } from "react";
import api from "../api/api";

export default function CertificadoDigital() {

    const [certificado, setCertificado] = useState<any>(null);

    const [password, setPassword] = useState("");

    const [archivo, setArchivo] = useState<File | null>(null);

    useEffect(() => {

        cargar();

    }, []);

    const cargar = async () => {

        console.log("TOKEN:", localStorage.getItem("token"));
        console.log("AUTH:", api.defaults.headers.common.Authorization);

        try {

            const res = await api.get("/certificados");

            setCertificado(res.data);

        } catch (err) {

            console.error(err);

        }

    };

    const subir = async () => {

        if (!archivo) {

            alert("Seleccione un certificado");

            return;

        }

        const fd = new FormData();

        fd.append("certificado", archivo);

        fd.append("password", password);

        try {

            await api.post(
                "/certificados",
                fd,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            alert("Certificado cargado");

            cargar();

        } catch (err: any) {

            alert(
                err?.response?.data?.error || "Error"
            );

        }

    };

    return (

        <div className="bg-white rounded-xl shadow p-6 mt-8">

            <h2 className="text-xl font-bold mb-6">

                Certificado Digital

            </h2>

            <input
                type="file"
                accept=".pfx"
                onChange={(e) =>
                    setArchivo(
                        e.target.files?.[0] || null
                    )
                }
            />

            <div className="mt-4">

                <input
                    type="password"
                    placeholder="Contraseña certificado"
                    className="border rounded p-2 w-full"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                />

            </div>

            <button
                onClick={subir}
                className="mt-5 bg-blue-600 text-white px-5 py-2 rounded"
            >
                Subir certificado
            </button>

            {certificado && certificado.valido && (

                <div className="mt-8 border rounded-lg p-5 bg-green-50">

                    <h3 className="font-bold text-green-700">

                        ✔ Certificado válido

                    </h3>

                    <div className="mt-4 space-y-2">

                        <p>

                            <strong>Serie:</strong>

                            {" "}

                            {certificado.serial}

                        </p>

                        <p>

                            <strong>Vence:</strong>

                            {" "}

                            {new Date(
                                certificado.vence
                            ).toLocaleDateString()}

                        </p>

                        <p>

                            <strong>Fingerprint:</strong>

                            {" "}

                            {certificado.fingerprint}

                        </p>

                    </div>

                </div>

            )}

        </div>

    );

}