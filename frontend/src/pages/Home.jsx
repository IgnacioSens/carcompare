import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { CarCard } from '../components/ui'
import { Button, Input } from '../components/ui'
import { useTitulo } from '../hooks/useTitulo'

export function Home() {
  useTitulo('')
  const navigate = useNavigate()
  const [carros, setCarros]         = useState([])
  const [busca, setBusca]           = useState('')
  const [carregando, setCarregando] = useState(true)
  const [recentes, setRecentes]     = useState([])

  useEffect(() => {
    api.get('/carros')
      .then(res => setCarros(res.data.slice(0, 6)))
      .catch(console.error)
      .finally(() => setCarregando(false))

    // Carrega carros vistos recentemente do localStorage
    const salvos = JSON.parse(localStorage.getItem('carros_recentes') || '[]')
    setRecentes(salvos)
  }, [])

  function handleBusca(e) {
    e.preventDefault()
    navigate(`/catalogo${busca.trim() ? `?q=${busca.trim()}` : ''}`)
  }

  return (
    <div className="flex flex-col">

      {/* Hero */}
      <section className="relative text-white py-32 px-6 overflow-hidden min-h-[520px] flex items-center">

        {/* Vídeo de fundo */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>

        {/* Overlay escuro */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(8,12,36,0.75) 0%, rgba(8,12,36,0.60) 60%, rgba(8,12,36,0.85) 100%)' }} />

        {/* Conteúdo */}
        <div className="relative z-10 max-w-app mx-auto w-full flex flex-col items-center text-center gap-6">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight drop-shadow-lg">
            Compare carros de<br />forma inteligente
          </h1>
          <p className="text-lg max-w-xl drop-shadow" style={{ color: '#c5cae9' }}>
            Explore mais de 30 modelos, filtre por marca, categoria e combustível e compare lado a lado.
          </p>
          <form onSubmit={handleBusca} className="flex gap-2 w-full max-w-md">
            <Input
              icon="search"
              placeholder="Buscar marca ou modelo..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" variant="secondary">Buscar</Button>
          </form>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-surface-container py-8 px-4 sm:px-6">
        <div className="max-w-app mx-auto grid grid-cols-3 gap-2 sm:gap-4 text-center">
          {[
            { valor: '30+', label: 'Modelos' },
            { valor: '20+', label: 'Marcas' },
            { valor: '6',   label: 'Categorias' },
          ].map(s => (
            <div key={s.label}>
              <p className="text-xl sm:text-2xl font-black text-primary-container">{s.valor}</p>
              <p className="text-xs sm:text-sm text-on-surface-variant font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Destaques */}
      <section className="py-10 sm:py-16 px-4 sm:px-6">
        <div className="max-w-app mx-auto flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-on-surface">Destaques</h2>
            <Button variant="ghost" onClick={() => navigate('/catalogo')}>
              Ver todos
            </Button>
          </div>

          {carregando ? (
            <p className="text-on-surface-variant text-center py-12">Carregando...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {carros.map(car => <CarCard key={car.id} car={car} />)}
            </div>
          )}

          <div className="flex justify-center">
            <Button variant="primary" onClick={() => navigate('/catalogo')}>
              Ver catálogo completo
            </Button>
          </div>
        </div>
      </section>

      {/* Vistos recentemente */}
      {recentes.length > 0 && (
        <section className="py-10 sm:py-16 px-4 sm:px-6 bg-surface-container">
          <div className="max-w-app mx-auto flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-on-surface">Vistos recentemente</h2>
              <button
                onClick={() => { localStorage.removeItem('carros_recentes'); setRecentes([]) }}
                className="text-xs text-on-surface-variant hover:text-secondary transition-colors font-medium"
              >
                Limpar histórico
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
              {recentes.map(car => <CarCard key={car.id} car={car} />)}
            </div>
          </div>
        </section>
      )}

    </div>
  )
}
