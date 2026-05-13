import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { CarCard, Button } from '../components/ui'
import { useTitulo } from '../hooks/useTitulo'

export function Favoritos() {
  useTitulo('Favoritos')
  const navigate = useNavigate()
  const [favoritos, setFavoritos] = useState([])
  const [carregando, setCarregando] = useState(true)

  const usuario = localStorage.getItem('usuario')

  useEffect(() => {
    if (!usuario) { navigate('/login'); return }

    api.get('/favoritos')
      .then(res => setFavoritos(res.data))
      .catch(console.error)
      .finally(() => setCarregando(false))
  }, [])

  async function remover(carroId) {
    try {
      await api.delete(`/favoritos/${carroId}`)
      setFavoritos(prev => prev.filter(f => f.id !== carroId))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="max-w-app mx-auto px-4 sm:px-6 py-8 sm:py-10 flex flex-col gap-8">

      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-on-surface">Meus Favoritos</h1>
        <p className="text-on-surface-variant text-sm mt-1">
          {carregando ? 'Carregando...' : `${favoritos.length} carro${favoritos.length !== 1 ? 's' : ''} salvo${favoritos.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {carregando ? (
        <p className="text-center text-on-surface-variant py-16">Carregando...</p>
      ) : favoritos.length === 0 ? (
        <div className="flex flex-col items-center py-20 gap-4 text-on-surface-variant">
          <span className="material-symbols-outlined text-outline-variant" style={{ fontSize: 64 }}>favorite</span>
          <p className="text-sm">Você ainda não tem favoritos.</p>
          <Button variant="primary" onClick={() => navigate('/catalogo')}>
            Explorar catálogo
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {favoritos.map(f => (
            <div key={f.favorito_id} className="relative group">
              <CarCard car={f} />
              <button
                onClick={() => remover(f.id)}
                className="absolute top-3 right-3 bg-white dark:bg-surface-container rounded-full p-1.5 shadow-card opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                title="Remover dos favoritos"
              >
                <span className="material-symbols-outlined text-secondary" style={{ fontSize: 18 }}>heart_minus</span>
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
