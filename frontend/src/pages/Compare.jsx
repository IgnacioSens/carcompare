import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../services/api'
import { Badge } from '../components/ui'
import { useTitulo } from '../hooks/useTitulo'

function formatarPreco(preco) {
  return Number(preco).toLocaleString('pt-BR', {
    style: 'currency', currency: 'BRL', maximumFractionDigits: 0
  })
}

const combustivelLabel = {
  flex: 'Flex', gasolina: 'Gasolina', diesel: 'Diesel',
  eletrico: 'Elétrico', hibrido: 'Híbrido',
}

const campos = [
  { label: 'Marca',        key: 'marca',            tipo: 'text' },
  { label: 'Categoria',    key: 'categoria',        tipo: 'text' },
  { label: 'Combustível',  key: 'combustivel',      tipo: 'text',  format: v => combustivelLabel[v] || v },
  { label: 'Ano',          key: 'ano',              tipo: 'maior' },
  { label: 'Preço',        key: 'preco',            tipo: 'menor', format: formatarPreco },
  { label: 'Motor',        key: 'motor',            tipo: 'text' },
  { label: 'Potência',     key: 'potencia',         tipo: 'maior' },
  { label: 'Torque',       key: 'torque',           tipo: 'maior' },
  { label: '0–100 km/h',   key: 'zero_cem',         tipo: 'menor' },
  { label: 'Vel. máxima',  key: 'velocidade_maxima',tipo: 'maior' },
  { label: 'Consumo',      key: 'consumo',          tipo: 'text' },
]

function extrairNumero(val) {
  if (val == null) return null
  const n = parseFloat(String(val).replace(',', '.'))
  return isNaN(n) ? null : n
}

function vencedor(campo, carroA, carroB) {
  if (campo.tipo === 'text') return null
  const a = extrairNumero(carroA[campo.key])
  const b = extrairNumero(carroB[campo.key])
  if (a == null || b == null || a === b) return null
  if (campo.tipo === 'maior') return a > b ? 'A' : 'B'
  if (campo.tipo === 'menor') return a < b ? 'A' : 'B'
  return null
}

