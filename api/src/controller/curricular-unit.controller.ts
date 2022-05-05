import { Request, Response } from 'express'

import getCurricularUnitInfoService from '@/services/curricular-unit'

async function getCurricularUnitInfo(req: Request, res: Response) {
  const curricularUnitID = req.params.id
  const curricularUnitInfo = await getCurricularUnitInfoService.getCurricularUnitInfo(curricularUnitID)
  return res.status(200).json(curricularUnitInfo)
}

export default {
  getCurricularUnitInfo,
}