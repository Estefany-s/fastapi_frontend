import { useEffect, useState } from "react";

function Vehiculos() {
	// Estados de Datos
	const [vehiculos, setVehiculos] = useState([]);
	const [marcas, setMarcas] = useState([]);

	// Estados del Formulario
	const [modelo, setModelo] = useState("");
	const [anio, setAnio] = useState("");
	const [color, setColor] = useState("");
	const [precio, setPrecio] = useState("");
	const [idMarca, setIdMarca] = useState("");
	const [editandoId, setEditandoId] = useState(null);

	// Estados de Control de Interfaz
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Estados para Filtros Útiles (Requerimiento de Funcionalidades Dinámicas)
	const [busquedaModelo, setBusquedaModelo] = useState("");
	const [filtroMarca, setFiltroMarca] = useState("");

	// 1. Obtener Vehículos y Marcas desde el Backend de FastAPI
	const cargarDatosIniciales = async () => {
		try {
			setLoading(true);
			// Peticiones concurrentes a la API
			const [resVehiculos, resMarcas] = await Promise.all([
				fetch("http://127.0.0.1:8000/vehiculos/"),
				fetch("http://127.0.0.1:8000/marcas/"),
			]);

			if (!resVehiculos.ok || !resMarcas.ok) {
				throw new Error("Error al sincronizar datos con el servidor backend.");
			}

			const dataVehiculos = await resVehiculos.json();
			const dataMarcas = await resMarcas.json();

			setVehiculos(dataVehiculos);
			setMarcas(dataMarcas);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	// 2. Crear o Actualizar Vehículo (Maneja el ciclo completo POST/PUT)
	const guardarVehiculo = async (e) => {
		e.preventDefault();

		// Convertimos los estados de texto a los tipos numéricos requeridos por FastAPI
		const anioInt = parseInt(anio);
		const precioFloat = parseFloat(precio);

		// --- REGLAS DE NEGOCIO Y VALIDACIONES (Ítem 10 de la Rúbrica) ---
		if (!modelo || !idMarca || isNaN(precioFloat) || isNaN(anioInt)) {
			alert("Por favor, llena todos los campos obligatorios del vehículo.");
			return;
		}

		if (anioInt < 1996) {
			alert(
				"Error de Validación: El año del vehículo no puede ser menor a 1996.",
			);
			return;
		}

		if (precioFloat < 1000.0) {
			alert(
				"Error de Validación: El precio del vehículo debe ser de por lo menos $1,000.00.",
			);
			return;
		}

		if (anioInt <= 0 || precioFloat <= 0) {
			alert(
				"Error de Validación: No se permiten cantidades negativas o iguales a cero.",
			);
			return;
		}

		try {
			// Si tenemos un editandoId cargado, disparamos un PUT a la ruta con ID; si no, un POST general
			const url = editandoId
				? `http://127.0.0.1:8000/vehiculos/${editandoId}`
				: "http://127.0.0.1:8000/vehiculos/";
			const metodo = editandoId ? "PUT" : "POST";

			const response = await fetch(url, {
				method: metodo,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					Modelo: modelo,
					Anio: anioInt,
					Color: color || "N/A",
					Precio: precioFloat,
					ID_Marca: parseInt(idMarca),
				}),
			});

			// Si el backend (FastAPI) rechaza la petición por la validación del Schema Pydantic
			if (!response.ok) {
				const errorData = await response.json();
				// Mapea el error detallado que envía FastAPI
				if (errorData.detail && Array.isArray(errorData.detail)) {
					alert(`Error en Backend: ${errorData.detail[0].msg}`);
				} else {
					alert(
						errorData.detail ||
							"Ocurrió un error al procesar el vehículo en el servidor.",
					);
				}
				return;
			}

			// Limpiar el formulario por completo tras un guardado exitoso
			setModelo("");
			setAnio("");
			setColor("");
			setPrecio("");
			setIdMarca("");
			setEditandoId(null);

			// Sincronizar y recargar la tabla del inventario en tiempo real
			cargarDatosIniciales();

			alert(
				editandoId
					? "¡Vehículo actualizado correctamente!"
					: "¡Vehículo registrado con éxito!",
			);
		} catch (error) {
			console.error("Error crítico en la petición HTTP:", error);
			alert(
				"No se pudo conectar con el servidor. Verifica que el Backend esté corriendo.",
			);
		}
	};

	// 3. Eliminar Vehículo (DELETE - Incluye cascada en base de datos)
	const eliminarVehiculo = async (id) => {
		const confirmar = window.confirm(
			"¿Seguro que deseas eliminar este vehículo del inventario?",
		);
		if (!confirmar) return;

		try {
			const response = await fetch(`http://127.0.0.1:8000/vehiculos/${id}`, {
				method: "DELETE",
			});
			if (!response.ok) {
				throw new Error("No se pudo eliminar el vehículo seleccionado.");
			}
			cargarDatosIniciales();
		} catch (error) {
			console.error(error);
			alert(error.message);
		}
	};

	// 4. Preparar Datos para Modo Edición
	const cargarVehiculoEditar = (vehiculo) => {
		setModelo(vehiculo.Modelo);
		setAnio(vehiculo.Anio);
		setColor(vehiculo.Color);
		setPrecio(vehiculo.Precio);
		setIdMarca(vehiculo.ID_Marca);
		setEditandoId(vehiculo.ID_Vehiculo);

		// Mismo comportamiento suave de scroll que usaste en marcas
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	useEffect(() => {
		cargarDatosIniciales();
	}, []);

	// 5. Lógica de Filtrado en Tiempo Real (Frontend Dinámico)
	const vehiculosFiltrados = vehiculos.filter((carro) => {
		const coincideModelo = carro.Modelo.toLowerCase().includes(
			busquedaModelo.toLowerCase(),
		);
		const coincideMarca =
			filtroMarca === "" || carro.ID_Marca === parseInt(filtroMarca);
		return coincideModelo && coincideMarca;
	});

	return (
		<div className="space-y-6 min-h-screen bg-[#0F172A] text-[#F8FAFC] p-4 sm:p-6">
			{/* Encabezado */}
			<div className="border-b border-[#334155] pb-4">
				<h1 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC]">
					Administración de Vehículos
				</h1>
				<p className="mt-1 text-xs sm:text-sm text-[#94A3B8]">
					Gestiona el inventario de vehículos, asigna sus precios, colores y
					asócialos a las marcas registradas.
				</p>
			</div>

			{/* BARRA DE FILTROS (Agregada para mejorar la experiencia de usuario y administración) */}
			<div className="bg-[#1E293B] p-4 rounded-lg border border-[#334155] flex flex-col sm:flex-row gap-4 items-center justify-between">
				<div className="w-full sm:w-1/2">
					<input
						type="text"
						placeholder="🔍 Buscar por modelo... (Ej: Corolla)"
						value={busquedaModelo}
						onChange={(e) => setBusquedaModelo(e.target.value)}
						className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-sm text-[#F8FAFC] placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#06B6D4] transition"
					/>
				</div>
				<div className="w-full sm:w-1/3">
					<select
						value={filtroMarca}
						onChange={(e) => setFiltroMarca(e.target.value)}
						className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-sm text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#06B6D4] transition"
					>
						<option value="">Filtrar por todas las Marcas</option>
						{marcas.map((m) => (
							<option
								key={m.ID_Marca}
								value={m.ID_Marca}
							>
								{m.Nombre_Marca}
							</option>
						))}
					</select>
				</div>
			</div>

			{/* Contenido Principal Grid */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* COLUMNA FORMULARIO */}
				<div className="bg-[#1E293B] p-5 sm:p-6 rounded-lg shadow-lg border border-[#334155] md:col-span-1 h-fit md:sticky md:top-24">
					<h2 className="text-lg font-semibold text-[#F8FAFC] mb-4">
						{editandoId ? "Editar Vehículo" : "Registrar Vehículo"}
					</h2>

					<form
						onSubmit={guardarVehiculo}
						className="space-y-4"
					>
						<div>
							<label className="block text-sm font-medium text-[#94A3B8] mb-1">
								Modelo *
							</label>
							<input
								type="text"
								placeholder="Ejemplo: Civic"
								value={modelo}
								onChange={(e) => setModelo(e.target.value)}
								className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-sm text-[#F8FAFC] placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#06B6D4] transition"
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-[#94A3B8] mb-1">
									Año *
								</label>
								<input
									type="number"
									min="1996"
									placeholder="2024"
									value={anio}
									onChange={(e) => setAnio(e.target.value)}
									className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-sm text-[#F8FAFC] placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#06B6D4] transition"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-[#94A3B8] mb-1">
									Precio ($) *
								</label>
								<input
									type="number"
									min="1000"
									step="0.01"
									placeholder="19500.00"
									value={precio}
									onChange={(e) => setPrecio(e.target.value)}
									className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-sm text-[#F8FAFC] placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#06B6D4] transition"
								/>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-[#94A3B8] mb-1">
								Color
							</label>
							<input
								type="text"
								placeholder="Ejemplo: Rojo Metálico"
								value={color}
								onChange={(e) => setColor(e.target.value)}
								className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-sm text-[#F8FAFC] placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#06B6D4] transition"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-[#94A3B8] mb-1">
								Marca Asociada *
							</label>
							<select
								value={idMarca}
								onChange={(e) => setIdMarca(e.target.value)}
								className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-sm text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#06B6D4] transition"
							>
								<option value="">Selecciona una marca</option>
								{marcas.map((m) => (
									<option
										key={m.ID_Marca}
										value={m.ID_Marca}
									>
										{m.Nombre_Marca} ({m.Pais_Origen})
									</option>
								))}
							</select>
						</div>

						<div className="flex gap-2 pt-2">
							<button
								type="submit"
								className="flex-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white py-2 rounded-lg text-sm font-medium transition duration-200 shadow-md"
							>
								{editandoId ? "Actualizar Auto" : "Guardar Vehículo"}
							</button>
							{editandoId && (
								<button
									type="button"
									onClick={() => {
										setModelo("");
										setAnio("");
										setColor("");
										setPrecio("");
										setIdMarca("");
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

				{/* COLUMNA TABLA / REGISTROS */}
				<div className="md:col-span-2 space-y-4">
					<h2 className="text-lg font-semibold text-[#F8FAFC]">
						Inventario Global Registrado
					</h2>

					{loading && (
						<p className="text-sm text-[#94A3B8] animate-pulse">
							Sincronizando inventario con la base de datos...
						</p>
					)}

					{error && <p className="text-sm text-red-400 font-medium">{error}</p>}

					{!loading && !error && (
						<div className="overflow-hidden border border-[#334155] rounded-lg shadow-md bg-[#1E293B]">
							<table className="min-w-full divide-y divide-[#334155] text-left text-sm">
								<thead className="bg-[#0F172A] text-[#94A3B8] font-medium">
									<tr>
										<th className="px-4 py-3">ID</th>
										<th className="px-4 py-3">Modelo / Año</th>
										<th className="px-4 py-3">Color</th>
										<th className="px-4 py-3">Precio</th>
										<th className="px-4 py-3">Marca</th>
										<th className="px-4 py-3 text-center">Acciones</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-[#334155] text-[#F8FAFC]">
									{vehiculosFiltrados.length > 0 ? (
										vehiculosFiltrados.map((carro) => (
											<tr
												key={carro.ID_Vehiculo}
												className="hover:bg-slate-700/40 transition"
											>
												<td className="px-4 py-3 font-mono text-xs text-[#06B6D4]">
													#{carro.ID_Vehiculo}
												</td>
												<td className="px-4 py-3">
													<div className="font-semibold">{carro.Modelo}</div>
													<div className="text-xs text-[#94A3B8]">
														{carro.Anio}
													</div>
												</td>
												<td className="px-4 py-3 text-xs">
													<span className="bg-[#0F172A] border border-[#334155] px-2 py-0.5 rounded text-slate-300">
														{carro.Color}
													</span>
												</td>
												<td className="px-4 py-3 font-medium text-emerald-400">
													$
													{parseFloat(carro.Precio).toLocaleString("en-US", {
														minimumFractionDigits: 2,
													})}
												</td>
												<td className="px-4 py-3">
													<div className="text-sm font-medium">
														{carro.marca?.Nombre_Marca || "Sin marca"}
													</div>
													<div className="text-xs text-[#94A3B8]">
														{carro.marca?.Pais_Origen || "N/A"}
													</div>
												</td>
												<td className="px-4 py-3 text-center">
													<div className="flex justify-center gap-2">
														<button
															onClick={() => cargarVehiculoEditar(carro)}
															title="Editar vehículo"
															className="bg-yellow-500/10 hover:bg-yellow-500 text-yellow-500 hover:text-white px-2 py-1 rounded text-xs border border-yellow-500/30 transition"
														>
															✏️
														</button>
														<button
															onClick={() =>
																eliminarVehiculo(carro.ID_Vehiculo)
															}
															title="Eliminar vehículo"
															className="bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white px-2 py-1 rounded text-xs border border-red-500/30 transition"
														>
															🗑️
														</button>
													</div>
												</td>
											</tr>
										))
									) : (
										<tr>
											<td
												colSpan="6"
												className="p-8 text-center text-[#94A3B8]"
											>
												No se encontraron vehículos con los filtros aplicados.
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default Vehiculos;
