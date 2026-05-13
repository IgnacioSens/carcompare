import { useNavigate } from 'react-router-dom'

const nav = [
  { label: 'Início',    path: '/' },
  { label: 'Catálogo',  path: '/catalogo' },
  { label: 'Comparar',  path: '/comparar' },
  { label: 'Favoritos', path: '/favoritos' },
]

const explorar = [
  'Marcas',
  'Categorias',
  'Modelos populares',
  'Veículos econômicos',
]

const suporte = [
  { label: 'Central de ajuda', path: '/ajuda' },
  { label: 'Contato',          path: '/contato' },
  { label: 'Termos de uso',    path: '/termos' },
  { label: 'Privacidade',      path: '/privacidade' },
]

export function Footer() {
  const navigate = useNavigate()

  return (
    <footer style={{ backgroundColor: '#090D26' }} className="text-white mt-auto">

      {/* Corpo */}
      <div className="max-w-app mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* Marca */}
        <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
          <span className="text-2xl font-black tracking-tighter select-none">
            CAR<span className="text-on-primary-container">COMPARE</span>
          </span>
          <p className="text-sm leading-relaxed" style={{ color: '#8b92b8' }}>
            Compare veículos de forma simples, rápida e inteligente. Encontre modelos por marca, categoria e combustível para tomar decisões com mais segurança.
          </p>
        </div>

        {/* Navegação */}
        <div className="flex flex-col gap-4">
          <p className="text-[11px] font-bold tracking-widest uppercase" style={{ color: '#5c6490' }}>
            Navegação
          </p>
          <ul className="flex flex-col gap-3">
            {nav.map(item => (
              <li key={item.label}>
                <button
                  onClick={() => navigate(item.path)}
                  className="text-sm transition-colors duration-200 hover:text-white"
                  style={{ color: '#8b92b8' }}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Explorar */}
        <div className="flex flex-col gap-4">
          <p className="text-[11px] font-bold tracking-widest uppercase" style={{ color: '#5c6490' }}>
            Explorar
          </p>
          <ul className="flex flex-col gap-3">
            {explorar.map(item => (
              <li key={item}>
                <button
                  onClick={() => navigate('/catalogo')}
                  className="text-sm transition-colors duration-200 hover:text-white text-left"
                  style={{ color: '#8b92b8' }}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Suporte */}
        <div className="flex flex-col gap-4">
          <p className="text-[11px] font-bold tracking-widest uppercase" style={{ color: '#5c6490' }}>
            Suporte
          </p>
          <ul className="flex flex-col gap-3">
            {suporte.map(item => (
              <li key={item.label}>
                <button
                  onClick={() => navigate(item.path)}
                  className="text-sm transition-colors duration-200 hover:text-white text-left"
                  style={{ color: '#8b92b8' }}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Rodapé inferior */}
      <div style={{ borderTopColor: '#1a2050' }} className="border-t">
        <div className="max-w-app mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: '#5c6490' }}>
            © 2026 CARCOMPARE. Todos os direitos reservados.
          </p>
          <p className="text-xs text-center sm:text-right" style={{ color: '#3d4466' }}>
            As informações exibidas podem variar conforme versão, ano, região e disponibilidade.
          </p>
        </div>
      </div>

    </footer>
  )
}
