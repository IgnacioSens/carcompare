import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { Badge, Button, SpecCard, CarCard } from '../components/ui'
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

function gerarDescricao(carro) {
  const combustivel = combustivelLabel[carro.combustivel] || carro.combustivel
  const origem = carro.pais_origem ? `de origem ${carro.pais_origem}` : ''
  const motor  = carro.motor ? `Equipado com motor ${carro.motor}` : ''
  const pot    = carro.potencia ? `, com ${carro.potencia} de potência` : ''
  const torque = carro.torque ? ` e ${carro.torque} de torque` : ''
  const zero   = carro.zero_cem ? ` Acelera de 0 a 100 km/h em ${carro.zero_cem}.` : ''
  const vmax   = carro.velocidade_maxima ? ` Velocidade máxima de ${carro.velocidade_maxima}.` : ''
  const consumo = carro.consumo ? ` Consumo médio de ${carro.consumo}.` : ''

  return [
    `O ${carro.marca} ${carro.modelo} é um ${carro.categoria?.toLowerCase()} ${origem} lançado em ${carro.ano}, movido a ${combustivel}.`,
    motor ? `${motor}${pot}${torque}.${zero}${vmax}${consumo}` : '',
    `Com preço de ${formatarPreco(carro.preco)}, é uma ótima opção na categoria ${carro.categoria?.toLowerCase()}.`,
  ].filter(Boolean).join(' ')
}

