import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Catalogo from './pages/Catalogo'
import Marcas from './pages/Marcas'
import Vehiculos from './pages/Vehiculos'
import Fotografias from './pages/Fotografias'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 font-sans antialiased text-gray-900">
        
        {/* El menú superior estará visible en todas las pantallas */}
        <Navbar />

        {/* Contenedor adaptativo para el contenido dinámico (Requerimiento 11 - Diseño Responsivo) */}
        <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Catalogo />} />
            <Route path="/marcas" element={<Marcas />} />
            <Route path="/vehiculos" element={<Vehiculos />} />
            <Route path="/fotografias" element={<Fotografias />} />
          </Routes>
        </main>

      </div>
    </BrowserRouter>
  )
}

export default App