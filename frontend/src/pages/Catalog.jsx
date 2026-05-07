import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CarCard } from '../components/ui'
import { getCars } from '../services/api'

const CATEGORIES = [
  { value:'suv',       label:'SUV' },
  { value:'sedan',     label:'Sedan' },
  { value:'hatch',     label:'Hatch' },
  { value:'esportivo', label:'Esportivo' },
  { value:'eletrico',  label:'Elétrico' },
  { value:'picape',    label:'Picape' },
]
const FUELS = ['Gasolina','Flex','Elétrico','Híbrido','Diesel']
const SORT_OPTIONS = [
  { value:'popular',   label:'Mais populares' },
  { value:'price_asc', label:'Menor preço' },
  { value:'hp_desc',   label:'Maior potência' },
  { value:'acc',       label:'Melhor aceleração' },
]

export function Catalog() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [cars,    setCars]    = useState([])
  const [loading, setLoading] = useState(true)
  const [brand,    setBrand]    = useState(searchParams.get('marca') || '')
  const [category, setCategory] = useState(searchParams.get('cat')   || '')
  const [fuel,     setFuel]     = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sort,     setSort]     = useState('popular')
  const [search,   setSearch]   = useState(searchParams.get('q') || '')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    getCars()
      .then(data => { setCars(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const brands = useMemo(() => [...new Set(cars.map(c => c.brand))].sort(), [cars])

  const filtered = useMemo(() => {
    let list = [...cars]
    if (search)   list = list.filter(c => `${c.brand} ${c.model}`.toLowerCase().includes(search.toLowerCase()))
    if (brand)    list = list.filter(c => c.brand === brand)
    if (category) list = list.filter(c => c.category === category)
    if (fuel)     list = list.filter(c => c.fuel === fuel)
    if (maxPrice) list = list.filter(c => c.price <= Number(maxPrice))
    if (sort === 'price_asc') list.sort((a,b) => a.price - b.price)
    if (sort === 'hp_desc')   list.sort((a,b) => (b.hp || 0) - (a.hp || 0))
    if (sort === 'acc')       list.sort((a,b) => parseFloat(a.acc) - parseFloat(b.acc))
    return list
  }, [cars, search, brand, category, fuel, maxPrice, sort])

  function clearFilters() {
    setBrand(''); setCategory(''); setFuel(''); setMaxPrice(''); setSearch('')
  }

  const hasFilters = brand || category || fuel || maxPrice || search

  const Filters = () => (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface">Filtros</h3>
        {hasFilters && (
          <button onClick={clearFilters} className="text-xs text-secondary font-semibold hover:underline">
            Limpar tudo
          </button>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">Buscar</label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none" style={{fontSize:16}}>search</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Marca ou modelo..."
            className="w-full bg-surface-low rounded-lg py-2 pl-8 pr-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary-container/20 border border-transparent focus:border-primary-container" />
        </div>
      </div>

      <FilterSelect label="Marca" value={brand} onChange={e => setBrand(e.target.value)}>
        <option value="">Todas</option>
        {brands.map(b => <option key={b} value={b}>{b}</option>)}
      </FilterSelect>

      <FilterSelect label="Categoria" value={category} onChange={e => setCategory(e.target.value)}>
        <option value="">Todas</option>
        {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
      </FilterSelect>

      <FilterSelect label="Combustível" value={fuel} onChange={e => setFuel(e.target.value)}>
        <option value="">Todos</option>
        {FUELS.map(f => <option key={f} value={f}>{f}</option>)}
      </FilterSelect>

      <FilterSelect label="Preço até" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}>
        <option value="">Sem limite</option>
        <option value="100000">R$ 100.000</option>
        <option value="250000">R$ 250.000</option>
        <option value="500000">R$ 500.000</option>
        <option value="1000000">R$ 1.000.000</option>
        <option value="2000000">R$ 2.000.000</option>
      </FilterSelect>
    </div>
  )

  return (
    <div className="min-h-screen bg-surface">

      <div className="bg-white border-b border-outline-variant/50">
        <div className="max-w-app mx-auto px-6 py-8">
          <p className="text-[11px] font-bold tracking-widest uppercase text-primary-container mb-1">Catálogo</p>
          <h1 className="text-3xl font-bold text-on-surface">Todos os veículos</h1>
        </div>
      </div>

      <div className="max-w-app mx-auto px-6 py-8 flex gap-8">

        <aside className="hidden lg:block w-64 shrink-0">
          <div className="bg-white rounded-xl border border-outline-variant/50 p-5 sticky top-[90px]">
            <Filters />
          </div>
        </aside>

        <div className="flex-1 min-w-0">

          <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
            <span className="text-sm text-on-surface-variant font-medium">
              <span className="font-bold text-on-surface">{loading ? '…' : filtered.length}</span> veículos encontrados
            </span>
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-outline-variant rounded-lg text-sm font-semibold text-on-surface hover:border-primary-container transition-colors">
                <span className="material-symbols-outlined" style={{fontSize:16}}>tune</span>
                Filtros {hasFilters && <span className="bg-secondary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">!</span>}
              </button>
              <select value={sort} onChange={e => setSort(e.target.value)}
                className="bg-white border border-outline-variant rounded-lg py-2 px-3 text-sm text-on-surface outline-none cursor-pointer focus:border-primary-container">
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <span className="text-on-surface-variant text-sm">Carregando veículos...</span>
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map(car => (
                <CarCard key={car.id} car={{...car, price: car.priceLabel}} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <span className="material-symbols-outlined text-outline-variant" style={{fontSize:56}}>search_off</span>
              <p className="text-on-surface-variant font-medium">Nenhum veículo encontrado</p>
              <button onClick={clearFilters} className="text-sm font-semibold text-primary-container hover:underline">
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      </div>

      {sidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-80 bg-white z-50 lg:hidden shadow-float overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-outline-variant/50">
              <span className="font-bold text-on-surface">Filtros</span>
              <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-surface-low rounded-full transition-colors">
                <span className="material-symbols-outlined" style={{fontSize:20}}>close</span>
              </button>
            </div>
            <div className="p-5">
              <Filters />
              <button onClick={() => setSidebarOpen(false)}
                className="mt-6 w-full bg-primary-container text-white py-3 rounded-lg font-semibold text-sm hover:bg-surface-tint transition-colors">
                Ver {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function FilterSelect({ label, value, onChange, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">{label}</label>
      <select value={value} onChange={onChange}
        className="w-full bg-surface-low rounded-lg py-2 px-3 text-sm text-on-surface outline-none cursor-pointer border border-transparent focus:border-primary-container focus:ring-2 focus:ring-primary-container/20">
        {children}
      </select>
    </div>
  )
}
