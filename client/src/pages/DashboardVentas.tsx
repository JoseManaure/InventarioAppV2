// src/pages/DashboardVentasFijo.tsx

import { useEffect, useState } from "react";
import api from "../api/api";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

export default function DashboardVentasFijo() {

  // =====================================
  // STATES
  // =====================================

  const [dashboard, setDashboard] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  const [notas, setNotas] = useState<any[]>([]);

  const [clientesDisponibles, setClientesDisponibles] = useState<string[]>([]);

  const [productosDisponibles, setProductosDisponibles] = useState<string[]>([]);

  const [clienteFiltro, setClienteFiltro] = useState("");

  const [productoFiltro, setProductoFiltro] = useState("");

  const [mesFiltro, setMesFiltro] = useState("");

  // =====================================
  // CARGAR DASHBOARD
  // =====================================

  const cargarDashboard = async () => {

    setLoading(true);

    try {

      const res = await api.get("/dashboard/ventas");

      console.log("📊 DASHBOARD RESPONSE:", res.data);

      setDashboard(res.data);

      setNotas(res.data.notas || []);

      setClientesDisponibles(
        res.data.clientesDisponibles || []
      );

      setProductosDisponibles(
        res.data.productosDisponibles || []
      );

    } catch (err) {

      console.error(
        "❌ Error cargando dashboard",
        err
      );

    } finally {

      setLoading(false);

    }
  };

  // =====================================
  // INIT
  // =====================================

  useEffect(() => {

    cargarDashboard();

  }, []);

  // =====================================
  // FILTROS
  // =====================================

  const notasFiltradas = notas.filter((nota: any) => {

    // CLIENTE
    if (
      clienteFiltro &&
      nota.cliente !== clienteFiltro
    ) {
      return false;
    }

    // PRODUCTO
    if (
      productoFiltro &&
      !nota.productos?.some(
        (p: any) => p.nombre === productoFiltro
      )
    ) {
      return false;
    }

    // MES
    if (
      mesFiltro &&
      !nota.fechaEntrega?.startsWith(mesFiltro)
    ) {
      return false;
    }

    return true;
  });

  // =====================================
  // KPIS FILTRADOS
  // =====================================
  console.log(
    "NOTAS SIN PRODUCTOS",
    notasFiltradas.filter(
      n => !Array.isArray(n.productos)
    )
  );
  const totalesDashboard = notasFiltradas.reduce(

    (acc: any, nota: any) => {

      const neto = (nota.productos || []).reduce(
        (sum: number, p: any) =>
          sum + ((p.cantidad || 0) * (p.precio || 0)),
        0
      );

      const iva = Math.round(neto * 0.19);

      const total = neto + iva;

      acc.neto += neto;
      acc.iva += iva;
      acc.total += total;

      return acc;

    },

    {
      neto: 0,
      iva: 0,
      total: 0
    }
  );

  // =====================================
  // CHART DATA
  // =====================================

  const ventasMensuales =
    dashboard?.ventasMensuales || [];

  const productosTop =
    dashboard?.topProductos || [];

  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (
      <div className="p-10">
        <p className="text-gray-500">
          Cargando dashboard...
        </p>
      </div>
    );
  }

  // =====================================
  // RENDER
  // =====================================

  return (

    <div className="p-6 bg-[#f5f7fb] min-h-screen flex flex-col gap-6">

      {/* HEADER */}
      <div>

        <h2 className="text-3xl font-bold tracking-tight text-slate-800">
          Dashboard de Ventas
        </h2>

        <p className="text-gray-500 mt-1">
          Resumen general del negocio
        </p>

      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">

          <p className="text-sm text-gray-500">
            Ventas Netas
          </p>

          <h3 className="text-2xl font-bold text-gray-800 mt-2">
            $
            {totalesDashboard.neto.toLocaleString("es-CL")}
          </h3>

        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">

          <p className="text-sm text-gray-500">
            IVA
          </p>

          <h3 className="text-2xl font-bold text-gray-800 mt-2">
            $
            {totalesDashboard.iva.toLocaleString("es-CL")}
          </h3>

        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">

          <p className="text-sm text-gray-500">
            Total Final
          </p>

          <h3 className="text-2xl font-bold text-gray-800 mt-2">
            $
            {totalesDashboard.total.toLocaleString("es-CL")}
          </h3>

        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">

          <p className="text-sm text-gray-500">
            Ticket Promedio
          </p>

          <h3 className="text-2xl font-bold text-gray-800 mt-2">
            $
            {
              notasFiltradas.length > 0
                ? Math.round(
                  totalesDashboard.total /
                  notasFiltradas.length
                ).toLocaleString("es-CL")
                : 0
            }
          </h3>

        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">

          <p className="text-sm text-gray-500">
            Costo Mercadería
          </p>

          <h3 className="text-2xl font-bold text-red-600 mt-2">

            $

            {dashboard?.kpis?.costoTotal?.toLocaleString("es-CL")}

          </h3>

        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">

          <p className="text-sm text-gray-500">
            Utilidad Bruta
          </p>

          <h3 className="text-2xl font-bold text-green-600 mt-2">

            $

            {dashboard?.kpis?.utilidadBruta?.toLocaleString("es-CL")}

          </h3>

        </div>

      </div>

      {/* FILTROS */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-wrap gap-4">

        {/* CLIENTE */}
        <div>

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cliente
          </label>

          <select
            value={clienteFiltro}
            onChange={(e) =>
              setClienteFiltro(e.target.value)
            }
            className="border rounded-lg px-3 py-2"
          >

            <option value="">
              Todos
            </option>

            {clientesDisponibles.map((cliente) => (

              <option
                key={cliente}
                value={cliente}
              >
                {cliente}
              </option>

            ))}

          </select>

        </div>

        {/* PRODUCTO */}
        <div>

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Producto
          </label>

          <select
            value={productoFiltro}
            onChange={(e) =>
              setProductoFiltro(e.target.value)
            }
            className="border rounded-lg px-3 py-2"
          >

            <option value="">
              Todos
            </option>

            {productosDisponibles.map((producto) => (

              <option
                key={producto}
                value={producto}
              >
                {producto}
              </option>

            ))}

          </select>

        </div>

        {/* MES */}
        <div>

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mes
          </label>

          <input
            type="month"
            value={mesFiltro}
            onChange={(e) =>
              setMesFiltro(e.target.value)
            }
            className="border rounded-lg px-3 py-2"
          />

        </div>

      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* VENTAS */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">

          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Ventas por Mes
          </h3>

          <ResponsiveContainer width="100%" height={300}>

            <BarChart data={ventasMensuales}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="mes" />

              <YAxis />

              <Tooltip
                formatter={(value: number) =>
                  `$${value.toLocaleString("es-CL")}`
                }
              />

              <Bar
                dataKey="total"
                fill="#4f46e5"
                radius={[6, 6, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

        {/* PRODUCTOS */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">

          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Top Productos
          </h3>

          <ResponsiveContainer width="100%" height={300}>

            <PieChart>

              <Pie
                data={productosTop}
                dataKey="total"
                nameKey="nombre"
                outerRadius={100}
                label={(entry) => entry.nombre}
              >

                {productosTop.map((_: any, index: number) => (

                  <Cell
                    key={index}
                    fill={[
                      "#10b981",
                      "#3b82f6",
                      "#f59e0b",
                      "#ef4444",
                      "#8b5cf6"
                    ][index % 5]}
                  />

                ))}

              </Pie>

              <Tooltip
                formatter={(value: number) =>
                  `$${value.toLocaleString("es-CL")}`
                }
              />

              <Legend />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* TABLA */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-50">

              <tr>

                <th className="text-left p-4">
                  Cliente
                </th>

                <th className="text-left p-4">
                  Fecha
                </th>

                <th className="text-left p-4">
                  Productos
                </th>

                <th className="text-left p-4">
                  Total
                </th>

              </tr>

            </thead>

            <tbody>

              {notasFiltradas.map((nota: any) => {

                const total = (nota.productos || []).reduce(
                  (acc: number, p: any) =>
                    acc + ((p.cantidad || 0) * (p.precio || 0)),
                  0
                );

                return (

                  <tr
                    key={nota._id}
                    className="border-t"
                  >

                    <td className="p-4">
                      {nota.cliente}
                    </td>

                    <td className="p-4">
                      {nota.fechaEntrega}
                    </td>

                    <td className="p-4">

                      {(nota.productos || [])
                        .map(
                          (p: any) =>
                            `${p.nombre} (${p.cantidad})`
                        )
                        .join(", ")}

                    </td>

                    <td className="p-4 font-semibold">

                      $
                      {total.toLocaleString("es-CL")}

                    </td>

                  </tr>

                );

              })}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}