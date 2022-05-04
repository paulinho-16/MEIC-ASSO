import { Request, Response } from 'express'

import getCurricularUnitInfoService from '@/services/curricular-unit'

async function getCurricularUnitInfo(req: Request, res: Response) {
  const curricularUnitInfo = await getCurricularUnitInfoService.getCurricularUnitInfo()
  return res.status(200).json(curricularUnitInfo)
}

export default {
  getCurricularUnitInfo,
}