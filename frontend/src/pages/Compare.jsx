import { useState, useEffect, useRef } from 'react'
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

// Campos da tabela de comparação
// tipo 'text'   → só exibe, sem destacar vencedor
// tipo 'menor'  → menor valor vence (preço, consumo, 0-100)
// tipo 'maior'  → maior valor vence (ano, potência, torque, vel. máx)
const campos = [
  { label: 'Marca',            key: 'marca',            tipo: 'text' },
  { label: 'Categoria',        key: 'categoria',        tipo: 'text' },
  { label: 'Combustível',      key: 'combustivel',      tipo: 'text',   format: v => combustivelLabel[v] || v },
  { label: 'Ano',              key: 'ano',              tipo: 'maior' },
  { label: 'Preço',            key: 'preco',            tipo: 'menor',  format: formatarPreco },
  { label: 'Motor',            key: 'motor',            tipo: 'text' },
  { label: 'Potência',         key: 'potencia',         tipo: 'maior' },
  { label: 'Torque',           key: 'torque',           tipo: 'maior' },
  { label: '0–100 km/h',       key: 'zero_cem',         tipo: 'menor' },
  { label: 'Vel. máxima',      key: 'velocidade_maxima',tipo: 'maior' },
  { label: 'Consumo',          key: 'consumo',          tipo: 'text' },
]

// Extrai número de uma string como "116 cv", "10.2s", "175 km/h"
function extrairNumero(val) {
  if (val == null) return null
  const n = parseFloat(String(val).replace(',', '.'))
  return isNaN(n) ? null : n
}

// Retorna 'A', 'B' ou null (empate/sem dados)
function vencedor(campo, carroA, carroB) {
  if (campo.tipo === 'text') return null
  const a = extrairNumero(carroA[campo.key])
  const b = extrairNumero(carroB[campo.key])
  if (a == null || b == null || a === b) return null
  if (campo.tipo === 'maior') return a > b ? 'A' : 'B'
  if (campo.tipo === 'menor') return a < b ? 'A' : 'B'
  return null
}

