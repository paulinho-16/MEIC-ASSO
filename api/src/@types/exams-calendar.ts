export type Exam = {
    acronym: string
    time?: string
    rooms?: string
  }

export type ExamsCalendar = {
  course: string
  exams: Exam[]

}