import { useNavigate } from 'react-router-dom'
import { Badge } from './Badge'

function formatarPreco(preco) {
  return Number(preco).toLocaleString('pt-BR', {
    style: 'currency', currency: 'BRL', maximumFractionDigits: 0
  })
}

const combustivelVariant = {
  eletrico: 'electric',
  hibrido:  'warning',
}

const combustivelLabel = {
  flex:     'Flex',
  gasolina: 'Gasolina',
  diesel:   'Diesel',
  eletrico: 'Elétrico',
  hibrido:  'Híbrido',
}

export function CarCard({ car }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/carros/${car.id}`)}
      className="bg-white rounded-2xl shadow-card overflow-hidden cursor-pointer hover:-translate-y-1 transition-transform group"
    >
      <div className="h-44 bg-surface-container flex items-center justify-center overflow-hidden">
        {car.imagem_url
          ? <img src={car.imagem_url} alt={car.modelo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          : <span className="material-symbols-outlined text-outline-variant" style={{ fontSize: 64 }}>directions_car</span>
        }
      </div>
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-widest uppercase text-on-surface-variant">{car.marca}</span>
          <Badge variant="default">{car.categoria}</Badge>
        </div>
        <h3 className="font-bold text-on-surface text-[15px] leading-tight">{car.modelo}</h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-base font-black text-primary-container">{formatarPreco(car.preco)}</span>
          <Badge variant={combustivelVariant[car.combustivel] || 'default'}>
            {combustivelLabel[car.combustivel] || car.combustivel}
          </Badge>
        </div>
      </div>
    </div>
  )
}
