import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../../services/api'

function useUsuario() {
  const raw = localStorage.getItem('usuario')
  return raw ? JSON.parse(raw) : null
}

function useTema() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  function alternar() {
    const novo = !dark
    setDark(novo)
    document.documentElement.classList.toggle('dark', novo)
    localStorage.setItem('tema', novo ? 'dark' : 'light')
  }
  return { dark, alternar }
}

function sair(navigate) {
  localStorage.removeItem('token')
  localStorage.removeItem('usuario')
  navigate('/')
  window.location.reload()
}

// Busca com autocomplete premium
function SearchInput({ onClose }) {
  const navigate = useNavigate()
  const [valor, setValor] = useState('')
  const [todos, setTodos] = useState([])
  const [aberto, setAberto] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    api.get('/carros').then(r => setTodos(r.data)).catch(() => {})
  }, [])

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setAberto(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const sugestoes = valor.trim().length === 0 ? [] : todos.filter(c => {
    const termo = valor.toLowerCase()
    return c.modelo.toLowerCase().includes(termo) || c.marca.toLowerCase().includes(termo)
  }).slice(0, 7)

  function irParaCarro(carro) {
    navigate(`/carros/${carro.id}`)
    setValor(''); setAberto(false); onClose?.()
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (valor.trim()) {
      navigate(`/catalogo?q=${valor.trim()}`)
      setValor(''); setAberto(false); onClose?.()
    }
  }

  return (
    <div ref={ref} className="relative">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" style={{ fontSize: 17 }}>search</span>
          <input
            autoFocus
            value={valor}
            onChange={e => { setValor(e.target.value); setAberto(true) }}
            onFocus={() => valor.trim() && setAberto(true)}
            placeholder="Buscar marca ou modelo..."
            className="w-56 bg-surface-low dark:bg-white/[0.06] border border-outline-variant dark:border-white/10 rounded-xl py-2 pl-9 pr-3 text-sm text-on-surface outline-none focus:border-accent dark:focus:border-accent/50 transition-all"
          />
        </div>
        <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface transition-colors">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
        </button>
      </form>

      <AnimatePresence>
        {aberto && sugestoes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute z-50 top-full mt-2 left-0 w-80 rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(13,13,16,0.95)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
            }}
          >
            {sugestoes.map((c, i) => (
              <motion.button
                key={c.id}
                onMouseDown={() => irParaCarro(c)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.05] transition-colors text-left"
              >
                {c.logo_url && <img src={c.logo_url} alt={c.marca} className="w-5 h-5 object-contain shrink-0 dark:invert opacity-80" />}
                <span className="text-sm text-on-surface flex-1">
                  <span className="font-semibold">{c.marca}</span> {c.modelo}
                </span>
                <span className="text-xs text-on-surface-variant shrink-0">{c.ano}</span>
              </motion.button>
            ))}
            <div
              onMouseDown={handleSubmit}
              className="flex items-center gap-2 px-4 py-2.5 cursor-pointer hover:bg-white/[0.05] transition-colors border-t border-outline-variant"
            >
              <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 15 }}>search</span>
              <span className="text-xs text-on-surface-variant">
                Ver todos os resultados para <span className="font-semibold text-on-surface">"{valor}"</span>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Navbar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const usuario = useUsuario()
  const { dark, alternar } = useTema()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 20) }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { label: 'Comparar', path: '/comparar', icon: 'compare_arrows' },
    { label: 'Ranking',  path: '/ranking',  icon: 'emoji_events' },
  ]

  return (
    <>
      <nav
        className="sticky top-0 w-full h-[64px] z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? dark ? 'rgba(8,8,9,0.92)' : 'rgba(255,255,255,0.92)'
            : dark ? 'rgba(8,8,9,0.6)' : 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          borderBottom: scrolled
            ? dark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.07)'
            : '1px solid transparent',
          boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.15)' : 'none',
        }}
      >
        <div className="max-w-app mx-auto px-5 sm:px-6 flex items-center justify-between w-full h-full gap-4">

          {/* Logo */}
          <button
            onClick={() => { navigate('/'); setMenuOpen(false) }}
            className="active:scale-95 transition-transform select-none flex items-center shrink-0"
          >
            <img src="/logo.png" alt="CarCompare" className="h-12 w-auto object-contain dark:invert" />
          </button>

          {/* Nav links — desktop */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <button
                key={link.label}
                onClick={() => navigate(link.path)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  pathname === link.path
                    ? 'text-on-surface bg-surface-low dark:bg-white/[0.07]'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-low dark:hover:bg-white/[0.04]'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 17 }}>{link.icon}</span>
                {link.label}
              </button>
            ))}
          </div>

          {/* Ações — desktop */}
          <div className="hidden md:flex items-center gap-1.5">

            {/* Dark mode toggle */}
            <button
              onClick={alternar}
              className="p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-low dark:hover:bg-white/[0.06] transition-all"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 19 }}>{dark ? 'light_mode' : 'dark_mode'}</span>
            </button>

            {/* Search */}
            <AnimatePresence mode="wait">
              {searchOpen ? (
                <motion.div
                  key="search-open"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <SearchInput onClose={() => setSearchOpen(false)} />
                </motion.div>
              ) : (
                <motion.button
                  key="search-btn"
                  onClick={() => setSearchOpen(true)}
                  className="p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-low dark:hover:bg-white/[0.06] transition-all"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 19 }}>search</span>
                </motion.button>
              )}
            </AnimatePresence>

            {/* Favoritos */}
            {usuario && (
              <button
                onClick={() => navigate('/favoritos')}
                className="p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-low dark:hover:bg-white/[0.06] transition-all"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 19 }}>favorite</span>
              </button>
            )}

            {/* Auth */}
            {usuario ? (
              <div className="flex items-center gap-3 ml-1">
                <span className="text-sm font-semibold text-on-surface-variant">Olá, {usuario.nome.split(' ')[0]}</span>
                <button
                  onClick={() => sair(navigate)}
                  className="px-4 py-1.5 rounded-lg border border-outline-variant text-on-surface text-sm font-semibold hover:bg-surface-low dark:hover:bg-white/[0.05] transition-all"
                >
                  Sair
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-1.5 rounded-lg border border-outline-variant text-on-surface text-sm font-semibold hover:bg-surface-low dark:hover:bg-white/[0.05] transition-all"
              >
                Entrar
              </button>
            )}

            {/* CTA */}
            <button
              onClick={() => navigate('/catalogo')}
              className="ml-1 px-5 py-2 rounded-xl text-sm font-bold text-white transition-all hover:brightness-110 active:scale-95"
              style={{ background: '#E30613' }}
            >
              Ver Catálogo
            </button>
          </div>

          {/* Mobile — ações */}
          <div className="flex md:hidden items-center gap-1">
            <button onClick={alternar} className="p-2 rounded-lg text-on-surface-variant transition-all">
              <span className="material-symbols-outlined" style={{ fontSize: 21 }}>{dark ? 'light_mode' : 'dark_mode'}</span>
            </button>
            <button onClick={() => { setSearchOpen(v => !v); setMenuOpen(false) }} className="p-2 rounded-lg text-on-surface-variant transition-all">
              <span className="material-symbols-outlined" style={{ fontSize: 21 }}>{searchOpen ? 'close' : 'search'}</span>
            </button>
            <button onClick={() => { setMenuOpen(v => !v); setSearchOpen(false) }} className="p-2 rounded-lg text-on-surface-variant transition-all">
              <span className="material-symbols-outlined" style={{ fontSize: 21 }}>{menuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>

        {/* Search bar mobile */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-outline-variant"
              style={{ background: dark ? 'rgba(8,8,9,0.95)' : 'rgba(255,255,255,0.95)', backdropFilter: 'blur(24px)' }}
            >
              <div className="px-4 py-3">
                <SearchInput onClose={() => setSearchOpen(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Menu mobile */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed top-[64px] left-0 right-0 z-40 flex flex-col py-2"
            style={{
              background: dark ? 'rgba(8,8,9,0.97)' : 'rgba(255,255,255,0.97)',
              backdropFilter: 'blur(24px)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            }}
          >
            {navLinks.map(link => (
              <button
                key={link.label}
                onClick={() => { navigate(link.path); setMenuOpen(false) }}
                className={`flex items-center gap-3 px-6 py-3 text-left text-sm font-semibold transition-colors ${
                  pathname === link.path
                    ? 'text-on-surface bg-surface-low dark:bg-white/[0.05]'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-low dark:hover:bg-white/[0.04]'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{link.icon}</span>
                {link.label}
              </button>
            ))}
            {usuario && (
              <button
                onClick={() => { navigate('/favoritos'); setMenuOpen(false) }}
                className="flex items-center gap-3 px-6 py-3 text-left text-sm font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-low dark:hover:bg-white/[0.04] transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>favorite</span>
                Favoritos
              </button>
            )}

            <div className="mx-6 my-2 border-t border-outline-variant" />

            <div className="px-6 flex flex-col gap-2 pb-3">
              <button
                onClick={() => { navigate('/catalogo'); setMenuOpen(false) }}
                className="w-full py-2.5 rounded-xl text-sm font-bold text-white"
                style={{ background: '#E30613' }}
              >
                Ver Catálogo
              </button>
              {usuario ? (
                <div className="flex items-center justify-between py-1">
                  <span className="text-sm text-on-surface-variant">Olá, <span className="font-semibold text-on-surface">{usuario.nome?.split(' ')[0]}</span></span>
                  <button onClick={() => { sair(navigate); setMenuOpen(false) }} className="text-sm font-semibold text-on-surface-variant hover:text-on-surface">Sair</button>
                </div>
              ) : (
                <button
                  onClick={() => { navigate('/login'); setMenuOpen(false) }}
                  className="w-full border border-outline-variant text-on-surface text-sm font-semibold py-2.5 rounded-xl hover:bg-surface-low dark:hover:bg-white/[0.05] transition-colors"
                >
                  Entrar
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
