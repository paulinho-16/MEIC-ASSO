export type Exam = {
    acronym: string
    day?: string
    time?: string
    rooms?: string
  }

export type Season = {
  name: string
  exams: Exam[]
}
export type ExamsCalendar = {
  course: string
  seasons?: Season[]

}