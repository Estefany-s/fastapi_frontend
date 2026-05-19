function Catalogo() {
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Explora todas las marcas</h1>
        <p className="mt-1 text-sm text-gray-500">Selecciona una marca para filtrar los modelos disponibles en tiempo real.</p>
      </div>
      
      {/* Zona Temporal de Trabajo */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center text-gray-500">
        Aquí renderizaremos el Grid de botones con logos de Marcas y el catálogo de tarjetas inferiores.
      </div>
    </div>
  )
}

export default Catalogo