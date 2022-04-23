export type Grade = {
  uc: string
  year: number
  code: string
  result: number
  credits: number
  acronym: string
  semester: number
}

export type Grades = {
  major: string
  grades: Grade[]
}
