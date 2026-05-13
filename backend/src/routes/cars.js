import { Router } from 'express'
import { getCars, getCarById } from '../controllers/carsController.js'

const router = Router()
router.get('/', getCars)
router.get('/:id', getCarById)
export default router
