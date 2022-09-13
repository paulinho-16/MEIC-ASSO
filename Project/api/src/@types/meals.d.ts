export type MealRaw = {
  estado: string
  tipo_descr: string
  descricao: string
}

export type MenuRaw = {
  estado: string
  data: Date
  pratos: MealRaw[]
}

export type RestaurantRaw = {
  codigo: number
  descricao: string
  horario: string
  ementas: MenuRaw[]
}

export type MealInformationRaw = RestaurantRaw[]

export type Meal = {
  state: string
  description: string
  type: string
}

export type Menu = {
  state: string
  date: Date
  meals: Meal[]
}

export type Restaurant = {
  code: number
  description: string
  schedule: {
    start: string
    end?: string
  }
  menus: Menu[]
}

export type MealInformation = Restaurant[]
