import { useEffect, useState } from "react";

function Fotografias() {
    const [fotografias, setFotografias] = useState([]);
    const [vehiculos, setVehiculos] = useState([]);

    const [idVehiculo, setIdVehiculo] = useState("");
    const [angulo, setAngulo] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const [busquedaVehiculo, setBusquedaVehiculo] = useState("");
    const [filtroAngulo, setFiltroAngulo] = useState("");

    const cargarDatos = async () => {
        try {
            setFetching(true);
            const [resFotos, resVehiculos] = await Promise.all([
                fetch("http://127.0.0.1:8000/fotografias/"),
                fetch("http://127.0.0.1:8000/vehiculos/")
            ]);

            const fotos = await resFotos.json();
            const vehiculosData = await resVehiculos.json();

            setFotografias(fotos);
            setVehiculos(vehiculosData);
        } catch (error) {
            console.error("Error al cargar datos:", error);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const subirFotografia = async (e) => {
        e.preventDefault();

        if (!idVehiculo || !file) {
            alert("El vehículo y la imagen son obligatorios.");
            return;
        }

        const formData = new FormData();
        formData.append("id_vehiculo", idVehiculo);
        if (angulo) formData.append("angulo", angulo);
        formData.append("file", file);

        try {
            setLoading(true);
            const res = await fetch("http://127.0.0.1:8000/fotografias/", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const err = await res.json();
                alert("Error al subir imagen: " + (err.detail || "Error desconocido"));
                return;
            }

            alert("Fotografía subida exitosamente");
            setIdVehiculo("");
            setAngulo("");
            setFile(null);
            document.getElementById("fileInput").value = "";
            cargarDatos();
        } catch (error) {
            console.error(error);
            alert("Hubo un error al comunicarse con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    const eliminarFotografia = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar esta fotografía?")) return;

        try {
            const res = await fetch(`http://127.0.0.1:8000/fotografias/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                cargarDatos();
            } else {
                alert("Error al eliminar la fotografía.");
            }
        } catch (error) {
            console.error(error);
            alert("Error al comunicarse con el servidor.");
        }
    };

    const fotografiasFiltradas = fotografias.filter(foto => {
        const vehiculo = vehiculos.find(v => v.ID_Vehiculo === foto.ID_Vehiculo);
        const busquedaLower = busquedaVehiculo.toLowerCase();
        
        const matchBusqueda = vehiculo && (
            vehiculo.Modelo.toLowerCase().includes(busquedaLower) || 
            (vehiculo.Color && vehiculo.Color.toLowerCase().includes(busquedaLower))
        );
        
        const textMatch = busquedaVehiculo === "" || matchBusqueda;
        const angleMatch = filtroAngulo === "" || foto.Angulo === filtroAngulo;
        
        return textMatch && angleMatch;
    });

    return (
        <div className="space-y-6 min-h-screen bg-[#0F172A] text-[#F8FAFC] p-4 sm:p-6">
            <div className="border-b border-[#334155] pb-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC]">Galería de Fotografías</h1>
                <p className="mt-1 text-xs sm:text-sm text-[#94A3B8]">Sube imágenes, define ángulos de captura y asócialas a los vehículos del inventario.</p>
            </div>

            {/* BARRA DE FILTROS */}
            <div className="bg-[#1E293B] p-4 rounded-lg border border-[#334155] flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="w-full sm:w-1/2">
                    <input
                        type="text"
                        placeholder="🔍 Buscar foto por modelo o color..."
                        value={busquedaVehiculo}
                        onChange={(e) => setBusquedaVehiculo(e.target.value)}
                        className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-sm text-[#F8FAFC] placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#06B6D4] transition"
                    />
                </div>
                <div className="w-full sm:w-1/3">
                    <select
                        value={filtroAngulo}
                        onChange={(e) => setFiltroAngulo(e.target.value)}
                        className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-sm text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#06B6D4] transition"
                    >
                        <option value="">Todos los ángulos</option>
                        <option value="Frontal">Frontal</option>
                        <option value="Trasero">Trasero</option>
                        <option value="Lateral Izquierdo">Lateral Izquierdo</option>
                        <option value="Lateral Derecho">Lateral Derecho</option>
                        <option value="Interior">Interior</option>
                        <option value="Motor">Motor</option>
                        <option value="Detalle">Detalle</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#1E293B] p-5 sm:p-6 rounded-lg shadow-lg border border-[#334155] md:col-span-1 h-fit md:sticky md:top-24">
                    <h2 className="text-lg font-semibold text-[#F8FAFC] mb-4">Subir Nueva Fotografía</h2>
                    <form onSubmit={subirFotografia} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[#94A3B8] mb-1">Vehículo Asociado *</label>
                            <select
                                value={idVehiculo}
                                onChange={(e) => setIdVehiculo(e.target.value)}
                                className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-sm text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#06B6D4] transition"
                            >
                                <option value="">Selecciona un vehículo</option>
                                {vehiculos.map(v => (
                                    <option key={v.ID_Vehiculo} value={v.ID_Vehiculo}>{v.Modelo} ({v.Anio}) - Color: {v.Color || "N/A"}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#94A3B8] mb-1">Ángulo de Captura</label>
                            <select
                                value={angulo}
                                onChange={(e) => setAngulo(e.target.value)}
                                className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-sm text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#06B6D4] transition"
                            >
                                <option value="">Selecciona un ángulo</option>
                                <option value="Frontal">Frontal</option>
                                <option value="Trasero">Trasero</option>
                                <option value="Lateral Izquierdo">Lateral Izquierdo</option>
                                <option value="Lateral Derecho">Lateral Derecho</option>
                                <option value="Interior">Interior</option>
                                <option value="Motor">Motor</option>
                                <option value="Detalle">Detalle</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#94A3B8] mb-1">Archivo de Imagen *</label>
                            <input
                                id="fileInput"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-sm text-[#F8FAFC] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#06B6D4] file:text-white hover:file:bg-[#0891B2] transition cursor-pointer"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2 rounded-lg text-sm font-medium transition duration-200 shadow-md ${loading ? 'bg-slate-600 cursor-not-allowed' : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white'}`}
                        >
                            {loading ? "Subiendo..." : "Subir Fotografía"}
                        </button>
                    </form>
                </div>

                <div className="md:col-span-2 space-y-4">
                    <h2 className="text-lg font-semibold text-[#F8FAFC]">Fotografías Registradas</h2>
                    {fetching ? (
                        <p className="text-sm text-[#94A3B8] animate-pulse">Cargando galería...</p>
                    ) : fotografias.length === 0 ? (
                        <div className="bg-[#1E293B] p-6 rounded-lg border border-[#334155] text-center text-[#94A3B8]">
                            No hay fotografías registradas en el sistema.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {fotografiasFiltradas.length === 0 ? (
                                <div className="col-span-2 text-center text-[#94A3B8] p-4">
                                    No se encontraron fotografías con los filtros actuales.
                                </div>
                            ) : (
                            fotografiasFiltradas.map(foto => {
                                const vehiculoRelacionado = vehiculos.find(v => v.ID_Vehiculo === foto.ID_Vehiculo);
                                return (
                                    <div key={foto.ID_Fotografia} className="bg-[#1E293B] rounded-lg overflow-hidden border border-[#334155] shadow-md group">
                                        <div className="h-48 overflow-hidden bg-black flex items-center justify-center">
                                            <img src={foto.Ruta_Archivo} alt={foto.Angulo} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                                        </div>
                                        <div className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-semibold text-white">{vehiculoRelacionado ? `${vehiculoRelacionado.Modelo} (${vehiculoRelacionado.Anio})` : "Vehículo Desconocido"}</h3>
                                                    <p className="text-xs text-[#06B6D4] font-medium">{foto.Angulo || "Ángulo no especificado"}</p>
                                                </div>
                                                <button
                                                    onClick={() => eliminarFotografia(foto.ID_Fotografia)}
                                                    title="Eliminar fotografía"
                                                    className="bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white px-2 py-1 rounded text-xs border border-red-500/30 transition"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                            <p className="text-[10px] text-[#94A3B8]">Subido el: {foto.Fecha_Subida}</p>
                                        </div>
                                    </div>
                                );
                            })
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Fotografias;