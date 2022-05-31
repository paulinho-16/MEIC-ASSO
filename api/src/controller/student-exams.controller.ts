import { Request, Response } from 'express'

import getStudentExamsService from '@/services/student-exams'

async function getStudentExams(req: Request, res: Response) {
  const studentNumber = req.params.studentNumber
  const studentExams = await getStudentExamsService.getStudentExams(studentNumber)
  return res.status(200).json(studentExams)
}

export default {
    getStudentExams,
}