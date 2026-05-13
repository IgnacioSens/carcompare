import { Routes, Route } from 'react-router-dom'
import { Layout }       from './components/layout'
import { Home }         from './pages/Home'
import { Catalog }      from './pages/Catalog'
import { Detail }       from './pages/Detail'
import { Compare }      from './pages/Compare'

import { Login }        from './pages/Login'
import { Favoritos }    from './pages/Favoritos'
import { Ajuda }        from './pages/Ajuda'
import { Contato }      from './pages/Contato'
import { Termos }       from './pages/Termos'
import { Privacidade }  from './pages/Privacidade'
import { Ranking }      from './pages/Ranking'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/"              element={<Home />} />
        <Route path="/catalogo"      element={<Catalog />} />
        <Route path="/carros/:id"    element={<Detail />} />
        <Route path="/comparar"      element={<Compare />} />
        <Route path="/favoritos"     element={<Favoritos />} />
        <Route path="/ajuda"         element={<Ajuda />} />
        <Route path="/contato"       element={<Contato />} />
        <Route path="/termos"        element={<Termos />} />
        <Route path="/privacidade"   element={<Privacidade />} />
        <Route path="/ranking"       element={<Ranking />} />

        <Route path="/login"         element={<Login />} />
      </Routes>
    </Layout>
  )
}
