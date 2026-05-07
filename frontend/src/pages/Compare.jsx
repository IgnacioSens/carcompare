import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Badge } from '../components/ui'
import { getCars } from '../services/api'

const ROWS = [
  { key:'price',    label:'Preço',        better:'min', format: c => c.priceLabel },
  { key:'hp',       label:'Potência',     better:'max', format: c => c.hp ? `${c.hp} cv` : '—' },
  { key:'torque',   label:'Torque',       better:'max', format: c => c.torque    || '—' },
  { key:'acc',      label:'0–100 km/h',   better:'min', format: c => c.acc       || '—' },
  { key:'topSpeed', label:'Vel. máxima',  better:'max', format: c => c.topSpeed  || '—' },
  { key:'engine',   label:'Motor',        better:null,  format: c => c.engine    || '—' },
  { key:'trans',    label:'Transmissão',  better:null,  format: c => c.trans     || '—' },
  { key:'drive',    label:'Tração',       better:null,  format: c => c.drive     || '—' },
  { key:'fuel',     label:'Combustível',  better:null,  format: c => c.fuel      || '—' },
  { key:'cons',     label:'Consumo',      better:null,  format: c => c.cons      || '—' },
  { key:'length',   label:'Comprimento',  better:null,  format: c => c.length    || '—' },
  { key:'width',    label:'Largura',      better:null,  format: c => c.width     || '—' },
  { key:'height',   label:'Altura',       better:null,  format: c => c.height    || '—' },
  { key:'trunk',    label:'Porta-malas',  better:'max', format: c => c.trunk     || '—' },
]

function numericVal(car, key) {
  if (key === 'price') return car.priceNum
  const v = car[key]
  if (typeof v === 'number') return v
  return parseFloat(String(v).replace(/[^\d.]/g,'')) || 0
}

function getBetter(cars, key, better) {
  if (!better || cars.length < 2) return null
  const vals = cars.map(c => numericVal(c, key))
  const best = better === 'max' ? Math.max(...vals) : Math.min(...vals)
  return vals.map(v => v === best)
}

