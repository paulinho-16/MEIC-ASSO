import express from 'express'

import controller from '@/controller/curricular-unit.controller'

const router = express.Router()

router.get('/:id', controller.getCurricularUnitInfo)

export default router