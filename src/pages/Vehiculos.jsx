function Vehiculos() {
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Administración de Vehículos</h1>
        <p className="mt-1 text-sm text-gray-500">Gestiona el inventario de vehículos asignándolos a una marca específica.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 md:col-span-1">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Registrar Vehículo</h2>
          <p className="text-xs text-gray-400">Espacio para formulario con select dinámico</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 md:col-span-2">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Inventario Global</h2>
          <p className="text-xs text-gray-400">Espacio para la tabla general del CRUD</p>
        </div>
      </div>
    </div>
  )
}

export default Vehiculos