// Campo de busca com dropdown de sugestões
function BuscaCarro({ label, carros, valor, onSelecionar, carroExcluido }) {
  const [busca, setBusca]       = useState('')
  const [aberto, setAberto]     = useState(false)
  const ref                     = useRef(null)

  // Fecha ao clicar fora
  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setAberto(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filtrados = carros.filter(c => {
    if (carroExcluido && c.id === carroExcluido.id) return false
    const termo = busca.toLowerCase()
    return !termo || c.modelo.toLowerCase().includes(termo) || c.marca.toLowerCase().includes(termo)
  }).slice(0, 8)

  function selecionar(carro) {
    onSelecionar(carro)
    setBusca('')
    setAberto(false)
  }

  function limpar() {
    onSelecionar(null)
    setBusca('')
  }

  return (
    <div className="flex flex-col gap-1" ref={ref}>
      <label className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant ml-1">{label}</label>

      {/* Carro selecionado */}
      {valor ? (
        <div className="flex items-center justify-between bg-surface-low rounded-lg px-3 py-2.5 border border-primary-container/30">
          <div className="flex items-center gap-2 min-w-0">
            {valor.logo_url && <img src={valor.logo_url} alt={valor.marca} className="w-5 h-5 object-contain shrink-0" />}
            <span className="text-sm font-semibold text-on-surface truncate">{valor.marca} {valor.modelo}</span>
          </div>
          <button onClick={limpar} className="material-symbols-outlined text-outline hover:text-on-surface transition-colors shrink-0 ml-2" style={{ fontSize: 18 }}>
            close
          </button>
        </div>
      ) : (
        /* Input de busca */
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none" style={{ fontSize: 18 }}>search</span>
          <input
            type="text"
            placeholder="Buscar marca ou modelo..."
            value={busca}
            onChange={e => { setBusca(e.target.value); setAberto(true) }}
            onFocus={() => setAberto(true)}
            className="w-full bg-surface-low border border-transparent rounded-lg py-2.5 pl-10 pr-3 text-sm text-on-surface outline-none transition focus:border-primary-container focus:ring-2 focus:ring-primary-container/10"
          />

          {/* Dropdown */}
          {aberto && filtrados.length > 0 && (
            <div className="absolute z-30 top-full mt-1 w-full bg-white dark:bg-surface-container rounded-xl shadow-lg border border-outline-variant overflow-hidden">
              {filtrados.map(c => (
                <button
                  key={c.id}
                  onMouseDown={() => selecionar(c)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-surface-low transition-colors text-left"
                >
                  {c.logo_url && <img src={c.logo_url} alt={c.marca} className="w-5 h-5 object-contain shrink-0" />}
                  <span className="text-sm text-on-surface"><span className="font-semibold">{c.marca}</span> {c.modelo}</span>
                  <span className="ml-auto text-xs text-on-surface-variant">{c.ano}</span>
                </button>
              ))}
            </div>
          )}

          {aberto && busca && filtrados.length === 0 && (
            <div className="absolute z-30 top-full mt-1 w-full bg-white dark:bg-surface-container rounded-xl shadow-lg border border-outline-variant px-4 py-3">
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

  // Busca detalhes completos ao selecionar
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

  return (
    <div className="max-w-app mx-auto px-4 sm:px-6 py-8 sm:py-10 flex flex-col gap-8">

      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-on-surface">Comparar</h1>
        <p className="text-on-surface-variant text-sm mt-1">Busque dois carros para comparar lado a lado.</p>
      </div>

      {/* Seletores de busca */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BuscaCarro label="Carro A" carros={todos} valor={carroA} onSelecionar={selecionarA} carroExcluido={carroB} />
        <BuscaCarro label="Carro B" carros={todos} valor={carroB} onSelecionar={selecionarB} carroExcluido={carroA} />
      </div>

      {/* Imagens */}
      {(carroA || carroB) && (
        <div className="grid grid-cols-2 gap-4">
          {[carroA, carroB].map((carro, i) => (
            <div key={i} className="bg-surface-container rounded-2xl overflow-hidden flex items-center justify-center aspect-video">
              {carro?.imagem_url
                ? <img src={carro.imagem_url} alt={carro.modelo} className="w-full h-full object-cover" />
                : carro
                  ? <span className="material-symbols-outlined text-outline-variant" style={{ fontSize: 64 }}>directions_car</span>
                  : <div className="w-full h-full bg-surface-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-outline-variant" style={{ fontSize: 48 }}>add_circle</span>
                    </div>
              }
            </div>
          ))}
        </div>
      )}

      {/* Tabela de comparação */}
      {comparando && (
        <div className="bg-white dark:bg-surface-container rounded-2xl shadow-card overflow-hidden">

          {/* Cabeçalho */}
          <div className="grid grid-cols-3 bg-surface-container">
            <div className="p-4" />
            {[carroA, carroB].map((carro, i) => (
              <div key={i} className="p-4 border-l border-outline-variant">
                {carro.logo_url && <img src={carro.logo_url} alt={carro.marca} className="w-6 h-6 object-contain mb-1" />}
                <p className="text-xs font-bold tracking-widest uppercase text-on-surface-variant">{carro.marca}</p>
                <p className="font-black text-on-surface text-sm sm:text-base">{carro.modelo}</p>
                <p className="text-xs text-on-surface-variant mt-0.5">{carro.ano}</p>
              </div>
            ))}
          </div>

          {/* Linhas */}
          {campos.map((campo, i) => {
            const valA    = campo.format ? campo.format(carroA[campo.key]) : carroA[campo.key]
            const valB    = campo.format ? campo.format(carroB[campo.key]) : carroB[campo.key]
            const ganhou  = vencedor(campo, carroA, carroB)
            const venceA  = ganhou === 'A'
            const venceB  = ganhou === 'B'

            if (!carroA[campo.key] && !carroB[campo.key]) return null

            return (
              <div key={campo.key} className={`grid grid-cols-3 ${i % 2 === 0 ? 'bg-white dark:bg-surface-container' : 'bg-surface-low'}`}>
                <div className="p-3 sm:p-4 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-on-surface-variant flex items-center">
                  {campo.label}
                </div>

                {/* Valor A */}
                <div className={`p-3 sm:p-4 border-l border-outline-variant flex items-center gap-2 ${venceA ? 'bg-green-50' : ''}`}>
                  <span className={`text-xs sm:text-sm font-semibold ${venceA ? 'text-green-700' : 'text-on-surface'}`}>
                    {valA || '—'}
                  </span>
                  {venceA && <span className="material-symbols-outlined text-green-500 shrink-0" style={{ fontSize: 16 }}>arrow_upward</span>}
                </div>

                {/* Valor B */}
                <div className={`p-3 sm:p-4 border-l border-outline-variant flex items-center gap-2 ${venceB ? 'bg-green-50' : ''}`}>
                  <span className={`text-xs sm:text-sm font-semibold ${venceB ? 'text-green-700' : 'text-on-surface'}`}>
                    {valB || '—'}
                  </span>
                  {venceB && <span className="material-symbols-outlined text-green-500 shrink-0" style={{ fontSize: 16 }}>arrow_upward</span>}
                </div>
              </div>
            )
          })}

          {/* Placar final */}
          {(() => {
            let pontosA = 0, pontosB = 0
            campos.forEach(c => {
              const v = vencedor(c, carroA, carroB)
              if (v === 'A') pontosA++
              if (v === 'B') pontosB++
            })
            const campeao = pontosA > pontosB ? carroA : pontosB > pontosA ? carroB : null
            return (
              <div className="p-5 bg-surface-container border-t border-outline-variant flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className={`text-2xl font-black ${pontosA >= pontosB ? 'text-green-600' : 'text-on-surface-variant'}`}>{pontosA}</p>
                    <p className="text-xs text-on-surface-variant">{carroA.modelo}</p>
                  </div>
                  <p className="text-on-surface-variant font-bold text-lg">×</p>
                  <div className="text-center">
                    <p className={`text-2xl font-black ${pontosB >= pontosA ? 'text-green-600' : 'text-on-surface-variant'}`}>{pontosB}</p>
                    <p className="text-xs text-on-surface-variant">{carroB.modelo}</p>
                  </div>
                </div>
                {campeao
                  ? <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-bold">
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>emoji_events</span>
                      {campeao.marca} {campeao.modelo} venceu!
                    </div>
                  : <div className="flex items-center gap-2 bg-surface-low text-on-surface-variant px-4 py-2 rounded-full text-sm font-bold">
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>handshake</span>
                      Empate!
                    </div>
                }
              </div>
            )
          })()}

        </div>
      )}

      {/* Estado vazio */}
      {!carroA && !carroB && (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-on-surface-variant">
          <span className="material-symbols-outlined text-outline-variant" style={{ fontSize: 64 }}>compare_arrows</span>
          <p className="text-sm">Busque dois carros acima para começar.</p>
        </div>
      )}

    </div>
  )
}
