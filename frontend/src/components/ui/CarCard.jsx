import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
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
    <motion.div
      onClick={() => navigate(`/carros/${car.id}`)}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className="car-card group relative rounded-2xl overflow-hidden cursor-pointer bg-white dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.07]"
      style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)', transition: 'box-shadow 0.3s, border-color 0.3s' }}
    >
      {/* Imagem */}
      <div className="relative h-48 overflow-hidden bg-surface-container dark:bg-white/[0.03]">
        {car.imagem_url
          ? <img
              src={car.imagem_url}
              alt={car.modelo}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          : <div className="w-full h-full flex items-center justify-center">
              <span className="material-symbols-outlined text-outline-variant" style={{ fontSize: 64 }}>directions_car</span>
            </div>
        }

        {/* Linha de acento no hover */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: 'linear-gradient(90deg, transparent, #E30613 50%, transparent)' }}
        />

        {/* Gradient bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }}
        />
      </div>

      {/* Conteúdo */}
      <div className="p-4 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            {car.logo_url && (
              <img src={car.logo_url} alt={car.marca} className="w-4 h-4 object-contain shrink-0 dark:invert opacity-60" />
            )}
            <span className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant truncate">{car.marca}</span>
          </div>
          <Badge variant="default">{car.categoria}</Badge>
        </div>

        <h3 className="font-bold text-on-surface text-[15px] leading-snug">{car.modelo}</h3>

        <div className="flex items-center justify-between pt-2 border-t border-black/[0.05] dark:border-white/[0.05]">
          <span className="text-base font-black text-primary-container">{formatarPreco(car.preco)}</span>
          <Badge variant={combustivelVariant[car.combustivel] || 'default'}>
            {combustivelLabel[car.combustivel] || car.combustivel}
          </Badge>
        </div>
      </div>
    </motion.div>
  )
}
