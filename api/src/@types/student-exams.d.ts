export type ExamsMap = {
  studentName: string
  seasons: Season[]
}

export type Season = {
  name: string
  exams: Exam[]
}

export type Exam = {
  curricularUnit: string
  day: string
  date: string
  beginHour: string
  endHour: string
  rooms: string
}
