export type Course = {
  acronym: string
  credits: number
}

export type CurricularUnit = {
  code: string
  acronym: string
  name: string
  courses: Course[]
}