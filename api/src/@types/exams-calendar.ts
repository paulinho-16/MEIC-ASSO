export type Exam = {
    acronym: string
    url?: string
    day?: string
    begin?: string
    duration?: string
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