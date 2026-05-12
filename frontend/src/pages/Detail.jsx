import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { Badge, Button, SpecCard } from '../components/ui'

function formatarPreco(preco) {
  return Number(preco).toLocaleString('pt-BR', {
    style: 'currency', currency: 'BRL', maximumFractionDigits: 0
  })
}

const combustivelLabel = {
  flex: 'Flex', gasolina: 'Gasolina', diesel: 'Diesel',
  eletrico: 'Elétrico', hibrido: 'Híbrido',
}

export function Detail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [carro, setCarro]           = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [favoritado, setFavoritado] = useState(false)
  const [msgFav, setMsgFav]         = useState('')

  const usuario = localStorage.getItem('usuario')

  useEffect(() => {
    api.get(`/carros/${id}`)
      .then(res => setCarro(res.data))
      .catch(() => navigate('/catalogo'))
      .finally(() => setCarregando(false))
  }, [id])

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

  if (carregando) return <p className="text-center py-24 text-on-surface-variant">Carregando...</p>
  if (!carro) return null

  return (
    <div className="max-w-app mx-auto px-4 sm:px-6 py-8 sm:py-10 flex flex-col gap-6 sm:gap-8">

      {/* Voltar */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-on-surface-variant hover:text-on-surface transition-colors w-fit">
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Voltar
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-start">

        {/* Imagem */}
        <div className="bg-surface-container rounded-2xl overflow-hidden flex items-center justify-center aspect-video w-full">
          {carro.imagem_url
            ? <img src={carro.imagem_url} alt={carro.modelo} className="w-full h-full object-cover" />
            : <span className="material-symbols-outlined text-outline-variant" style={{ fontSize: 96 }}>directions_car</span>
          }
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
            <SpecCard icon="calendar_today"     label="Ano"        value={carro.ano} />
            <SpecCard icon="local_gas_station"  label="Combustível" value={combustivelLabel[carro.combustivel] || carro.combustivel} />
            <SpecCard icon="category"           label="Categoria"  value={carro.categoria} />
            <SpecCard icon="public"             label="Origem"     value={carro.pais_origem || '—'} />
          </div>

          {/* Specs técnicos */}
          {(carro.potencia || carro.torque || carro.motor) && (
            <div className="flex flex-col gap-2 sm:gap-3">
              <p className="text-xs font-bold tracking-widest uppercase text-on-surface-variant">Especificações técnicas</p>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {carro.motor             && <SpecCard icon="settings"          label="Motor"        value={carro.motor} />}
                {carro.potencia          && <SpecCard icon="bolt"              label="Potência"     value={carro.potencia} />}
                {carro.torque            && <SpecCard icon="rotate_right"      label="Torque"       value={carro.torque} />}
                {carro.consumo           && <SpecCard icon="local_gas_station" label="Consumo"      value={carro.consumo} />}
                {carro.zero_cem          && <SpecCard icon="speed"             label="0–100 km/h"   value={carro.zero_cem} />}
                {carro.velocidade_maxima && <SpecCard icon="straighten"        label="Vel. máxima"  value={carro.velocidade_maxima} />}
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
            <Button variant="secondary" icon="compare_arrows" iconPosition="left" onClick={() => navigate('/comparar')}>
              Comparar
            </Button>
            {msgFav && <p className="text-sm text-center text-on-surface-variant">{msgFav}</p>}
          </div>
        </div>

      </div>
    </div>
  )
}
