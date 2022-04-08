import fetch from 'node-fetch'
import constants from '@/config/constants'

import {
  Meal,
  MealInformation,
  MealInformationRaw,
  MealRaw,
  Menu,
  MenuRaw,
} from '@/@types/meals'

function parseMeals(meals: MealRaw[]): Meal[] {
  return meals.map(meal => {
    const { estado: state, tipo_descr: type, descricao: description } = meal

    return {
      state,
      description,
      type,
    }
  })
}

function parseMenus(menus: MenuRaw[]): Menu[] {
  return menus.map(menu => {
    const { estado: state, data: date, pratos: mealsRaw } = menu

    return {
      state,
      date,
      meals: parseMeals(mealsRaw),
    }
  })
}

function parseMealsInformation(meals: MealInformationRaw): MealInformation {
  return meals.map(meal => {
    const {
      codigo: code,
      descricao: description,
      horario: scheduleRaw,
      ementas: menusRaw,
    } = meal

    const schedule = {
      start: scheduleRaw.split('às')[0].trim(),
      end: scheduleRaw.split('às')[1]?.trim() || undefined,
    }

    return {
      code,
      description,
      schedule,
      menus: parseMenus(menusRaw),
    }
  })
}

async function fetchMealsData() {
  const response = await fetch(constants.canteenUrl)
  const data = await response.json()

  const meals = parseMealsInformation(data)

  return meals
}

export default {
  fetchMealsData,
}
