export type Course = {
  acronym: string
  year: number
  credits: number
  hours: number
}

export type Teacher = {
  name: string
}

export type CurricularUnit = {
  code: string
  acronym: string
  name: string
  courses: Course[]
  teachers: Teacher[]
  language: string
  objectives: string
  evaluation: string
}