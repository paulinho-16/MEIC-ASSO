export type Exam = {
    subject?: string
    time?: string
    room?: string
  }

export type ExamsCalendar = {
  course: string
  exams: Exam[]

}