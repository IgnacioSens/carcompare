import { useState } from 'react'
import { Input, Button } from '../components/ui'
import api from '../services/api'

export function Contato() {
  const [form, setForm]           = useState({ nome: '', email: '', mensagem: '' })
  const [enviado, setEnviado]     = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro]           = useState('')

  function atualizar(campo, valor) {
    setForm(f => ({ ...f, [campo]: valor }))
    setErro('')
  }

  async function enviar(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    try {
      await api.post('/contato', form)
      setEnviado(true)
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao enviar mensagem. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 flex flex-col gap-10">
      <div>
        <h1 className="text-3xl font-black text-on-surface">Contato</h1>
        <p className="text-on-surface-variant text-sm mt-2">
          Tem alguma dúvida, sugestão ou problema? Preencha o formulário abaixo e entraremos em contato em breve.
        </p>
      </div>

      {enviado ? (
        <div className="bg-white rounded-2xl shadow-card p-10 flex flex-col items-center gap-4 text-center">
          <span className="material-symbols-outlined text-green-500" style={{ fontSize: 56 }}>check_circle</span>
          <h2 className="font-black text-on-surface text-xl">Mensagem enviada!</h2>
          <p className="text-sm text-on-surface-variant">Agradecemos o contato. Retornaremos em até 2 dias úteis.</p>
          <Button variant="secondary" onClick={() => { setEnviado(false); setForm({ nome: '', email: '', mensagem: '' }) }}>
            Enviar outra mensagem
          </Button>
        </div>
      ) : (
        <form onSubmit={enviar} className="bg-white rounded-2xl shadow-card p-8 flex flex-col gap-5">
          <Input
            label="Nome"
            placeholder="Seu nome completo"
            value={form.nome}
            onChange={e => atualizar('nome', e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            placeholder="seuemail@email.com"
            value={form.email}
            onChange={e => atualizar('email', e.target.value)}
          />
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant ml-1">Mensagem</label>
            <textarea
              placeholder="Descreva sua dúvida ou sugestão..."
              value={form.mensagem}
              onChange={e => atualizar('mensagem', e.target.value)}
              rows={5}
              className="w-full bg-surface-low border border-transparent rounded-lg py-2.5 px-3 text-sm text-on-surface outline-none transition focus:border-primary-container focus:ring-2 focus:ring-primary-container/10 resize-none"
            />
          </div>
          {erro && <p className="text-sm text-red-600">{erro}</p>}
          <Button type="submit" variant="primary" fullWidth disabled={carregando}>
            {carregando ? 'Enviando...' : 'Enviar mensagem'}
          </Button>
        </form>
      )}
    </div>
  )
}
