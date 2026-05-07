import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CarCard, Button } from '../components/ui'
import { getCars } from '../services/api'

const CATEGORIES = [
  { label:'Sedans',     icon:'directions_car',  path:'/catalogo?cat=sedan' },
  { label:'SUVs',       icon:'airport_shuttle', path:'/catalogo?cat=suv' },
  { label:'Esportivos', icon:'sports_score',    path:'/catalogo?cat=esportivo' },
  { label:'Elétricos',  icon:'electric_car',    path:'/catalogo?cat=eletrico' },
  { label:'Picapes',    icon:'local_shipping',  path:'/catalogo?cat=picape' },
  { label:'Hatch',      icon:'directions_car',  path:'/catalogo?cat=hatch' },
]

export function Home() {
  const navigate = useNavigate()
  const [featured, setFeatured] = useState([])

  useEffect(() => {
    getCars().then(cars => setFeatured(cars.slice(0, 4))).catch(console.error)
  }, [])

  return (
    <div className="min-h-screen">

      {/* ── Hero ── */}
      <section className="relative w-full overflow-hidden" style={{minHeight:480, background:'linear-gradient(to right, #e5eeff 0%, #e5eeff 50%, #d3e4fe 100%)'}}>
        <div className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden pointer-events-none">
          <div className="absolute" style={{right:-40,top:-40,width:420,height:420,borderRadius:'50%',background:'rgba(203,219,245,0.5)'}}/>
          <div className="absolute" style={{right:60,bottom:-80,width:300,height:300,borderRadius:'50%',background:'rgba(211,228,254,0.6)'}}/>
          <svg viewBox="0 0 500 260" className="absolute opacity-[0.18]" style={{right:20,top:'50%',transform:'translateY(-50%)',width:440}} fill="#0b1c30">
            <path d="M40 190 Q40 150 80 140 L150 110 Q190 80 240 75 L360 75 Q420 76 450 130 L470 180 Q475 195 465 200 L50 200 Q40 200 40 190Z"/>
            <ellipse cx="120" cy="200" rx="38" ry="38"/>
            <ellipse cx="370" cy="200" rx="38" ry="38"/>
            <rect x="160" y="85" width="160" height="55" rx="12"/>
          </svg>
        </div>

        <div className="relative z-10 max-w-app mx-auto px-8 flex flex-col justify-center py-20 md:w-3/5">
          <span className="text-[11px] font-bold tracking-widest uppercase text-surface-tint mb-3">Plataforma automotiva</span>
          <h1 className="font-black tracking-tight text-on-surface mb-4 leading-tight" style={{fontSize:'clamp(28px,4vw,52px)'}}>
            Explore e compare<br/>carros de forma<br/>
            <span className="text-primary-container">inteligente</span>
          </h1>
          <p className="text-on-surface-variant mb-8 max-w-lg" style={{fontSize:18,lineHeight:1.6}}>
            Analise especificações técnicas, compare modelos e encontre o veículo ideal com dados precisos.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Button variant="primary" size="lg" icon="arrow_forward" onClick={() => navigate('/catalogo')}>
              Explorar carros
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/comparar')}>
              Comparar veículos
            </Button>
          </div>
        </div>
      </section>

      {/* ── Categorias ── */}
      <section className="max-w-app mx-auto px-8 pt-28 pb-12">
        <h2 className="text-2xl font-semibold text-on-surface mb-6">Procurar por categoria</h2>
        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map(cat => (
            <button key={cat.label} onClick={() => navigate(cat.path)}
              className="flex items-center gap-2 bg-white border border-outline-variant hover:border-primary-container hover:-translate-y-0.5 hover:shadow-card px-6 py-3 rounded-full transition-all text-sm font-medium text-on-surface">
              <span className="material-symbols-outlined text-primary-container" style={{fontSize:18}}>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── Destaques ── */}
      <section className="max-w-app mx-auto px-8 pb-20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[11px] font-bold tracking-widest uppercase text-primary-container mb-1">Em destaque</p>
            <h2 className="text-2xl font-semibold text-on-surface">Carros mais comparados</h2>
          </div>
          <button onClick={() => navigate('/catalogo')} className="text-sm font-semibold text-on-surface-variant hover:text-on-surface flex items-center gap-1 transition-colors">
            Ver todos <span className="material-symbols-outlined" style={{fontSize:16}}>arrow_forward</span>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map(car => <CarCard key={car.id} car={{...car, price: car.priceLabel}} />)}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-slate-50 border-t border-slate-200 py-16">
        <div className="max-w-app mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2 flex flex-col gap-4">
            <span className="text-lg font-black uppercase tracking-widest text-slate-950">CAR<span className="text-primary-container">COMPARE</span></span>
            <p className="text-sm text-slate-500 max-w-xs leading-relaxed">Plataforma de análise e comparação automotiva. Explore, analise e compare veículos de forma rápida e visual.</p>
            <p className="text-xs text-slate-400">© 2024 CarCompare. Todos os direitos reservados.</p>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-950 mb-1">Navegação</h4>
            {[['Início','/'],['Catálogo','/catalogo'],['Comparar','/comparar']].map(([l,p]) => (
              <button key={l} onClick={() => navigate(p)} className="text-sm text-left text-slate-500 hover:text-slate-950 transition-colors">{l}</button>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-950 mb-1">Redes Sociais</h4>
            <a href="#" className="text-sm text-slate-500 hover:text-slate-950 transition-colors">GitHub</a>
            <a href="#" className="text-sm text-slate-500 hover:text-slate-950 transition-colors">Instagram</a>
            <a href="#" className="text-sm text-slate-500 hover:text-slate-950 transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>

    </div>
  )
}