// Barra de telemetria animada
function BarraTelemetria({ valA, valB, tipo, ganhou, lado }) {
  const numA = extrairNumero(valA)
  const numB = extrairNumero(valB)
  if (numA == null || numB == null || tipo === 'text') return null

  const maxVal = Math.max(numA, numB)
  if (maxVal === 0) return null

  let pct
  if (tipo === 'menor') {
    const minVal = Math.min(numA, numB)
    // Para menor: vencedor = valor menor = barra maior (invertido)
    if (lado === 'A') pct = minVal === 0 ? 50 : (minVal / numA) * 100
    else              pct = minVal === 0 ? 50 : (minVal / numB) * 100
  } else {
    pct = lado === 'A' ? (numA / maxVal) * 100 : (numB / maxVal) * 100
  }

  const vence = (lado === 'A' && ganhou === 'A') || (lado === 'B' && ganhou === 'B')

  return (
    <div className="h-[3px] rounded-full overflow-hidden mt-1.5" style={{ background: 'rgba(128,128,128,0.12)' }}>
      <motion.div
        className="h-full rounded-full"
        style={{ background: vence ? '#22c55e' : 'rgba(128,128,128,0.3)' }}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(pct, 100)}%` }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      />
    </div>
  )
}

// Campo de busca com autocomplete
function BuscaCarro({ label, carros, valor, onSelecionar, carroExcluido }) {
  const [busca, setBusca] = useState('')
  const [aberto, setAberto] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setAberto(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filtrados = carros.filter(c => {
    if (carroExcluido && c.id === carroExcluido.id) return false
    const termo = busca.toLowerCase()
    return !termo || c.modelo.toLowerCase().includes(termo) || c.marca.toLowerCase().includes(termo)
  })

  function selecionar(carro) { onSelecionar(carro); setBusca(''); setAberto(false) }
  function limpar()           { onSelecionar(null); setBusca('') }

  return (
    <div className="flex flex-col gap-1.5" ref={ref}>
      <label className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant ml-0.5">{label}</label>

      {valor ? (
        <div
          className="flex items-center justify-between rounded-xl px-3 py-2.5"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.10)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="flex items-center gap-2 min-w-0">
            {valor.logo_url && <img src={valor.logo_url} alt={valor.marca} className="w-5 h-5 object-contain shrink-0 dark:invert opacity-70" />}
            <span className="text-sm font-semibold text-on-surface truncate">{valor.marca} {valor.modelo}</span>
          </div>
          <button onClick={limpar} className="material-symbols-outlined text-on-surface-variant hover:text-on-surface transition-colors shrink-0 ml-2" style={{ fontSize: 17 }}>
            close
          </button>
        </div>
      ) : (
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" style={{ fontSize: 17 }}>search</span>
          <input
            type="text"
            placeholder="Buscar marca ou modelo..."
            value={busca}
            onChange={e => { setBusca(e.target.value); setAberto(true) }}
            onFocus={() => setAberto(true)}
            className="w-full rounded-xl py-2.5 pl-10 pr-3 text-sm text-on-surface outline-none transition"
            style={{
              background: 'var(--color-surface-low)',
              border: '1px solid var(--color-outline-variant)',
            }}
          />

          <AnimatePresence>
            {aberto && filtrados.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.16 }}
                className="absolute z-30 top-full mt-1.5 w-full rounded-xl overflow-y-auto max-h-72"
                style={{
                  background: 'rgba(12,12,15,0.97)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(24px)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                }}
              >
                {filtrados.map((c, i) => (
                  <motion.button
                    key={c.id}
                    onMouseDown={() => selecionar(c)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(i * 0.02, 0.15) }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.05] transition-colors text-left"
                  >
                    {c.logo_url && <img src={c.logo_url} alt={c.marca} className="w-5 h-5 object-contain shrink-0 dark:invert opacity-70" />}
                    <span className="text-sm text-on-surface flex-1">
                      <span className="font-semibold">{c.marca}</span> {c.modelo}
                    </span>
                    <span className="ml-auto text-xs text-on-surface-variant shrink-0">{c.ano}</span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {aberto && busca && filtrados.length === 0 && (
            <div className="absolute z-30 top-full mt-1.5 w-full rounded-xl px-4 py-3"
              style={{ background: 'rgba(12,12,15,0.97)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <p className="text-sm text-on-surface-variant">Nenhum carro encontrado.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function Compare() {
  useTitulo('Comparar')
  const [todos, setTodos]   = useState([])
  const [carroA, setCarroA] = useState(null)
  const [carroB, setCarroB] = useState(null)

  useEffect(() => {
    api.get('/carros').then(res => setTodos(res.data)).catch(console.error)
  }, [])

  async function selecionarA(carro) {
    if (!carro) { setCarroA(null); return }
    const res = await api.get(`/carros/${carro.id}`)
    setCarroA(res.data)
  }

  async function selecionarB(carro) {
    if (!carro) { setCarroB(null); return }
    const res = await api.get(`/carros/${carro.id}`)
    setCarroB(res.data)
  }

  const comparando = carroA && carroB

  // Placar final
  let pontosA = 0, pontosB = 0
  if (comparando) {
    campos.forEach(c => {
      const v = vencedor(c, carroA, carroB)
      if (v === 'A') pontosA++
      if (v === 'B') pontosB++
    })
  }
  const campeao = comparando ? (pontosA > pontosB ? carroA : pontosB > pontosA ? carroB : null) : null

  return (
    <div className="max-w-app mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-8">

      {/* Cabeçalho */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
        <p className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant mb-1">Telemetria</p>
        <h1 className="text-2xl sm:text-3xl font-black text-on-surface">Comparar</h1>
        <p className="text-on-surface-variant text-sm mt-1">Confronto técnico lado a lado com precisão de engenharia.</p>
      </motion.div>

      {/* Seletores */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <BuscaCarro label="Carro A" carros={todos} valor={carroA} onSelecionar={selecionarA} carroExcluido={carroB} />
        <BuscaCarro label="Carro B" carros={todos} valor={carroB} onSelecionar={selecionarB} carroExcluido={carroA} />
      </motion.div>

      {/* Imagens */}
      {(carroA || carroB) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 gap-4"
        >
          {[carroA, carroB].map((carro, i) => (
            <div key={i} className="rounded-2xl overflow-hidden flex items-center justify-center aspect-video relative"
              style={{ background: 'var(--color-surface-container)', border: '1px solid var(--color-outline-variant)' }}
            >
              {carro?.imagem_url
                ? <img src={carro.imagem_url} alt={carro.modelo} className="w-full h-full object-cover" />
                : carro
                  ? <span className="material-symbols-outlined text-outline-variant" style={{ fontSize: 56 }}>directions_car</span>
                  : <div className="flex flex-col items-center gap-1 text-outline-variant">
                      <span className="material-symbols-outlined" style={{ fontSize: 40 }}>add_circle</span>
                      <span className="text-xs font-medium">Selecione um carro</span>
                    </div>
              }
              {/* Label overlay */}
              {carro && (
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-black tracking-widest uppercase text-white"
                  style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
                >
                  {i === 0 ? 'A' : 'B'}
                </div>
              )}
            </div>
          ))}
        </motion.div>
      )}

      {/* Tabela de comparação */}
      <AnimatePresence>
        {comparando && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'var(--color-surface-container)',
              border: '1px solid var(--color-outline-variant)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            }}
          >
            {/* Cabeçalho da tabela */}
            <div className="grid grid-cols-3" style={{ background: 'var(--color-surface-low)' }}>
              <div className="p-4 flex items-center">
                <span className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">Especificação</span>
              </div>
              {[carroA, carroB].map((carro, i) => (
                <div key={i} className="p-4 border-l border-outline-variant">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded text-white"
                      style={{ background: i === 0 ? '#E30613' : '#00C6FF' }}
                    >
                      {i === 0 ? 'A' : 'B'}
                    </span>
                    {carro.logo_url && <img src={carro.logo_url} alt={carro.marca} className="w-5 h-5 object-contain dark:invert opacity-70" />}
                  </div>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">{carro.marca}</p>
                  <p className="font-black text-on-surface text-sm sm:text-base leading-tight">{carro.modelo}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">{carro.ano}</p>
                </div>
              ))}
            </div>

            {/* Linhas de dados */}
            {campos.map((campo, i) => {
              const valA   = campo.format ? campo.format(carroA[campo.key]) : carroA[campo.key]
              const valB   = campo.format ? campo.format(carroB[campo.key]) : carroB[campo.key]
              const ganhou = vencedor(campo, carroA, carroB)
              const venceA = ganhou === 'A'
              const venceB = ganhou === 'B'

              if (!carroA[campo.key] && !carroB[campo.key]) return null

              return (
                <motion.div
                  key={campo.key}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.4 }}
                  className="grid grid-cols-3"
                  style={{
                    background: i % 2 === 0 ? 'var(--color-surface-container)' : 'var(--color-surface-low)',
                    borderTop: '1px solid var(--color-outline-variant)',
                  }}
                >
                  {/* Label */}
                  <div className="p-3 sm:p-4 flex items-center">
                    <span className="text-[9px] sm:text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">{campo.label}</span>
                  </div>

                  {/* Valor A */}
                  <div
                    className="p-3 sm:p-4 border-l border-outline-variant flex flex-col justify-center"
                    style={{ background: venceA ? 'rgba(34,197,94,0.06)' : 'transparent' }}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs sm:text-sm font-bold ${venceA ? 'text-green-500 dark:text-green-400' : 'text-on-surface'}`}>
                        {valA || '—'}
                      </span>
                      {venceA && (
                        <span className="material-symbols-outlined text-green-500" style={{ fontSize: 14 }}>arrow_upward</span>
                      )}
                    </div>
                    <BarraTelemetria
                      valA={carroA[campo.key]}
                      valB={carroB[campo.key]}
                      tipo={campo.tipo}
                      ganhou={ganhou}
                      lado="A"
                    />
                  </div>

                  {/* Valor B */}
                  <div
                    className="p-3 sm:p-4 border-l border-outline-variant flex flex-col justify-center"
                    style={{ background: venceB ? 'rgba(34,197,94,0.06)' : 'transparent' }}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs sm:text-sm font-bold ${venceB ? 'text-green-500 dark:text-green-400' : 'text-on-surface'}`}>
                        {valB || '—'}
                      </span>
                      {venceB && (
                        <span className="material-symbols-outlined text-green-500" style={{ fontSize: 14 }}>arrow_upward</span>
                      )}
                    </div>
                    <BarraTelemetria
                      valA={carroA[campo.key]}
                      valB={carroB[campo.key]}
                      tipo={campo.tipo}
                      ganhou={ganhou}
                      lado="B"
                    />
                  </div>
                </motion.div>
              )
            })}

            {/* Placar final */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
              style={{
                borderTop: '1px solid var(--color-outline-variant)',
                background: 'var(--color-surface-low)',
              }}
            >
              {/* Placar */}
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="flex items-center gap-2 justify-center mb-0.5">
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded text-white" style={{ background: '#E30613' }}>A</span>
                    <p className={`text-3xl font-black ${pontosA >= pontosB ? 'text-green-500' : 'text-on-surface-variant'}`}>{pontosA}</p>
                  </div>
                  <p className="text-xs text-on-surface-variant truncate max-w-[80px]">{carroA.modelo}</p>
                </div>

                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-on-surface-variant font-black text-lg">×</span>
                  <span className="text-[9px] text-on-surface-variant font-bold tracking-widest uppercase">Placar</span>
                </div>

                <div className="text-center">
                  <div className="flex items-center gap-2 justify-center mb-0.5">
                    <p className={`text-3xl font-black ${pontosB >= pontosA ? 'text-green-500' : 'text-on-surface-variant'}`}>{pontosB}</p>
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded text-white" style={{ background: '#00C6FF' }}>B</span>
                  </div>
                  <p className="text-xs text-on-surface-variant truncate max-w-[80px]">{carroB.modelo}</p>
                </div>
              </div>

              {/* Resultado */}
              {campeao ? (
                <div
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)', boxShadow: '0 0 20px rgba(34,197,94,0.3)' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 17 }}>emoji_events</span>
                  {campeao.marca} {campeao.modelo} venceu!
                </div>
              ) : (
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-on-surface-variant bg-surface-container border border-outline-variant">
                  <span className="material-symbols-outlined" style={{ fontSize: 17 }}>handshake</span>
                  Empate!
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Estado vazio */}
      {!carroA && !carroB && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center justify-center py-24 gap-4 text-on-surface-variant"
        >
          <div className="p-6 rounded-full" style={{ background: 'var(--color-surface-container)' }}>
            <span className="material-symbols-outlined text-outline-variant" style={{ fontSize: 56 }}>compare_arrows</span>
          </div>
          <p className="text-sm font-medium">Selecione dois carros acima para iniciar o confronto.</p>
        </motion.div>
      )}
    </div>
  )
}
