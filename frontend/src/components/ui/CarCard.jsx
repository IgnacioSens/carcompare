import { useNavigate } from 'react-router-dom'
import { Button } from './Button'

export function CarCard({ car }) {
  const navigate = useNavigate()

  return (
    <article
      onClick={() => navigate(`/carros/${car.id}`)}
      className="bg-white border border-outline-variant rounded-xl overflow-hidden flex flex-col cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-float group"
    >
      {/* Imagem */}
      <div className="relative aspect-[4/3] flex items-center justify-center overflow-hidden" style={{background: car.bg || '#dce9ff'}}>
        {car.imagemUrl
          ? <img src={car.imagemUrl} alt={`${car.brand} ${car.model}`} className="w-full h-full object-cover" />
          : <svg viewBox="0 0 500 260" className="w-4/5 opacity-[0.18]" fill="#0b1c30">
              <path d="M40 190 Q40 150 80 140 L150 110 Q190 80 240 75 L360 75 Q420 76 450 130 L470 180 Q475 195 465 200 L50 200 Q40 200 40 190Z"/>
              <ellipse cx="120" cy="200" rx="38" ry="38"/>
              <ellipse cx="370" cy="200" rx="38" ry="38"/>
              <rect x="160" y="85" width="160" height="55" rx="12"/>
            </svg>
        }
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase text-on-surface">
          {car.brand}
        </span>
        <button
          onClick={e => e.stopPropagation()}
          className="absolute top-3 right-3 bg-white/70 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
        >
          <span className="material-symbols-outlined text-on-surface-variant" style={{fontSize:16}}>favorite</span>
        </button>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">{car.brand}</span>
          <h3 className="text-lg font-semibold text-on-surface truncate">{car.model}</h3>
        </div>
        <div className="text-xl font-bold text-on-surface">{car.price}</div>

        <div className="grid grid-cols-3 gap-1.5 border-t border-outline-variant/50 pt-3 mt-auto">
          {[
            { label: 'Potência', value: `${car.hp} cv` },
            { label: '0–100',    value: car.acc },
            { label: 'Comb.',    value: car.fuel?.substring(0,4) + '.' },
          ].map(s => (
            <div key={s.label} className="flex flex-col items-center bg-surface rounded py-2">
              <span className="text-[9px] font-bold tracking-wider uppercase text-on-surface-variant">{s.label}</span>
              <span className="text-[13px] font-bold text-on-surface">{s.value}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button variant="primary" size="sm" fullWidth onClick={e => { e.stopPropagation(); navigate(`/carros/${car.id}`) }}>
            Ver Detalhes
          </Button>
          <Button variant="outline" size="sm" onClick={e => { e.stopPropagation(); navigate('/comparar') }}>
            Comparar
          </Button>
        </div>
      </div>
    </article>
  )
}
