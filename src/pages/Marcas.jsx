function Marcas() {
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Administración de Marcas</h1>
        <p className="mt-1 text-sm text-gray-500">Registra nuevas marcas de vehículos al sistema y consulta las existentes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 md:col-span-1">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Nueva Marca</h2>
          <p className="text-xs text-gray-400">Espacio para formulario de ingreso (Requerimiento 10)</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 md:col-span-2">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Lista de Marcas Registradas</h2>
          <p className="text-xs text-gray-400">Espacio para tabla o listado general</p>
        </div>
      </div>
    </div>
  )
}

export default Marcas