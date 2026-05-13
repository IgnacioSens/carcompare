import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../services/api'
import { CarCard } from '../components/ui'
import { Input } from '../components/ui'
import { useTitulo } from '../hooks/useTitulo'

const combustiveis = [
  { value: 'flex',     label: 'Flex' },
  { value: 'gasolina', label: 'Gasolina' },
  { value: 'diesel',   label: 'Diesel' },
  { value: 'eletrico', label: 'Elétrico' },
  { value: 'hibrido',  label: 'Híbrido' },
]

function FiltroSecao({ titulo, children }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">{titulo}</p>
      {children}
    </div>
  )
}

function FiltroOpcao({ label, ativo, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`text-left text-sm px-3 py-2 rounded-lg transition-colors font-medium ${
        ativo
          ? 'bg-primary-container text-white'
          : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
      }`}
    >
      {label}
    </button>
  )
}

export function Catalog() {
  useTitulo('Catálogo')
  const [searchParams] = useSearchParams()

  const [carros, setCarros]         = useState([])
  const [marcas, setMarcas]         = useState([])
  const [categorias, setCategorias] = useState([])
  const [carregando, setCarregando] = useState(true)

  const [busca,       setBusca]      = useState(searchParams.get('q') || '')
  const [marca,       setMarca]      = useState('')
  const [categoria,   setCategoria]  = useState('')
  const [combustivel, setCombustivel] = useState('')

  const [sidebarAberta, setSidebarAberta] = useState(false)

  useEffect(() => {
    api.get('/carros/marcas/todas').then(res => setMarcas(res.data)).catch(console.error)
    api.get('/carros/categorias/todas').then(res => setCategorias(res.data)).catch(console.error)
  }, [])

  useEffect(() => {
    setCarregando(true)
    const params = {}
    if (busca)       params.busca       = busca
    if (marca)       params.marca       = marca
    if (categoria)   params.categoria   = categoria
    if (combustivel) params.combustivel = combustivel

    api.get('/carros', { params })
      .then(res => setCarros(res.data))
      .catch(console.error)
      .finally(() => setCarregando(false))
  }, [busca, marca, categoria, combustivel])

  function limparFiltros() {
    setMarca('')
    setCategoria('')
    setCombustivel('')
    setBusca('')
  }

  const temFiltro = marca || categoria || combustivel || busca

  const sidebar = (
    <aside className="flex flex-col gap-6 w-64 shrink-0">
      <div className="bg-white dark:bg-surface-container rounded-2xl shadow-card p-5 flex flex-col gap-5">

        {/* Busca */}
        <FiltroSecao titulo="Pesquisar">
          <Input
            icon="search"
            placeholder="Marca ou modelo..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
        </FiltroSecao>

        <hr className="border-outline-variant" />

        {/* Marcas */}
        <FiltroSecao titulo="Marca">
          <div className="flex flex-col gap-1 max-h-48 overflow-y-auto pr-1">
            <FiltroOpcao label="Todas" ativo={!marca} onClick={() => setMarca('')} />
            {marcas.map(m => (
              <FiltroOpcao
                key={m.id}
                label={m.nome}
                ativo={marca === m.id}
                onClick={() => setMarca(marca === m.id ? '' : m.id)}
              />
            ))}
          </div>
        </FiltroSecao>

        <hr className="border-outline-variant" />

        {/* Categorias */}
        <FiltroSecao titulo="Categoria">
          <div className="flex flex-col gap-1">
            <FiltroOpcao label="Todas" ativo={!categoria} onClick={() => setCategoria('')} />
            {categorias.map(c => (
              <FiltroOpcao
                key={c.id}
                label={c.nome}
                ativo={categoria === c.id}
                onClick={() => setCategoria(categoria === c.id ? '' : c.id)}
              />
            ))}
          </div>
        </FiltroSecao>

        <hr className="border-outline-variant" />

        {/* Combustível */}
        <FiltroSecao titulo="Combustível">
          <div className="flex flex-col gap-1">
            <FiltroOpcao label="Todos" ativo={!combustivel} onClick={() => setCombustivel('')} />
            {combustiveis.map(c => (
              <FiltroOpcao
                key={c.value}
                label={c.label}
                ativo={combustivel === c.value}
                onClick={() => setCombustivel(combustivel === c.value ? '' : c.value)}
              />
            ))}
          </div>
        </FiltroSecao>

        {/* Limpar */}
        {temFiltro && (
          <>
            <hr className="border-outline-variant" />
            <button
              onClick={limparFiltros}
              className="text-sm text-secondary font-semibold hover:underline text-left"
            >
              Limpar filtros
            </button>
          </>
        )}
      </div>
    </aside>
  )

  return (
    <div className="max-w-app mx-auto px-4 sm:px-6 py-8 sm:py-10 flex flex-col gap-6">

      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-on-surface">Catálogo</h1>
          <p className="text-on-surface-variant text-sm mt-1">
            {carregando ? 'Buscando...' : `${carros.length} carro${carros.length !== 1 ? 's' : ''} encontrado${carros.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Botão filtros mobile */}
        <button
          onClick={() => setSidebarAberta(v => !v)}
          className="md:hidden flex items-center gap-2 px-4 py-2 bg-white dark:bg-surface-container border border-outline-variant rounded-lg text-sm font-semibold text-on-surface shadow-card"
        >
          <span className="material-symbols-outlined text-[18px]">tune</span>
          Filtros
        </button>
      </div>

      <div className="flex gap-8 items-start">

        {/* Sidebar desktop */}
        <div className="hidden md:block">{sidebar}</div>

        {/* Sidebar mobile */}
        {sidebarAberta && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/30" onClick={() => setSidebarAberta(false)} />
            <div className="relative z-10 bg-surface w-72 h-full overflow-y-auto p-5 flex flex-col gap-5 shadow-float">
              <div className="flex items-center justify-between">
                <p className="font-bold text-on-surface">Filtros</p>
                <button onClick={() => setSidebarAberta(false)}>
                  <span className="material-symbols-outlined text-on-surface-variant">close</span>
                </button>
              </div>
              {sidebar}
            </div>
          </div>
        )}

        {/* Grid de carros */}
        <div className="flex-1">
          {carregando ? (
            <p className="text-center text-on-surface-variant py-16">Carregando...</p>
          ) : carros.length === 0 ? (
            <div className="flex flex-col items-center py-20 gap-3 text-on-surface-variant">
              <span className="material-symbols-outlined text-outline-variant" style={{ fontSize: 56 }}>search_off</span>
              <p className="text-sm">Nenhum carro encontrado com esses filtros.</p>
              <button onClick={limparFiltros} className="text-sm text-primary-container font-semibold hover:underline">
                Limpar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {carros.map(car => <CarCard key={car.id} car={car} />)}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
