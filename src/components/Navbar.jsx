import { NavLink } from 'react-router-dom'

function Navbar() {
  const linkClass = ({ isActive }) => 
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive 
        ? 'bg-gray-900 text-white' 
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`

  return (
    <nav className="bg-gray-800 shadow-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo / Nombre del Sistema */}
          <div className="flex items-center">
            <span className="text-xl font-bold text-white tracking-wider flex items-center gap-2">
              🚗 AutoGallery
            </span>
          </div>

          {/* Opciones del Menú (Requerimiento 12) */}
          <div className="flex space-x-4">
            <NavLink to="/" className={linkClass}>
              📁 Catálogo / Inicio
            </NavLink>
            <NavLink to="/marcas" className={linkClass}>
              🏷️ Marcas
            </NavLink>
            <NavLink to="/vehiculos" className={linkClass}>
              🚘 Vehículos
            </NavLink>
            <NavLink to="/fotografias" className={linkClass}>
              📸 Fotografías
            </NavLink>
          </div>

        </div>
      </div>
    </nav>
  )
}

export default Navbar