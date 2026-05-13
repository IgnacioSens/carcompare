import 'dotenv/config'
import express from 'express'
import cors    from 'cors'
import authRoutes     from './routes/auth.js'
import carrosRoutes   from './routes/carros.js'
import favoritosRoutes from './routes/favoritos.js'
import contatoRoutes   from './routes/contato.js'
import votosRoutes     from './routes/votos.js'

const app  = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use('/api/auth',      authRoutes)
app.use('/api/carros',   carrosRoutes)
app.use('/api/favoritos', favoritosRoutes)
app.use('/api/contato',  contatoRoutes)
app.use('/api/votos',    votosRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', mensagem: 'Servidor CarCompare rodando' })
})

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
