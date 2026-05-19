import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [vehiculos, setVehiculos] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('http://localhost:8000/vehiculos/')
      .then(response => {
        setVehiculos(response.data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Error al conectar con la API:", err)
        setError("No se pudo establecer conexión con el servidor de FastAPI.")
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Encabezado */}
        <div className="mb-8 border-b border-gray-200 pb-5">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Control de Vehículos
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Listado general de vehículos registrados en el sistema y sus marcas asociadas.
          </p>
        </div>

        {/* Estado de Carga o Error */}
        {loading && (
          <div className="text-center py-12 text-gray-500 font-medium">
            Cargando información de los vehículos...
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-6 border border-red-200">
            <div className="flex">
              <div className="text-sm font-medium text-red-800">{error}</div>
            </div>
          </div>
        )}

        {/* Tabla Estilizada */}
        {!loading && !error && (
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg bg-white">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-6">ID</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Modelo</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Año</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Color</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Marca</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold rounded-tr-lg">Origen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {vehiculos.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-6 text-center text-sm text-gray-500">
                      No hay vehículos registrados en la base de datos.
                    </td>
                  </tr>
                ) : (
                  vehiculos.map((carro) => (
                    <tr key={carro.ID_Vehiculo} className="hover:bg-gray-50 transition-colors">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {carro.ID_Vehiculo}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                        {carro.Modelo}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {carro.Anio}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 border border-gray-200">
                          {carro.Color}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 font-medium">
                        {carro.marca?.Nombre_Marca || 'Sin Marca'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {carro.marca?.Pais_Origen || 'N/A'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  )
}

export default App