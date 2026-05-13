import { Router } from 'express'
import { listarRanking, verificarVoto, votar, removerVoto } from '../controllers/votosController.js'
import { autenticar } from '../middlewares/auth.js'

const router = Router()

router.get('/ranking',            listarRanking)
router.get('/meu-voto/:carroId',  autenticar, verificarVoto)
router.post('/:carroId',          autenticar, votar)
router.delete('/:carroId',        autenticar, removerVoto)

export default router
