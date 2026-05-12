import { Router } from 'express'
import { listarCarros, buscarCarro, listarMarcas, listarCategorias } from '../controllers/carrosController.js'

const router = Router()

router.get('/',             listarCarros)
router.get('/:id',          buscarCarro)
router.get('/marcas/todas', listarMarcas)
router.get('/categorias/todas', listarCategorias)

export default router