export function Detail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [carro, setCarro]           = useState(null)
  const [similares, setSimilares]   = useState([])
  const [carregando, setCarregando] = useState(true)
  const [favoritado, setFavoritado] = useState(false)
  const [msgFav, setMsgFav]         = useState('')
  const [votado, setVotado]         = useState(false)
  const [totalVotos, setTotalVotos] = useState(0)

  const usuario = localStorage.getItem('usuario')

  useEffect(() => {
    setCarregando(true)
    api.get(`/carros/${id}`)
      .then(res => {
        const dados = res.data
        setCarro(dados)

        // Salva no localStorage como "visto recentemente"
        const recentes = JSON.parse(localStorage.getItem('carros_recentes') || '[]')
        const sem_atual = recentes.filter(c => c.id !== dados.id)
        const atualizado = [
          {
            id:         dados.id,
            modelo:     dados.modelo,
            marca:      dados.marca,
            preco:      dados.preco,
            imagem_url: dados.imagem_url,
            logo_url:   dados.logo_url,
            categoria:  dados.categoria,
            combustivel:dados.combustivel,
            ano:        dados.ano,
          },
          ...sem_atual,
        ].slice(0, 5)
        localStorage.setItem('carros_recentes', JSON.stringify(atualizado))

        // Busca total de votos
        api.get(`/votos/ranking`).then(r => {
          const entry = r.data.find(c => c.id === dados.id)
          setTotalVotos(entry?.total_votos || 0)
        }).catch(() => {})

        // Verifica se usuário já votou
        if (localStorage.getItem('token')) {
          api.get(`/votos/meu-voto/${dados.id}`).then(r => setVotado(r.data.votado)).catch(() => {})
        }

        // Busca similares da mesma categoria
        return api.get('/carros', { params: { categoria: dados.categoria_id } })
          .then(r => setSimilares(r.data.filter(c => c.id !== id).slice(0, 3)))
          .catch(() => {})
      })
      .catch(() => navigate('/catalogo'))
      .finally(() => setCarregando(false))
  }, [id])

  async function toggleVoto() {
    if (!usuario) { navigate('/login'); return }
    try {
      if (votado) {
        const res = await api.delete(`/votos/${id}`)
        setVotado(false)
        setTotalVotos(res.data.total_votos)
      } else {
        const res = await api.post(`/votos/${id}`)
        setVotado(true)
        setTotalVotos(res.data.total_votos)
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function toggleFavorito() {
    if (!usuario) { navigate('/login'); return }
    try {
      if (favoritado) {
        await api.delete(`/favoritos/${id}`)
        setFavoritado(false)
        setMsgFav('Removido dos favoritos.')
      } else {
        await api.post('/favoritos', { carro_id: id })
        setFavoritado(true)
        setMsgFav('Adicionado aos favoritos!')
      }
    } catch (err) {
      setMsgFav(err.response?.data?.erro || 'Erro ao atualizar favoritos.')
    }
    setTimeout(() => setMsgFav(''), 3000)
  }

  useTitulo(carro ? `${carro.marca} ${carro.modelo}` : '')

  if (carregando) return <p className="text-center py-24 text-on-surface-variant">Carregando...</p>
  if (!carro) return null

  return (
    <div className="max-w-app mx-auto px-4 sm:px-6 py-8 sm:py-10 flex flex-col gap-8 sm:gap-10">

      {/* Voltar */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-on-surface-variant hover:text-on-surface transition-colors w-fit">
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Voltar
      </button>

      {/* Grid principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-start">

        {/* Coluna esquerda: imagem + sobre o modelo */}
        <div className="flex flex-col gap-5">

          {/* Imagem ou placeholder estilizado */}
          <div className="rounded-2xl overflow-hidden aspect-video w-full">
            {carro.imagem_url ? (
              <img src={carro.imagem_url} alt={carro.modelo} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4"
                style={{ background: 'linear-gradient(135deg, #0f1535 0%, #1a2356 60%, #0f1535 100%)' }}>
                {carro.logo_url
                  ? <img src={carro.logo_url} alt={carro.marca} className="w-24 h-24 object-contain opacity-90" />
                  : <span className="material-symbols-outlined text-white/30" style={{ fontSize: 80 }}>directions_car</span>
                }
                <div className="text-center">
                  <p className="text-white/50 text-xs font-bold tracking-widest uppercase">{carro.marca}</p>
                  <p className="text-white font-black text-2xl">{carro.modelo}</p>
                  <p className="text-white/40 text-xs mt-1">{carro.ano}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sobre o modelo */}
          <div className="bg-white dark:bg-surface-container rounded-2xl shadow-card p-5 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container" style={{ fontSize: 18 }}>info</span>
              <h2 className="font-black text-on-surface">Sobre o modelo</h2>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed">{gerarDescricao(carro)}</p>
            <p className="text-xs text-on-surface-variant/60">
              * As informações podem variar conforme versão, ano-modelo e região.
            </p>
          </div>

        </div>

        {/* Info */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">{carro.categoria}</Badge>
              <Badge variant={carro.combustivel === 'eletrico' ? 'electric' : carro.combustivel === 'hibrido' ? 'warning' : 'default'}>
                {combustivelLabel[carro.combustivel] || carro.combustivel}
              </Badge>
            </div>
            <p className="text-xs sm:text-sm font-bold tracking-widest uppercase text-on-surface-variant">{carro.marca}</p>
            <h1 className="text-2xl sm:text-3xl font-black text-on-surface">{carro.modelo}</h1>
            <p className="text-2xl sm:text-3xl font-black text-primary-container">{formatarPreco(carro.preco)}</p>
          </div>

          {/* Specs básicos */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <SpecCard icon="calendar_today"    label="Ano"         value={carro.ano} />
            <SpecCard icon="local_gas_station" label="Combustível" value={combustivelLabel[carro.combustivel] || carro.combustivel} />
            <SpecCard icon="category"          label="Categoria"   value={carro.categoria} />
            <SpecCard icon="public"            label="Origem"      value={carro.pais_origem || '—'} />
          </div>

          {/* Specs técnicos */}
          {(carro.potencia || carro.torque || carro.motor) && (
            <div className="flex flex-col gap-2 sm:gap-3">
              <p className="text-xs font-bold tracking-widest uppercase text-on-surface-variant">Especificações técnicas</p>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {carro.motor             && <SpecCard icon="settings"          label="Motor"       value={carro.motor} />}
                {carro.potencia          && <SpecCard icon="bolt"              label="Potência"    value={carro.potencia} />}
                {carro.torque            && <SpecCard icon="rotate_right"      label="Torque"      value={carro.torque} />}
                {carro.consumo           && <SpecCard icon="local_gas_station" label="Consumo"     value={carro.consumo} />}
                {carro.zero_cem          && <SpecCard icon="speed"             label="0–100 km/h"  value={carro.zero_cem} />}
                {carro.velocidade_maxima && <SpecCard icon="straighten"        label="Vel. máxima" value={carro.velocidade_maxima} />}
              </div>
            </div>
          )}

          {/* Ações */}
          <div className="flex flex-col gap-3">
            <Button
              variant={favoritado ? 'outline' : 'primary'}
              icon={favoritado ? 'heart_minus' : 'favorite'}
              iconPosition="left"
              onClick={toggleFavorito}
            >
              {favoritado ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            </Button>

            {/* Voto */}
            <button
              onClick={toggleVoto}
              className={`flex items-center justify-center gap-2 w-full px-6 py-2.5 rounded-lg border text-[13px] font-semibold tracking-wide uppercase transition-all active:scale-95
                ${votado
                  ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400'
                  : 'bg-white dark:bg-surface-container border-outline-variant text-on-surface hover:border-amber-400 hover:text-amber-600 dark:hover:border-amber-600 dark:hover:text-amber-400'
                }`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                {votado ? 'thumb_up' : 'thumb_up'}
              </span>
              {votado ? `Você votou · ${totalVotos} voto${totalVotos !== 1 ? 's' : ''}` : `Votar neste carro · ${totalVotos} voto${totalVotos !== 1 ? 's' : ''}`}
            </button>

            <Button variant="secondary" icon="compare_arrows" iconPosition="left" onClick={() => navigate('/comparar')}>
              Comparar
            </Button>
            {msgFav && <p className="text-sm text-center text-on-surface-variant">{msgFav}</p>}
          </div>
        </div>

      </div>

      {/* Carros similares */}
      {similares.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-on-surface text-lg">Carros similares</h2>
            <button onClick={() => navigate('/catalogo')} className="text-sm text-primary-container font-semibold hover:underline">
              Ver todos
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {similares.map(c => <CarCard key={c.id} car={c} />)}
          </div>
        </div>
      )}

    </div>
  )
}
