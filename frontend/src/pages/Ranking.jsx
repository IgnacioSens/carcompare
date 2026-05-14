import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../services/api'
import { Badge } from '../components/ui'
import { useTitulo } from '../hooks/useTitulo'

function formatarPreco(preco) {
  return Number(preco).toLocaleString('pt-BR', {
    style: 'currency', currency: 'BRL', maximumFractionDigits: 0
  })
}

const podioConfig = [
  {
    posicao: 1,
    cor:     '#F59E0B',
    corGlow: 'rgba(245,158,11,0.2)',
    bg:      'rgba(245,158,11,0.06)',
    borda:   'rgba(245,158,11,0.25)',
    ordem:   'order-2',
    altura:  '',
  },
  {
    posicao: 2,
    cor:     '#94A3B8',
    corGlow: 'rgba(148,163,184,0.15)',
    bg:      'rgba(148,163,184,0.04)',
    borda:   'rgba(148,163,184,0.2)',
    ordem:   'order-1',
    altura:  'mt-6 sm:mt-10',
  },
  {
    posicao: 3,
    cor:     '#C2784E',
    corGlow: 'rgba(194,120,78,0.15)',
    bg:      'rgba(194,120,78,0.04)',
    borda:   'rgba(194,120,78,0.2)',
    ordem:   'order-3',
    altura:  'mt-10 sm:mt-16',
  },
]

export function Ranking() {
  useTitulo('Ranking')
  const navigate = useNavigate()
  const [lista, setLista]       = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    api.get('/votos/ranking')
      .then(res => setLista(res.data))
      .catch(console.error)
      .finally(() => setCarregando(false))
  }, [])

  const podio    = lista.slice(0, 3)
  const restante = lista.slice(3)

  return (
    <div className="max-w-app mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-10">

      {/* Cabeçalho */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="flex flex-col gap-1"
      >
        <p className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">Comunidade</p>
        <h1 className="text-2xl sm:text-3xl font-black text-on-surface">Ranking de Carros</h1>
        <p className="text-on-surface-variant text-sm mt-0.5">
          Os carros mais votados pela comunidade. Vote na página de detalhes.
        </p>
      </motion.div>

      {carregando ? (
        <div className="flex flex-col items-center py-24 gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          <p className="text-sm text-on-surface-variant">Carregando ranking...</p>
        </div>
      ) : lista.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center py-24 gap-4 text-on-surface-variant"
        >
          <div className="p-6 rounded-full bg-surface-container">
            <span className="material-symbols-outlined text-outline-variant" style={{ fontSize: 56 }}>how_to_vote</span>
          </div>
          <p className="text-sm font-medium">Ainda não há votos. Seja o primeiro a votar!</p>
          <button
            onClick={() => navigate('/catalogo')}
            className="text-sm font-bold text-accent hover:underline"
          >
            Explorar catálogo
          </button>
        </motion.div>
      ) : (
        <>
          {/* ── Pódio ── */}
          {podio.length >= 1 && (
            <div className="flex items-end justify-center gap-3 sm:gap-5">
              {podio.map((carro, i) => {
                const cfg = podioConfig[i]
                return (
                  <motion.button
                    key={carro.id}
                    onClick={() => navigate(`/carros/${carro.id}`)}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className={`flex flex-col items-center gap-2.5 flex-1 max-w-[190px] rounded-2xl p-4 sm:p-5 cursor-pointer ${cfg.ordem} ${cfg.altura}`}
                    style={{
                      background: cfg.bg,
                      border: `1px solid ${cfg.borda}`,
                      boxShadow: `0 0 30px ${cfg.corGlow}`,
                    }}
                  >
                    {/* Número da posição */}
                    <span className="text-4xl sm:text-5xl font-black" style={{ color: cfg.cor }}>{cfg.posicao}</span>

                    {/* Foto */}
                    <div className="w-full aspect-video rounded-xl overflow-hidden bg-surface-container">
                      {carro.imagem_url
                        ? <img src={carro.imagem_url} alt={carro.modelo} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-outline-variant" style={{ fontSize: 32 }}>directions_car</span>
                          </div>
                      }
                    </div>

                    {/* Info */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1.5 mb-0.5">
                        {carro.logo_url && <img src={carro.logo_url} alt={carro.marca} className="w-3.5 h-3.5 object-contain dark:invert opacity-60" />}
                        <p className="text-[9px] font-bold tracking-widest uppercase text-on-surface-variant">{carro.marca}</p>
                      </div>
                      <p className="font-black text-on-surface text-sm sm:text-base leading-tight">{carro.modelo}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">{carro.ano}</p>
                    </div>

                    {/* Votos */}
                    <div
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full"
                      style={{ background: `${cfg.cor}18`, border: `1px solid ${cfg.cor}30` }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 13, color: cfg.cor }}>thumb_up</span>
                      <span className="font-black text-sm" style={{ color: cfg.cor }}>{carro.total_votos}</span>
                      <span className="text-xs text-on-surface-variant">
                        voto{carro.total_votos !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          )}

          {/* ── Demais posições ── */}
          {restante.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.55 }}
              className="flex flex-col gap-3"
            >
              <p className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">Demais posições</p>

              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: 'var(--color-surface-container)',
                  border: '1px solid var(--color-outline-variant)',
                }}
              >
                {restante.map((carro, i) => (
                  <motion.button
                    key={carro.id}
                    onClick={() => navigate(`/carros/${carro.id}`)}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 + i * 0.05, duration: 0.4 }}
                    whileHover={{ x: 4 }}
                    className="w-full flex items-center gap-4 px-5 py-3.5 text-left transition-colors hover:bg-surface-low"
                    style={{ borderTop: i !== 0 ? '1px solid var(--color-outline-variant)' : 'none' }}
                  >
                    {/* Posição */}
                    <span className="text-sm font-black text-on-surface-variant w-6 shrink-0 text-center">{i + 4}</span>

                    {/* Foto miniatura */}
                    <div className="w-16 h-10 rounded-lg overflow-hidden bg-surface-low shrink-0">
                      {carro.imagem_url
                        ? <img src={carro.imagem_url} alt={carro.modelo} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-outline-variant" style={{ fontSize: 18 }}>directions_car</span>
                          </div>
                      }
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        {carro.logo_url && <img src={carro.logo_url} alt={carro.marca} className="w-3 h-3 object-contain dark:invert opacity-50" />}
                        <p className="text-[9px] font-bold tracking-widest uppercase text-on-surface-variant">{carro.marca}</p>
                      </div>
                      <p className="font-bold text-on-surface text-sm truncate">{carro.modelo}</p>
                    </div>

                    {/* Categoria */}
                    <Badge variant="default" className="hidden sm:block shrink-0">{carro.categoria}</Badge>

                    {/* Preço */}
                    <p className="font-black text-primary-container text-sm shrink-0 hidden sm:block">
                      {formatarPreco(carro.preco)}
                    </p>

                    {/* Votos */}
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="material-symbols-outlined text-amber-500" style={{ fontSize: 14 }}>thumb_up</span>
                      <span className="font-black text-on-surface text-sm">{carro.total_votos}</span>
                    </div>

                    <span className="material-symbols-outlined text-outline-variant" style={{ fontSize: 16 }}>chevron_right</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  )
}
