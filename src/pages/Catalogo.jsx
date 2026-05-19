import { useEffect, useState } from "react";

// Mapeo simple de iconos o logos de marcas. Si no hay, usamos uno genérico.
const getMarcaIcon = (nombre) => {
    const iconos = {
        "SUZUKI": "🚙",
        "TOYOTA": "🚗",
        "FORD": "🛻",
        "BMW": "🏎️",
        "CHEVROLET": "🚚",
        "NISSAN": "🚘",
        "HYUNDAI": "🚐",
        "KIA": "🚙",
        "VOLKSWAGEN": "🚐"
    };
    return iconos[nombre.toUpperCase()] || "🚗";
};

function Catalogo() {
    const [marcas, setMarcas] = useState([]);
    const [vehiculos, setVehiculos] = useState([]);
    const [marcaSeleccionada, setMarcaSeleccionada] = useState(null);
    const [loading, setLoading] = useState(true);
    const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
    const [fotoActualIndex, setFotoActualIndex] = useState(0);
    const [busquedaMarca, setBusquedaMarca] = useState("");
    const [busquedaVehiculo, setBusquedaVehiculo] = useState("");

    const cargarDatos = async () => {
        try {
            setLoading(true);
            const [resMarcas, resVehiculos] = await Promise.all([
                fetch("http://127.0.0.1:8000/marcas/"),
                fetch("http://127.0.0.1:8000/vehiculos/")
            ]);

            const marcasData = await resMarcas.json();
            const vehiculosData = await resVehiculos.json();

            setMarcas(marcasData);
            setVehiculos(vehiculosData);
            
            if (marcasData.length > 0) {
                setMarcaSeleccionada(marcasData[0].ID_Marca);
            }
        } catch (error) {
            console.error("Error al cargar el catálogo:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const abrirModalVehiculo = (vehiculo) => {
        setVehiculoSeleccionado(vehiculo);
        setFotoActualIndex(0); // Resetear al abrir
    };

    const cambiarFoto = (direccion) => {
        if (!vehiculoSeleccionado) return;
        const totalFotos = vehiculoSeleccionado.fotografias.length;
        const nuevoIndex = (fotoActualIndex + direccion + totalFotos) % totalFotos;
        setFotoActualIndex(nuevoIndex);
    };

    const marcasFiltradas = marcas.filter(m => 
        m.Nombre_Marca.toLowerCase().includes(busquedaMarca.toLowerCase())
    );

    const vehiculosFiltrados = vehiculos.filter(v => 
        v.ID_Marca === marcaSeleccionada &&
        v.Modelo.toLowerCase().includes(busquedaVehiculo.toLowerCase())
    );
    
    const marcaActual = marcas.find(m => m.ID_Marca === marcaSeleccionada);

    return (
        <div className="space-y-8 min-h-screen bg-[#F8FAFC] text-slate-800 p-4 sm:p-6 rounded-xl">
            {/* Cabecera Marcas */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <span>🏁</span> Explora todas las marcas
                    </h2>
                    <input 
                        type="text"
                        placeholder="Buscar marca..."
                        value={busquedaMarca}
                        onChange={(e) => setBusquedaMarca(e.target.value)}
                        className="px-4 py-2 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
                    />
                </div>
                
                {loading ? (
                    <div className="animate-pulse flex gap-4 overflow-x-auto pb-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="min-w-[140px] h-32 bg-slate-200 rounded-2xl"></div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-4">
                        {marcasFiltradas.map(marca => {
                            const isSelected = marca.ID_Marca === marcaSeleccionada;
                            return (
                                <button
                                    key={marca.ID_Marca}
                                    onClick={() => setMarcaSeleccionada(marca.ID_Marca)}
                                    className={`flex flex-col items-center justify-center p-4 min-w-[140px] h-32 rounded-2xl transition-all duration-300 shadow-sm border ${
                                        isSelected 
                                        ? 'bg-[#0F172A] text-white border-[#0F172A] transform scale-105 shadow-lg' 
                                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:shadow-md'
                                    }`}
                                >
                                    <span className="text-4xl mb-2">{getMarcaIcon(marca.Nombre_Marca)}</span>
                                    <span className="font-bold text-sm uppercase tracking-wider">{marca.Nombre_Marca}</span>
                                    <span className={`text-[10px] mt-1 ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>{marca.Pais_Origen}</span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Listado de Vehículos */}
            {marcaSeleccionada && marcaActual && (
                <div className="pt-6 border-t border-slate-200">
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-l-4 border-slate-900 pl-3">
                                <span className="text-2xl">{getMarcaIcon(marcaActual.Nombre_Marca)}</span> 
                                {marcaActual.Nombre_Marca} · Modelos disponibles
                            </h2>
                            <span className="text-xs font-medium text-slate-500 pl-4">{vehiculosFiltrados.length} modelos encontrados</span>
                        </div>
                        <input 
                            type="text"
                            placeholder="Buscar modelo..."
                            value={busquedaVehiculo}
                            onChange={(e) => setBusquedaVehiculo(e.target.value)}
                            className="px-4 py-2 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
                        />
                    </div>

                    {vehiculosFiltrados.length === 0 ? (
                        <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200 text-center text-slate-500">
                            No hay vehículos que coincidan con tu búsqueda.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {vehiculosFiltrados.map(vehiculo => {
                                const fotoUrl = vehiculo.fotografias && vehiculo.fotografias.length > 0 
                                    ? vehiculo.fotografias[0].Ruta_Archivo 
                                    : "https://via.placeholder.com/400x300?text=Sin+Imagen";

                                return (
                                    <div key={vehiculo.ID_Vehiculo} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300 flex flex-col">
                                        <div className="h-48 bg-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
                                            <img 
                                                src={fotoUrl} 
                                                alt={vehiculo.Modelo} 
                                                className="max-h-full max-w-full object-contain mix-blend-multiply hover:scale-110 transition duration-500"
                                            />
                                        </div>
                                        <div className="p-5 flex flex-col flex-grow">
                                            <h3 className="font-bold text-lg text-slate-900 mb-2 uppercase">{vehiculo.Modelo}</h3>
                                            
                                            <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mb-4">
                                                <span className="flex items-center gap-1">📅 {vehiculo.Anio}</span>
                                                <span className="flex items-center gap-1">🎨 {vehiculo.Color || "N/A"}</span>
                                            </div>

                                            <div className="mt-auto">
                                                <div className="text-2xl font-black text-emerald-600 mb-4">
                                                    ${parseFloat(vehiculo.Precio).toLocaleString("en-US", {minimumFractionDigits: 0})}
                                                    <span className="text-xs text-slate-400 font-medium ml-1">desde</span>
                                                </div>
                                                
                                                <button 
                                                    onClick={() => abrirModalVehiculo(vehiculo)}
                                                    className="w-full py-3 px-4 rounded-full border border-slate-900 text-slate-900 font-bold text-sm hover:bg-slate-900 hover:text-white transition-colors duration-300 flex justify-between items-center group"
                                                >
                                                    Descubrir
                                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Modal de Detalles del Vehículo */}
            {vehiculoSeleccionado && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setVehiculoSeleccionado(null)}>
                    <div className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl transform transition-all" onClick={e => e.stopPropagation()}>
                        <div className="relative h-80 bg-slate-100 flex items-center justify-center p-6">
                            {vehiculoSeleccionado.fotografias && vehiculoSeleccionado.fotografias.length > 0 ? (
                                <>
                                    <img 
                                        src={vehiculoSeleccionado.fotografias[fotoActualIndex].Ruta_Archivo} 
                                        alt={`${vehiculoSeleccionado.Modelo} - Foto ${fotoActualIndex + 1}`} 
                                        className="max-h-full max-w-full object-contain mix-blend-multiply"
                                    />
                                    {vehiculoSeleccionado.fotografias.length > 1 && (
                                        <>
                                            <button onClick={() => cambiarFoto(-1)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-900 w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md transition-colors">‹</button>
                                            <button onClick={() => cambiarFoto(1)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-900 w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md transition-colors">›</button>
                                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/50 text-white text-xs font-bold px-3 py-1 rounded-full">
                                                {fotoActualIndex + 1} / {vehiculoSeleccionado.fotografias.length}
                                            </div>
                                        </>
                                    )}
                                </>
                            ) : (
                                <img 
                                    src="https://via.placeholder.com/800x600?text=Sin+Imagen"
                                    alt="Sin Imagen" 
                                    className="max-h-full max-w-full object-contain mix-blend-multiply"
                                />
                            )}
                            <button 
                                onClick={() => setVehiculoSeleccionado(null)}
                                className="absolute top-4 right-4 bg-white/80 hover:bg-white text-slate-900 w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-md transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 uppercase">{vehiculoSeleccionado.Modelo}</h2>
                                    <p className="text-slate-500 font-medium mt-1">{marcaActual?.Nombre_Marca}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-black text-emerald-600">
                                        ${parseFloat(vehiculoSeleccionado.Precio).toLocaleString("en-US", {minimumFractionDigits: 0})}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Año de Fabricación</p>
                                    <p className="font-semibold text-slate-800 text-lg">{vehiculoSeleccionado.Anio}</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Color Exterior</p>
                                    <p className="font-semibold text-slate-800 text-lg flex items-center gap-2">
                                        <span 
                                            className="w-4 h-4 rounded-full shadow-sm border border-slate-200 block" 
                                            style={{backgroundColor: vehiculoSeleccionado.Color ? vehiculoSeleccionado.Color.toLowerCase() : 'transparent'}}
                                        ></span>
                                        {vehiculoSeleccionado.Color || "N/A"}
                                    </p>
                                </div>
                            </div>

                            <button 
                                onClick={() => setVehiculoSeleccionado(null)}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-colors shadow-lg"
                            >
                                Cerrar Detalles
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Catalogo;
