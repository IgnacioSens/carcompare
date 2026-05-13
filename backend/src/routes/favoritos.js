import { Router } from 'express'
import { listarFavoritos, adicionarFavorito, removerFavorito } from '../controllers/favoritosController.js'
import { autenticar } from '../middlewares/auth.js'

const router = Router()

router.get('/',          autenticar, listarFavoritos)
router.post('/',         autenticar, adicionarFavorito)
router.delete('/:carroId', autenticar, removerFavorito)

export default router
