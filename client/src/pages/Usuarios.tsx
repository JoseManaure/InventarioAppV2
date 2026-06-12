import { useEffect, useState } from "react";
import api from "../api/api";

interface Usuario {
    _id: string;
    name: string;
    email: string;
    role: string;
}

export default function Usuarios() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "publico"
    });

    const cargarUsuarios = async () => {
        try {
            setLoading(true);

            const res = await api.get("/users");

            setUsuarios(res.data);
        } catch (err) {
            console.error(err);
            alert("Error cargando usuarios");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const crearUsuario = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        try {
            await api.post("/users", form);

            alert("Usuario creado");

            setForm({
                name: "",
                email: "",
                password: "",
                role: "publico"
            });

            cargarUsuarios();

        } catch (err: any) {

            console.error(err);

            alert(
                err?.response?.data?.error ||
                "Error creando usuario"
            );
        }
    };

    const eliminarUsuario = async (
        id: string
    ) => {

        const confirmar = window.confirm(
            "¿Eliminar usuario?"
        );

        if (!confirmar) return;

        try {

            await api.delete(`/users/${id}`);

            cargarUsuarios();

        } catch (err) {

            console.error(err);

            alert(
                "Error eliminando usuario"
            );
        }
    };

    return (
        <div className="p-6 flex flex-col gap-6">

            <div>
                <h1 className="text-3xl font-bold">
                    Usuarios
                </h1>

                <p className="text-gray-500">
                    Administración de usuarios
                </p>
            </div>

            {/* FORMULARIO */}

            <div className="bg-white rounded-xl shadow border p-5">

                <h2 className="font-semibold text-lg mb-4">
                    Nuevo Usuario
                </h2>

                <form
                    onSubmit={crearUsuario}
                    className="grid md:grid-cols-4 gap-4"
                >

                    <input
                        placeholder="Nombre"
                        value={form.name}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                name: e.target.value
                            })
                        }
                        className="border rounded-lg px-3 py-2"
                        required
                    />

                    <input
                        placeholder="Email"
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                email: e.target.value
                            })
                        }
                        className="border rounded-lg px-3 py-2"
                        required
                    />

                    <input
                        placeholder="Password"
                        type="password"
                        value={form.password}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                password: e.target.value
                            })
                        }
                        className="border rounded-lg px-3 py-2"
                        required
                    />

                    <select
                        value={form.role}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                role: e.target.value
                            })
                        }
                        className="border rounded-lg px-3 py-2"
                    >
                        <option value="publico">
                            Público
                        </option>

                        <option value="vendedor">
                            Vendedor
                        </option>

                        <option value="contador">
                            Contador
                        </option>

                        <option value="admin">
                            Administrador
                        </option>
                    </select>

                    <button
                        type="submit"
                        className="bg-blue-600 text-white rounded-lg px-4 py-2"
                    >
                        Crear Usuario
                    </button>

                </form>

            </div>

            {/* TABLA */}

            <div className="bg-white rounded-xl shadow border overflow-hidden">

                <table className="w-full">

                    <thead className="bg-gray-100">

                        <tr>

                            <th className="text-left p-4">
                                Nombre
                            </th>

                            <th className="text-left p-4">
                                Email
                            </th>

                            <th className="text-left p-4">
                                Rol
                            </th>

                            <th className="text-left p-4">
                                Acción
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {loading && (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="p-4"
                                >
                                    Cargando...
                                </td>
                            </tr>
                        )}

                        {!loading &&
                            usuarios.map((u) => (

                                <tr
                                    key={u._id}
                                    className="border-t"
                                >

                                    <td className="p-4">
                                        {u.name}
                                    </td>

                                    <td className="p-4">
                                        {u.email}
                                    </td>

                                    <td className="p-4">

                                        <span className="px-2 py-1 rounded bg-gray-100 text-sm">

                                            {u.role}

                                        </span>

                                    </td>

                                    <td className="p-4">

                                        <button
                                            onClick={() =>
                                                eliminarUsuario(
                                                    u._id
                                                )
                                            }
                                            className="bg-red-500 text-white px-3 py-1 rounded"
                                        >
                                            Eliminar
                                        </button>

                                    </td>

                                </tr>

                            ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}