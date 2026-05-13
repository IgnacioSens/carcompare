import { Router } from 'express'
import { enviarContato } from '../controllers/contatoController.js'

const router = Router()

router.post('/', enviarContato)

export default router
