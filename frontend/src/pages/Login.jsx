import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Input, Button } from '../components/ui'

export function Login() {
  const navigate = useNavigate()
  const [modo, setModo]       = useState('login')
  const [erro, setErro]       = useState('')
  const [sucesso, setSucesso] = useState('')
  const [carregando, setCarregando] = useState(false)

  const [form, setForm] = useState({ nome: '', email: '', senha: '' })

  function atualizar(campo, valor) {
    setForm(f => ({ ...f, [campo]: valor }))
    setErro('')
    setSucesso('')
  }

  async function enviar(e) {
    e.preventDefault()
    setErro('')
    setSucesso('')
    setCarregando(true)

    try {
      if (modo === 'login') {
        const { data } = await axios.post('/api/auth/login', {
          email: form.email,
          senha: form.senha,
        })
        localStorage.setItem('token',   data.token)
        localStorage.setItem('usuario', JSON.stringify(data.usuario))
        navigate('/')

      } else {
        await axios.post('/api/auth/cadastro', {
          nome:  form.nome,
          email: form.email,
          senha: form.senha,
        })
        setSucesso('Cadastro realizado! Verifique seu email e faça o login.')
        setModo('login')
        setForm({ nome: '', email: '', senha: '' })
      }
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao conectar com o servidor.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-float p-8 flex flex-col gap-6">

        {/* Logo */}
        <div className="text-center">
          <span className="text-2xl font-black tracking-tighter text-slate-950">
            CAR<span className="text-primary-container">COMPARE</span>
          </span>
          <p className="text-sm text-on-surface-variant mt-1">
            {modo === 'login' ? 'Entrar na sua conta' : 'Criar conta'}
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={enviar} className="flex flex-col gap-4">
          {modo === 'cadastro' && (
            <Input
              label="Nome"
              placeholder="Seu nome completo"
              value={form.nome}
              onChange={e => atualizar('nome', e.target.value)}
            />
          )}
          <Input
            label="Email"
            type="email"
            placeholder="seuemail@email.com"
            value={form.email}
            onChange={e => atualizar('email', e.target.value)}
          />
          <Input
            label="Senha"
            type="password"
            placeholder="••••••••"
            value={form.senha}
            onChange={e => atualizar('senha', e.target.value)}
          />

          {erro    && <p className="text-sm text-red-600 text-center">{erro}</p>}
          {sucesso && <p className="text-sm text-green-600 text-center">{sucesso}</p>}

          <Button type="submit" variant="primary" fullWidth disabled={carregando}>
            {carregando ? 'Aguarde...' : modo === 'login' ? 'Entrar' : 'Criar conta'}
          </Button>
        </form>

        {/* Alternar modo */}
        <p className="text-center text-sm text-on-surface-variant">
          {modo === 'login' ? 'Não tem conta?' : 'Já tem conta?'}{' '}
          <button
            type="button"
            onClick={() => { setModo(modo === 'login' ? 'cadastro' : 'login'); setErro(''); setSucesso('') }}
            className="text-primary-container font-semibold hover:underline"
          >
            {modo === 'login' ? 'Criar conta' : 'Entrar'}
          </button>
        </p>

      </div>
    </div>
  )
}
