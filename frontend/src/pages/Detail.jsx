import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Badge, SpecCard } from '../components/ui'
import { getCarById } from '../services/api'

const PERF_BARS = (car) => [
  { label:'Potência',   value: car.hp       ? Math.min(Number(car.hp) / 700 * 100, 100)                      : 0 },
  { label:'Aceleração', value: car.acc      ? Math.max(100 - (parseFloat(car.acc) / 12 * 100), 10)           : 0 },
  { label:'Velocidade', value: car.topSpeed ? Math.min(parseInt(car.topSpeed) / 350 * 100, 100)               : 0 },
]

export function Detail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [car, setCar]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCarById(id)
      .then(data => { setCar(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <span className="text-on-surface-variant text-sm">Carregando...</span>
    </div>
  )

  if (!car) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <span className="material-symbols-outlined text-outline-variant" style={{fontSize:56}}>directions_car</span>
      <p className="text-on-surface-variant font-medium">Veículo não encontrado</p>
      <Button variant="primary" onClick={() => navigate('/catalogo')}>Ver catálogo</Button>
    </div>
  )

  const perfBars = PERF_BARS(car)

  return (
    <div className="min-h-screen bg-surface">

      {/* Hero */}
      <section className="w-full py-12" style={{background:`linear-gradient(135deg, ${car.bg} 0%, #f8f9ff 100%)`}}>
        <div className="max-w-app mx-auto px-6">
          <button onClick={() => navigate('/catalogo')} className="flex items-center gap-1 text-sm text-on-surface-variant hover:text-on-surface mb-6 transition-colors">
            <span className="material-symbols-outlined" style={{fontSize:16}}>arrow_back</span> Voltar ao catálogo
          </button>
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 flex items-center justify-center min-h-[220px]">
              {car.imagemUrl
                ? <img src={car.imagemUrl} alt={`${car.brand} ${car.model}`} className="w-full max-w-md object-contain max-h-64" />
                : <svg viewBox="0 0 500 260" className="w-full max-w-md opacity-20" fill="#0b1c30">
                    <path d="M40 190 Q40 150 80 140 L150 110 Q190 80 240 75 L360 75 Q420 76 450 130 L470 180 Q475 195 465 200 L50 200 Q40 200 40 190Z"/>
                    <ellipse cx="120" cy="200" rx="38" ry="38"/>
                    <ellipse cx="370" cy="200" rx="38" ry="38"/>
                    <rect x="160" y="85" width="160" height="55" rx="12"/>
                  </svg>
              }
            </div>
            <div className="flex-1 flex flex-col gap-4">
              <Badge variant={car.fuel === 'Elétrico' ? 'electric' : car.fuel === 'Híbrido' ? 'success' : 'default'}>
                {car.fuel}
              </Badge>
              <div>
                <p className="text-sm font-bold tracking-widest uppercase text-on-surface-variant">{car.brand}</p>
                <h1 className="text-4xl font-black tracking-tight text-on-surface">{car.model}</h1>
              </div>
              <p className="text-3xl font-bold text-on-surface">{car.priceLabel}</p>
              <div className="flex gap-3 flex-wrap">
                <Button variant="primary" size="lg" onClick={() => navigate('/comparar')}>
                  Comparar veículo
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate('/catalogo')}>
                  Ver catálogo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-app mx-auto px-6 py-12 flex flex-col gap-12">

        {/* Specs rápidas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <SpecCard icon="speed"             label="0–100 km/h" value={car.acc      || '—'} />
          <SpecCard icon="flash_on"          label="Potência"   value={car.hp ? `${car.hp} cv` : '—'} />
          <SpecCard icon="rotate_right"      label="Torque"     value={car.torque   || '—'} />
          <SpecCard icon="local_gas_station" label="Consumo"    value={car.cons     || '—'} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-8">

            {/* Especificações técnicas */}
            <Card title="Especificações Técnicas">
              <div className="divide-y divide-outline-variant/40">
                {[
                  ['Motor',       car.engine                    ],
                  ['Potência',    car.hp ? `${car.hp} cv` : null],
                  ['Torque',      car.torque                    ],
                  ['Transmissão', car.trans                     ],
                  ['Tração',      car.drive                     ],
                  ['Combustível', car.fuel                      ],
                  ['0–100 km/h',  car.acc                       ],
                  ['Vel. máxima', car.topSpeed                  ],
                  ['Consumo',     car.cons                      ],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between py-3">
                    <span className="text-sm text-on-surface-variant">{label}</span>
                    <span className="text-sm font-semibold text-on-surface">{value || '—'}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Dimensões */}
            <Card title="Dimensões">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  ['Comprimento', car.length],
                  ['Largura',     car.width ],
                  ['Altura',      car.height],
                  ['Porta-malas', car.trunk ],
                ].map(([label, value]) => (
                  <div key={label} className="bg-surface-low rounded-xl p-4 flex flex-col gap-1">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">{label}</span>
                    <span className="text-base font-bold text-on-surface">{value || '—'}</span>
                  </div>
                ))}
              </div>
            </Card>

          </div>

          <div className="flex flex-col gap-8">

            {/* Performance */}
            <Card title="Performance">
              <div className="flex flex-col gap-5">
                {perfBars.map(bar => (
                  <div key={bar.label} className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <span className="text-xs font-semibold text-on-surface-variant">{bar.label}</span>
                      <span className="text-xs font-bold text-on-surface">{Math.round(bar.value)}%</span>
                    </div>
                    <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                      <div className="h-full bg-primary-container rounded-full transition-all duration-700"
                        style={{width:`${bar.value}%`}} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {car.pros.length > 0 && (
              <Card title="Pontos Positivos">
                <ul className="flex flex-col gap-2">
                  {car.pros.map(p => (
                    <li key={p} className="flex items-start gap-2 text-sm text-on-surface">
                      <span className="material-symbols-outlined text-green-600 shrink-0" style={{fontSize:16}}>check_circle</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {car.negatives.length > 0 && (
              <Card title="Pontos Negativos">
                <ul className="flex flex-col gap-2">
                  {car.negatives.map(c => (
                    <li key={c} className="flex items-start gap-2 text-sm text-on-surface">
                      <span className="material-symbols-outlined text-secondary shrink-0" style={{fontSize:16}}>cancel</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

function Card({ title, children }) {
  return (
    <div className="bg-white rounded-xl border border-outline-variant/50 p-6 flex flex-col gap-4">
      <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface border-b border-outline-variant/50 pb-3">{title}</h2>
      {children}
    </div>
  )
}
