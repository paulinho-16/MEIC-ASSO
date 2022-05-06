export type Course = {
  acronym: string
  year: number
  credits: number
  hours: number
}

export type Teacher = {
  name: string
}

export type AssessmentComponent = {
  designation: string
  weight: number
}

export type CourseUnitTime = {
  designation: string
  hours: number
}

export type CurricularUnit = {
  code: string
  acronym: string
  name: string
  courses: Course[]
  teachers: Teacher[]
  language?: string
  objectives?: string
  outcomesAndCompetences?: string
  workingMethod?: string
  requirements?: string
  program?: string
  mandatoryLiterature?: string
  complementaryBibliography?: string
  teachingMethodsAndActivities?: string
  evaluation?: string
  assessmentComponents: AssessmentComponent[]
  courseUnitsTimes: CourseUnitTime[]
  examEligibility?: string
  calculationFormula?: string
  specialAssessment?: string
  classificationImprovement?: string
}