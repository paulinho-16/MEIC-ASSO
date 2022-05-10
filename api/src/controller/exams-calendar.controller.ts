import { Request, Response } from 'express'

import getExamsCalendarService from '@/services/exams-calendar'

async function getExamsCalendar(req: Request, res: Response) {
  const courseID = req.params.id
  const courseExams = await getExamsCalendarService.getExamsCalendar(courseID)
  return res.status(200).json(courseExams)
}

export default {
    getExamsCalendar,
}