export function Compare() {
  const navigate = useNavigate()
  const [cars,     setCars]     = useState([])
  const [selected, setSelected] = useState([null, null])

  useEffect(() => {
    getCars().then(setCars).catch(console.error)
  }, [])

  function pick(slot, id) {
    const car = cars.find(c => c.id === id) || null
    setSelected(prev => { const next = [...prev]; next[slot] = car; return next })
  }

  function remove(slot) {
    setSelected(prev => { const next = [...prev]; next[slot] = null; return next })
  }

  const activeCars = selected.filter(Boolean)

  return (
    <div className="min-h-screen bg-surface">

      <div className="bg-white border-b border-outline-variant/50">
        <div className="max-w-app mx-auto px-6 py-8">
          <p className="text-[11px] font-bold tracking-widest uppercase text-primary-container mb-1">Ferramentas</p>
          <h1 className="text-3xl font-bold text-on-surface">Comparar veículos</h1>
          <p className="text-on-surface-variant text-sm mt-1">Selecione até 2 carros para comparar lado a lado</p>
        </div>
      </div>

      <div className="max-w-app mx-auto px-6 py-10 flex flex-col gap-10">

        {/* Seletores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[0, 1].map(slot => (
            <div key={slot}>
              {selected[slot] ? (
                <div className="bg-white rounded-xl border border-outline-variant/50 p-5 flex items-center gap-4">
                  <div className="w-20 h-16 rounded-lg flex items-center justify-center shrink-0 overflow-hidden" style={{background: selected[slot].bg}}>
                    {selected[slot].imagemUrl
                      ? <img src={selected[slot].imagemUrl} alt={selected[slot].model} className="w-full h-full object-cover" />
                      : <svg viewBox="0 0 500 260" className="w-full opacity-20" fill="#0b1c30">
                          <path d="M40 190 Q40 150 80 140 L150 110 Q190 80 240 75 L360 75 Q420 76 450 130 L470 180 Q475 195 465 200 L50 200 Q40 200 40 190Z"/>
                          <ellipse cx="120" cy="200" rx="38" ry="38"/>
                          <ellipse cx="370" cy="200" rx="38" ry="38"/>
                        </svg>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">{selected[slot].brand}</p>
                    <p className="font-bold text-on-surface truncate">{selected[slot].model}</p>
                    <p className="text-sm font-semibold text-on-surface-variant">{selected[slot].priceLabel}</p>
                  </div>
                  <button onClick={() => remove(slot)} className="p-1.5 hover:bg-surface-low rounded-full transition-colors text-on-surface-variant">
                    <span className="material-symbols-outlined" style={{fontSize:18}}>close</span>
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-xl border-2 border-dashed border-outline-variant/70 p-5 flex flex-col gap-3">
                  <p className="text-sm font-semibold text-on-surface-variant">Carro {slot + 1}</p>
                  <select onChange={e => pick(slot, e.target.value)} defaultValue=""
                    className="w-full bg-surface-low rounded-lg py-2.5 px-3 text-sm text-on-surface outline-none border border-transparent focus:border-primary-container cursor-pointer">
                    <option value="" disabled>Selecionar veículo...</option>
                    {cars.filter(c => c.id !== selected[slot === 0 ? 1 : 0]?.id).map(c => (
                      <option key={c.id} value={c.id}>{c.brand} {c.model}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Tabela comparativa */}
        {activeCars.length === 2 ? (
          <div className="bg-white rounded-xl border border-outline-variant/50 overflow-hidden">

            <div className="grid border-b border-outline-variant/50" style={{gridTemplateColumns:'200px repeat(2, 1fr)'}}>
              <div className="p-4 bg-surface-low" />
              {activeCars.map(car => (
                <div key={car.id} className="p-5 flex flex-col items-center gap-1 border-l border-outline-variant/50">
                  <div className="w-16 h-12 rounded-lg flex items-center justify-center overflow-hidden" style={{background: car.bg}}>
                    {car.imagemUrl
                      ? <img src={car.imagemUrl} alt={car.model} className="w-full h-full object-cover" />
                      : <svg viewBox="0 0 500 260" className="w-full opacity-20" fill="#0b1c30">
                          <path d="M40 190 Q40 150 80 140 L150 110 Q190 80 240 75 L360 75 Q420 76 450 130 L470 180 Q475 195 465 200 L50 200 Q40 200 40 190Z"/>
                          <ellipse cx="120" cy="200" rx="38" ry="38"/>
                        </svg>
                    }
                  </div>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">{car.brand}</p>
                  <p className="font-bold text-on-surface text-center text-sm">{car.model}</p>
                  <Badge variant={car.fuel === 'Elétrico' ? 'electric' : 'default'}>{car.fuel}</Badge>
                </div>
              ))}
            </div>

            {ROWS.map((row, i) => {
              const betterArr = getBetter(activeCars, row.key, row.better)
              return (
                <div key={row.key}
                  className={`grid items-stretch ${i % 2 === 0 ? 'bg-white' : 'bg-surface-low/40'}`}
                  style={{gridTemplateColumns:'200px repeat(2, 1fr)'}}>
                  <div className="px-5 py-3.5 flex items-center">
                    <span className="text-xs font-bold tracking-wide uppercase text-on-surface-variant">{row.label}</span>
                  </div>
                  {activeCars.map((car, ci) => {
                    const isBetter = betterArr?.[ci]
                    return (
                      <div key={car.id}
                        className={`px-5 py-3.5 flex items-center justify-center border-l border-outline-variant/50 text-sm font-semibold text-on-surface
                          ${isBetter ? 'bg-green-50 text-green-700' : ''}`}>
                        {isBetter && <span className="material-symbols-outlined text-green-600 mr-1" style={{fontSize:14}}>arrow_upward</span>}
                        {row.format(car)}
                      </div>
                    )
                  })}
                </div>
              )
            })}

            <div className="grid border-t border-outline-variant/50" style={{gridTemplateColumns:'200px repeat(2, 1fr)'}}>
              <div className="p-4 bg-surface-low" />
              {activeCars.map(car => (
                <div key={car.id} className="p-4 flex justify-center border-l border-outline-variant/50">
                  <Button variant="outline" size="sm" onClick={() => navigate(`/carros/${car.id}`)}>
                    Ver detalhes
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white rounded-xl border border-outline-variant/50">
            <span className="material-symbols-outlined text-outline-variant" style={{fontSize:56}}>compare_arrows</span>
            <p className="text-on-surface-variant font-medium">Selecione 2 veículos para comparar</p>
            <Button variant="outline" onClick={() => navigate('/catalogo')}>
              Explorar catálogo
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
