import { useState, useEffect } from 'react'
import api from '../services/api'
import { Select, Badge } from '../components/ui'

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
  { label: 'Marca',       key: 'marca' },
  { label: 'Categoria',   key: 'categoria' },
  { label: 'Ano',         key: 'ano' },
  { label: 'Preço',       key: 'preco',      format: formatarPreco },
  { label: 'Combustível', key: 'combustivel', format: v => combustivelLabel[v] || v },
]

export function Compare() {
  const [todos, setTodos]       = useState([])
  const [idA, setIdA]           = useState('')
  const [idB, setIdB]           = useState('')
  const [carroA, setCarroA]     = useState(null)
  const [carroB, setCarroB]     = useState(null)

  useEffect(() => {
    api.get('/carros').then(res => setTodos(res.data)).catch(console.error)
  }, [])

  useEffect(() => {
    if (idA) api.get(`/carros/${idA}`).then(res => setCarroA(res.data)).catch(console.error)
    else setCarroA(null)
  }, [idA])

  useEffect(() => {
    if (idB) api.get(`/carros/${idB}`).then(res => setCarroB(res.data)).catch(console.error)
    else setCarroB(null)
  }, [idB])

  const opcoes = [
    { value: '', label: 'Selecionar carro...' },
    ...todos.map(c => ({ value: c.id, label: `${c.marca} ${c.modelo}` }))
  ]

  return (
    <div className="max-w-app mx-auto px-6 py-10 flex flex-col gap-8">

      <div>
        <h1 className="text-3xl font-black text-on-surface">Comparar</h1>
        <p className="text-on-surface-variant text-sm mt-1">Selecione dois carros para comparar lado a lado.</p>
      </div>

      {/* Seletores */}
      <div className="grid grid-cols-2 gap-4">
        <Select label="Carro A" options={opcoes} value={idA} onChange={e => setIdA(e.target.value)} />
        <Select label="Carro B" options={opcoes} value={idB} onChange={e => setIdB(e.target.value)} />
      </div>

      {/* Imagens */}
      {(carroA || carroB) && (
        <div className="grid grid-cols-2 gap-4">
          {[carroA, carroB].map((carro, i) => (
            <div key={i} className="bg-surface-container rounded-2xl overflow-hidden flex items-center justify-center h-48">
              {carro?.imagem_url
                ? <img src={carro.imagem_url} alt={carro.modelo} className="w-full h-full object-cover" />
                : carro
                  ? <span className="material-symbols-outlined text-outline-variant" style={{ fontSize: 64 }}>directions_car</span>
                  : null
              }
            </div>
          ))}
        </div>
      )}

      {/* Tabela de comparação */}
      {carroA && carroB && (
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">

          {/* Cabeçalho */}
          <div className="grid grid-cols-3 bg-surface-container">
            <div className="p-4 text-xs font-bold tracking-widest uppercase text-on-surface-variant" />
            <div className="p-4 border-l border-outline-variant">
              <p className="text-xs font-bold tracking-widest uppercase text-on-surface-variant">{carroA.marca}</p>
              <p className="font-black text-on-surface">{carroA.modelo}</p>
            </div>
            <div className="p-4 border-l border-outline-variant">
              <p className="text-xs font-bold tracking-widest uppercase text-on-surface-variant">{carroB.marca}</p>
              <p className="font-black text-on-surface">{carroB.modelo}</p>
            </div>
          </div>

          {/* Linhas */}
          {campos.map((campo, i) => {
            const valA = campo.format ? campo.format(carroA[campo.key]) : carroA[campo.key]
            const valB = campo.format ? campo.format(carroB[campo.key]) : carroB[campo.key]
            return (
              <div key={campo.key} className={`grid grid-cols-3 ${i % 2 === 0 ? 'bg-white' : 'bg-surface-low'}`}>
                <div className="p-4 text-xs font-bold tracking-widest uppercase text-on-surface-variant">{campo.label}</div>
                <div className="p-4 border-l border-outline-variant font-semibold text-on-surface text-sm">{valA}</div>
                <div className="p-4 border-l border-outline-variant font-semibold text-on-surface text-sm">{valB}</div>
              </div>
            )
          })}

        </div>
      )}

      {!carroA && !carroB && (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-on-surface-variant">
          <span className="material-symbols-outlined text-outline-variant" style={{ fontSize: 64 }}>compare_arrows</span>
          <p className="text-sm">Selecione dois carros acima para começar.</p>
        </div>
      )}

    </div>
  )
}
