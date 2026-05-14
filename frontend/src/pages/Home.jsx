import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import api from '../services/api'
import { CarCard } from '../components/ui'
import { useTitulo } from '../hooks/useTitulo'

// Contador animado que dispara ao entrar na viewport
function AnimatedCounter({ target, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    const end = parseInt(target)
    let start = 0
    const step = Math.max(1, end / 60)
    const timer = setInterval(() => {
      start = Math.min(start + step, end)
      setCount(Math.floor(start))
      if (start >= end) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target])

  return <span ref={ref}>{count}{suffix}</span>
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.14, duration: 0.75, ease: [0.22, 1, 0.36, 1] }
  }),
}

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

export function Home() {
  useTitulo('')
  const navigate = useNavigate()
  const [carros, setCarros] = useState([])
  const [busca, setBusca] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [recentes, setRecentes] = useState([])

  useEffect(() => {
    api.get('/carros')
      .then(res => setCarros(res.data.slice(0, 6)))
      .catch(console.error)
      .finally(() => setCarregando(false))
    const salvos = JSON.parse(localStorage.getItem('carros_recentes') || '[]')
    setRecentes(salvos)
  }, [])

  function handleBusca(e) {
    e.preventDefault()
    navigate(`/catalogo${busca.trim() ? `?q=${busca.trim()}` : ''}`)
  }

  return (
    <div className="flex flex-col">

      {/* ──────────── HERO ──────────── */}
      <section className="relative text-white overflow-hidden min-h-[100svh] flex items-center">

        {/* Vídeo de fundo */}
        <video
          autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transform: 'scale(1.05)' }}
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>

        {/* Camadas de overlay */}
        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(227,6,19,0.07) 0%, transparent 55%, rgba(0,198,255,0.04) 100%)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-40" style={{ background: 'linear-gradient(to top, #080809, transparent)' }} />

        {/* Glow ambiente */}
        <div className="absolute top-1/3 right-1/3 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(227,6,19,0.15), transparent 70%)' }} />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(0,198,255,0.08), transparent 70%)' }} />

        {/* Conteúdo */}
        <div className="relative z-10 max-w-app mx-auto w-full px-6 sm:px-10 py-32 flex flex-col items-center text-center gap-8">

          {/* Tag */}
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.14)',
                backdropFilter: 'blur(12px)',
                color: 'rgba(255,255,255,0.7)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Plataforma Automotiva
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            custom={1} variants={fadeUp} initial="hidden" animate="visible"
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[88px] font-black tracking-tight leading-[0.9] max-w-5xl"
          >
            Compare com<br />
            <span style={{
              background: 'linear-gradient(135deg, #E30613 0%, #ff4d5a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              precisão
            </span><br />
            de engenharia.
          </motion.h1>

          {/* Subtítulo */}
          <motion.p
            custom={2} variants={fadeUp} initial="hidden" animate="visible"
            className="text-base sm:text-lg max-w-md leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.55)' }}
          >
            Explore mais de 30 modelos, filtre por marca, categoria e combustível — e compare lado a lado.
          </motion.p>

          {/* Search */}
          <motion.form
            custom={3} variants={fadeUp} initial="hidden" animate="visible"
            onSubmit={handleBusca}
            className="flex gap-2 w-full max-w-md"
          >
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ fontSize: 17, color: 'rgba(255,255,255,0.35)' }}>search</span>
              <input
                type="text"
                placeholder="Buscar marca ou modelo..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
                className="w-full rounded-xl py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder-white/30"
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(16px)',
                  color: 'white',
                }}
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 rounded-xl text-sm font-bold text-white shrink-0 transition-all hover:brightness-110 active:scale-95"
              style={{ background: '#E30613' }}
            >
              Buscar
            </button>
          </motion.form>

          {/* Links rápidos */}
          <motion.div
            custom={4} variants={fadeUp} initial="hidden" animate="visible"
            className="flex items-center gap-6"
          >
            <button
              onClick={() => navigate('/catalogo')}
              className="flex items-center gap-1.5 text-sm font-semibold transition-colors hover:text-white"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              Ver catálogo
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>arrow_forward</span>
            </button>
            <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
            <button
              onClick={() => navigate('/comparar')}
              className="flex items-center gap-1.5 text-sm font-semibold transition-colors hover:text-white"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              Comparar agora
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>compare_arrows</span>
            </button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 22, color: 'rgba(255,255,255,0.25)' }}>keyboard_arrow_down</span>
        </motion.div>
      </section>

      {/* ──────────── STATS ──────────── */}
      <section className="py-10 px-6 border-b border-outline-variant bg-surface-container">
        <div className="max-w-app mx-auto grid grid-cols-3 gap-4 text-center">
          {[
            { target: 30, suffix: '+', label: 'Modelos' },
            { target: 20, suffix: '+', label: 'Marcas' },
            { target: 6,  suffix: '',  label: 'Categorias' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.55 }}
            >
              <p className="text-2xl sm:text-3xl font-black text-primary-container">
                <AnimatedCounter target={s.target} suffix={s.suffix} />
              </p>
              <p className="text-[11px] sm:text-sm text-on-surface-variant font-medium mt-0.5 uppercase tracking-widest">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ──────────── DESTAQUES ──────────── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-app mx-auto flex flex-col gap-10">

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="flex items-end justify-between gap-4"
          >
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant mb-1">Seleção</p>
              <h2 className="text-2xl sm:text-3xl font-black text-on-surface">Destaques</h2>
            </div>
            <button
              onClick={() => navigate('/catalogo')}
              className="flex items-center gap-1 text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors pb-1"
            >
              Ver todos
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
            </button>
          </motion.div>

          {carregando ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl bg-surface-container animate-pulse" style={{ height: 260 }} />
              ))}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
            >
              {carros.map(car => (
                <motion.div key={car.id} variants={cardVariant}>
                  <CarCard car={car} />
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <button
              onClick={() => navigate('/catalogo')}
              className="px-8 py-3 rounded-xl text-sm font-bold text-white transition-all hover:brightness-110 active:scale-95"
              style={{ background: '#E30613' }}
            >
              Ver catálogo completo
            </button>
          </motion.div>
        </div>
      </section>

      {/* ──────────── RECENTES ──────────── */}
      {recentes.length > 0 && (
        <section className="py-14 sm:py-20 px-4 sm:px-6 border-t border-outline-variant bg-surface-container">
          <div className="max-w-app mx-auto flex flex-col gap-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant mb-1">Histórico</p>
                <h2 className="text-xl sm:text-2xl font-black text-on-surface">Vistos recentemente</h2>
              </div>
              <button
                onClick={() => { localStorage.removeItem('carros_recentes'); setRecentes([]) }}
                className="text-xs text-on-surface-variant hover:text-on-surface transition-colors font-medium pb-1"
              >
                Limpar
              </button>
            </div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
            >
              {recentes.map(car => (
                <motion.div key={car.id} variants={cardVariant}>
                  <CarCard car={car} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}
    </div>
  )
}
