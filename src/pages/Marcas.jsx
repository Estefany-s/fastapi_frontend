import { useEffect, useState } from "react";

function Marcas() {
  const [marcas, setMarcas] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroPais, setFiltroPais] = useState("");
  const [nombreMarca, setNombreMarca] = useState("");
  const [paisOrigen, setPaisOrigen] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const obtenerMarcas = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/marcas/");
      if (!response.ok) {
        throw new Error("Error al obtener marcas");
      }
      const data = await response.json();
      setMarcas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const crearMarca = async (e) => {
    e.preventDefault();
    try {
      const url = editandoId
        ? `http://127.0.0.1:8000/marcas/${editandoId}`
        : "http://127.0.0.1:8000/marcas/";
      const metodo = editandoId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Nombre_Marca: nombreMarca,
          Pais_Origen: paisOrigen,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.detail);
        return;
      }

      setNombreMarca("");
      setPaisOrigen("");
      setEditandoId(null);
      obtenerMarcas();
    } catch (error) {
      console.error(error);
    }
  };

  const eliminarMarca = async (id) => {
    const confirmar = window.confirm("¿Seguro que deseas eliminar esta marca?");
    if (!confirmar) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/marcas/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Error al eliminar");
      }
      obtenerMarcas();
    } catch (error) {
      console.error(error);
    }
  };

  const cargarMarcaEditar = (marca) => {
    setNombreMarca(marca.Nombre_Marca);
    setPaisOrigen(marca.Pais_Origen);
    setEditandoId(marca.ID_Marca);

    // Hace scroll automático hacia el formulario en celulares al editar
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    obtenerMarcas();
  }, []);

  const marcasFiltradas = marcas.filter((m) => {
    const nombre = (m?.Nombre_Marca || "").toString().toLowerCase();
    const pais = (m?.Pais_Origen || "").toString().toLowerCase();
    return (
      nombre.includes(filtroNombre.trim().toLowerCase()) &&
      pais.includes(filtroPais.trim().toLowerCase())
    );
  });

  return (
    <div className="space-y-6 min-h-screen bg-[#0F172A] text-[#F8FAFC] p-4 sm:p-6">
      <div className="border-b border-[#334155] pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC]">
          Administración de Marcas
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#94A3B8]">
          Registra nuevas marcas de vehículos al sistema y consulta las
          existentes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* FORMULARIO: Cambiado a sticky solo a partir de md (pantallas medianas/grandes) */}
        <div className="bg-[#1E293B] p-5 sm:p-6 rounded-lg shadow-lg border border-[#334155] md:col-span-1 h-fit md:sticky md:top-24">
          <h2 className="text-lg font-semibold text-[#F8FAFC] mb-4">
            {editandoId ? "Editar Marca" : "Nueva Marca"}
          </h2>

          <form onSubmit={crearMarca} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-1">
                Nombre Marca
              </label>
              <input
                type="text"
                placeholder="Ejemplo: Toyota"
                value={nombreMarca}
                onChange={(e) => setNombreMarca(e.target.value)}
                className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-sm text-[#F8FAFC] placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#06B6D4] transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-1">
                País de Origen
              </label>
              <input
                type="text"
                placeholder="Ejemplo: Japón"
                value={paisOrigen}
                onChange={(e) => setPaisOrigen(e.target.value)}
                className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-sm text-[#F8FAFC] placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#06B6D4] transition"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white py-2 rounded-lg text-sm font-medium transition duration-200 shadow-md"
              >
                {editandoId ? "Actualizar" : "Guardar Marca"}
              </button>
              {editandoId && (
                <button
                  type="button"
                  onClick={() => {
                    setNombreMarca("");
                    setPaisOrigen("");
                    setEditandoId(null);
                  }}
                  className="bg-[#334155] hover:bg-slate-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="md:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-[#F8FAFC]">
            Lista de Marcas Registradas
          </h2>

          {/* FILTROS */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="flex-1">
              <label className="block text-xs text-[#94A3B8] mb-1">
                Buscar por nombre
              </label>
              <input
                value={filtroNombre}
                onChange={(e) => setFiltroNombre(e.target.value)}
                placeholder="Ej: Toyota"
                className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-sm text-[#F8FAFC] placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#06B6D4] transition"
              />
            </div>

            <div className="flex-1">
              <label className="block text-xs text-[#94A3B8] mb-1">
                Filtrar por país
              </label>
              <input
                value={filtroPais}
                onChange={(e) => setFiltroPais(e.target.value)}
                placeholder="Ej: Japón"
                className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-sm text-[#F8FAFC] placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#06B6D4] transition"
              />
            </div>

            <div className="flex-none mt-5 sm:mt-0">
              <button
                onClick={() => {
                  setFiltroNombre("");
                  setFiltroPais("");
                }}
                className="bg-[#334155] hover:bg-slate-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition"
              >
                Limpiar
              </button>
            </div>
          </div>

          {loading && (
            <p className="text-sm text-[#94A3B8] animate-pulse">
              Cargando marcas...
            </p>
          )}

          {error && <p className="text-sm text-red-400 font-medium">{error}</p>}

          {!loading && !error && (
            <div>
              {marcas.length > 0 ? (
                marcasFiltradas.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {marcasFiltradas.map((marca) => (
                      <div
                        key={marca.ID_Marca}
                        className={`relative group bg-[#1E293B] border p-5 rounded-xl flex flex-col items-center justify-center text-center transition-all duration-200 shadow-md ${
                          editandoId === marca.ID_Marca
                            ? "border-[#06B6D4] ring-2 ring-[#06B6D4]/20 scale-[1.02]"
                            : "border-[#334155] hover:border-slate-500 hover:shadow-lg"
                        }`}
                      >
                        <span className="absolute top-3 left-3 text-xs font-mono text-[#94A3B8] bg-[#0F172A] px-2 py-0.5 rounded">
                          ✨
                        </span>

                        {/* BOTONES ACCIÓN: Se quita opacity-0 en pantallas móviles mediante md:opacity-0 y md:group-hover:opacity-100 */}
                        <div className="absolute top-2 right-2 flex gap-1 transition-opacity duration-150 opacity-100 md:opacity-0 md:group-hover:opacity-100 focus-within:opacity-100">
                          <button
                            onClick={() => cargarMarcaEditar(marca)}
                            title="Editar"
                            className="bg-yellow-500/10 hover:bg-yellow-500 text-yellow-500 hover:text-white p-1.5 rounded-md text-xs font-medium border border-yellow-500/30 transition duration-150"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => eliminarMarca(marca.ID_Marca)}
                            title="Eliminar"
                            className="bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white p-1.5 rounded-md text-xs font-medium border border-red-500/30 transition duration-150"
                          >
                            🗑️
                          </button>
                        </div>

                        <div className="text-3xl my-2 select-none filter drop-shadow-sm">
                          🚘
                        </div>

                        <h3 className="text-lg font-bold text-[#F8FAFC] uppercase tracking-wide">
                          {marca.Nombre_Marca}
                        </h3>
                        <p className="text-xs text-[#94A3B8] mt-0.5 font-medium">
                          {marca.Pais_Origen}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6 text-center text-[#94A3B8] text-sm">
                    No hay marcas que coincidan con los filtros
                  </div>
                )
              ) : (
                <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-8 text-center text-[#94A3B8] text-sm">
                  No hay marcas registradas
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Marcas;
