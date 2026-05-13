import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { Badge } from '../components/ui'
import { useTitulo } from '../hooks/useTitulo'

function formatarPreco(preco) {
  return Number(preco).toLocaleString('pt-BR', {
    style: 'currency', currency: 'BRL', maximumFractionDigits: 0
  })
}

const podioAltura = ['order-2 mt-4 sm:mt-8', 'order-1', 'order-3 mt-8 sm:mt-16']
const podioBorda  = [
  'border-amber-400 dark:border-amber-500',
  'border-slate-400 dark:border-slate-500',
  'border-orange-400 dark:border-orange-600',
]
const podioFundo  = [
  'bg-amber-50 dark:bg-amber-900/20',
  'bg-slate-50 dark:bg-slate-800/30',
  'bg-orange-50 dark:bg-orange-900/20',
]
const podioNumero = [
  'text-amber-500 dark:text-amber-400',
  'text-slate-400 dark:text-slate-300',
  'text-orange-500 dark:text-orange-400',
]

export function Ranking() {
  useTitulo('Ranking')
  const navigate   = useNavigate()
  const [lista, setLista]         = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    api.get('/votos/ranking')
      .then(res => setLista(res.data))
      .catch(console.error)
      .finally(() => setCarregando(false))
  }, [])

  const podio   = lista.slice(0, 3)
  const restante = lista.slice(3)

  return (
    <div className="max-w-app mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-10">

      {/* Cabeçalho */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-amber-500" style={{ fontSize: 32 }}>emoji_events</span>
          <h1 className="text-2xl sm:text-3xl font-black text-on-surface">Ranking de Carros</h1>
        </div>
        <p className="text-on-surface-variant text-sm mt-1">
          Os carros mais votados pela comunidade CarCompare. Vote no seu favorito na página de detalhes.
        </p>
      </div>

      {carregando ? (
        <p className="text-center text-on-surface-variant py-20">Carregando ranking...</p>
      ) : lista.length === 0 ? (
        <div className="flex flex-col items-center py-20 gap-3 text-on-surface-variant">
          <span className="material-symbols-outlined text-outline-variant" style={{ fontSize: 64 }}>how_to_vote</span>
          <p className="text-sm">Ainda não há votos. Seja o primeiro a votar!</p>
          <button onClick={() => navigate('/catalogo')} className="text-sm text-primary-container font-semibold hover:underline">
            Explorar catálogo
          </button>
        </div>
      ) : (
        <>
          {/* Pódio — top 3 */}
          {podio.length >= 1 && (
            <div className="flex items-end justify-center gap-3 sm:gap-6">
              {podio.map((carro, i) => (
                <button
                  key={carro.id}
                  onClick={() => navigate(`/carros/${carro.id}`)}
                  className={`flex flex-col items-center gap-2 flex-1 max-w-[200px] rounded-2xl border-2 p-4 sm:p-5 transition-transform hover:-translate-y-1 cursor-pointer
                    ${podioAltura[i]} ${podioBorda[i]} ${podioFundo[i]}`}
                >
                  <span className={`text-3xl sm:text-4xl font-black ${podioNumero[i]}`}>{i + 1}</span>

                  {/* Foto */}
                  <div className="w-full aspect-video rounded-lg overflow-hidden bg-surface-container">
                    {carro.imagem_url
                      ? <img src={carro.imagem_url} alt={carro.modelo} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-outline-variant" style={{ fontSize: 36 }}>directions_car</span>
                        </div>
                    }
                  </div>

                  {/* Info */}
                  <div className="text-center">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">{carro.marca}</p>
                    <p className="font-black text-on-surface text-sm sm:text-base leading-tight">{carro.modelo}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">{carro.ano}</p>
                  </div>

                  {/* Votos */}
                  <div className="flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-amber-500" style={{ fontSize: 16 }}>thumb_up</span>
                    <span className="font-black text-on-surface text-sm">{carro.total_votos}</span>
                    <span className="text-xs text-on-surface-variant">voto{carro.total_votos !== 1 ? 's' : ''}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Lista — posições 4 em diante */}
          {restante.length > 0 && (
            <div className="flex flex-col gap-3">
              <h2 className="text-sm font-bold tracking-widest uppercase text-on-surface-variant">Demais posições</h2>
              <div className="bg-white dark:bg-surface-container rounded-2xl shadow-card overflow-hidden">
                {restante.map((carro, i) => (
                  <button
                    key={carro.id}
                    onClick={() => navigate(`/carros/${carro.id}`)}
                    className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-surface-low ${
                      i !== 0 ? 'border-t border-outline-variant' : ''
                    }`}
                  >
                    {/* Posição */}
                    <span className="text-base font-black text-on-surface-variant w-6 shrink-0 text-center">
                      {i + 4}
                    </span>

                    {/* Foto miniatura */}
                    <div className="w-16 h-10 rounded-lg overflow-hidden bg-surface-low shrink-0">
                      {carro.imagem_url
                        ? <img src={carro.imagem_url} alt={carro.modelo} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-outline-variant" style={{ fontSize: 20 }}>directions_car</span>
                          </div>
                      }
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">{carro.marca}</p>
                      <p className="font-bold text-on-surface text-sm truncate">{carro.modelo}</p>
                    </div>

                    {/* Badge categoria */}
                    <Badge variant="default" className="hidden sm:block shrink-0">{carro.categoria}</Badge>

                    {/* Preço */}
                    <p className="font-black text-primary-container text-sm shrink-0 hidden sm:block">
                      {formatarPreco(carro.preco)}
                    </p>

                    {/* Votos */}
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="material-symbols-outlined text-amber-500" style={{ fontSize: 16 }}>thumb_up</span>
                      <span className="font-black text-on-surface text-sm">{carro.total_votos}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

    </div>
  )
}
