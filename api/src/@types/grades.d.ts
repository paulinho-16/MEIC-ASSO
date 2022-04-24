export type Grade = {
  uc: string
  year: number
  code: string
  result: number | string
  credits: number
  acronym: string
  semester: number
}

export type MajorGrades = {
  major: string
  grades: Grade[]
}
