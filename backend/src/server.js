import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import carRoutes from './routes/cars.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CarCompare API running 🚗' })
})

app.use('/api/cars', carRoutes)

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
